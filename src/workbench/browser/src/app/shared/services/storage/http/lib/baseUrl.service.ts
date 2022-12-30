import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { filter, map, tap, Observable, catchError } from 'rxjs';

import { uniqueSlash } from '../../../../../utils/api';

const interceptorPaths = ['/api_data', '/group', '/api_test_history', '/mock', '/environment', '/shared'];
const needWorkspaceIDPrefixPaths = ['/project'];
const sharePaths = ['/shared-docs'];
const noPrefix = ['https://', 'http://'];

// implements StorageInterface
@Injectable()
export class BaseUrlInterceptor extends SettingService implements HttpInterceptor {
  get projectID() {
    return this.store.getCurrentProjectID;
  }
  get workspaceID() {
    return this.store.getCurrentWorkspaceID;
  }
  get apiPrefix() {
    return `/${this.workspaceID}/${this.projectID}/`;
  }
  constructor(private store: StoreService, private messageService: MessageService, private web: WebService) {
    super();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = this.getConfiguration('backend.url') || '';
    const token = StorageUtil.get('accessToken') || '';
    let targetUrl;
    if ((targetUrl = sharePaths.find(n => req.url.startsWith(n)))) {
      //Share page
      req = req.clone({
        url: req.url.replace(targetUrl, `/api${targetUrl}`)
      });
    } else if ((targetUrl = interceptorPaths.find(n => req.url.startsWith(n)))) {
      req = req.clone({
        url: req.url.replace(targetUrl, `${this.apiPrefix}${targetUrl}`)
      });
    } else if ((targetUrl = needWorkspaceIDPrefixPaths.find(n => req.url.startsWith(n)))) {
      req = req.clone({
        url: req.url.replace(targetUrl, `/${this.workspaceID}/${targetUrl}`)
      });
    }
    req = req.clone({
      url: noPrefix.find(n => req.url.startsWith(n)) ? req.url : uniqueSlash(`${url}/api/${req.url}`).replace(/(\/api){1,}/g, '/api'),
      headers: new HttpHeaders({
        Authorization: token
      })
    });

    return next.handle(req).pipe(
      filter(event => event instanceof HttpResponse && [200, 201].includes(event.status)),
      map((event: HttpResponse<any>) => event.clone({ body: { status: 200, data: event.body.data } })),
      tap((event: any) => {}),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.store.clearAuth();
            if (this.store.remoteUrl && !this.store.isLocal) {
              this.messageService.send({ type: 'login', data: {} });
            }
          }
          if ([500, 502, 503, 504].includes(err.status)) {
            this.messageService.send({ type: 'server-fail', data: {} });
          }
        }
        return err;
      })
    );
  }
}
