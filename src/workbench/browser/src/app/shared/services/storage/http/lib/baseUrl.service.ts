import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingService } from 'eo/workbench/browser/src/app/modules/setting/settings.service';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { filter, map, tap, Observable, catchError } from 'rxjs';
import { uniqueSlash } from '../../../../../utils/api';
import { version2Number } from 'eo/workbench/browser/src/app/utils/index.utils';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service'

const protocolReg = new RegExp('^(http|https)://');

const interceptorPaths = ['/api_data', '/group', '/api_test_history', '/mock', '/environment', '/shared'];
const needWorkspaceIDPrefixPaths = ['/project'];
const sharePaths = ['/shared-docs'];
const noPrefix = ['https://', 'http://'];

// implements StorageInterface
@Injectable()
export class BaseUrlInterceptor extends SettingService implements HttpInterceptor {
  get apiPrefix() {
    return `/${this.workspaceID}/${this.projectID}/`;
  }
  get projectID() {
    return this.effect.currentProjectID;
  }
  get workspaceID() {
    return this.store.getCurrentWorkspaceInfo.id;
  }
  prefix;
  constructor(
    private store: StoreService,
    private effect: EffectService,
    private messageService: MessageService,
    private web: WebService
  ) {
    super();
    //* Web deploy from v1.9.1
    this.prefix = this.web.isWeb ? '/api/' : '/';
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url = '' } = this.getConfiguration('eoapi-common.remoteServer') || {};
    const token = StorageUtil.get('accessToken') || '';

    let targetUrl;
    if ((targetUrl = sharePaths.find((n) => req.url.startsWith(n)))) {
      req = req.clone({
        url: req.url.replace(targetUrl, `/api${targetUrl}`),
      });
    } else if ((targetUrl = interceptorPaths.find((n) => req.url.startsWith(n)))) {
      req = req.clone({
        url: req.url.replace(targetUrl, `${this.apiPrefix}${targetUrl}`),
      });
    } else if ((targetUrl = needWorkspaceIDPrefixPaths.find((n) => req.url.startsWith(n)))) {
      req = req.clone({
        url: req.url.replace(targetUrl, `/${this.workspaceID}/${targetUrl}`),
      });
    }
    req = req.clone({
      url: noPrefix.find((n) => req.url.startsWith(n))
        ? req.url
        : uniqueSlash(url + this.prefix + req.url).replace(/(\/api){1,}/g, '/api'),
      headers: new HttpHeaders({
        Authorization: token,
      }),
    });

    return next.handle(req).pipe(
      filter((event) => event instanceof HttpResponse && [200, 201].includes(event.status)),
      map((event: HttpResponse<any>) => event.clone({ body: { status: 200, data: event.body.data } })),
      tap((event: any) => {
        // ! TODO delete
        if (req.url.includes('/system/status')) {
          const { data } = event.body;
          this.prefix = version2Number(data) >= version2Number('v1.9.0') ? '/api' : '/';
          StorageUtil.set('server_version', data);
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 && this.workspaceID !== -1) {
            this.messageService.send({ type: 'login', data: {} });
          }
        }
        return err;
      })
    );
  }
}
