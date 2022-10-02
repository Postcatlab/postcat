import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { filter, map, Observable } from 'rxjs';
import { uniqueSlash } from '../../../../../utils/api';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service';
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service';

const protocolReg = new RegExp('^(http|https)://');

const interceptorPaths = ['/api_data', '/group', '/api_test_history', '/mock', '/environment'];
const needWorkspaceIDPrefixPaths = ['/project'];

// implements StorageInterface
@Injectable()
export class BaseUrlInterceptor extends SettingService implements HttpInterceptor {
  get apiPrefix() {
    return `/${this.workspaceService.currentWorkspaceID}/${this.projectService.currentProjectID}`;
  }
  constructor(private workspaceService: WorkspaceService, private projectService: ProjectService) {
    super();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url = '' } = this.getConfiguration('eoapi-common.remoteServer') || {};
    const token = StorageUtil.get('accessToken') || '';

    let targetUrl;
    if ((targetUrl = interceptorPaths.find((n) => req.url.startsWith(n)))) {
      req = req.clone({
        url: req.url.replace(targetUrl, `${this.apiPrefix}/${targetUrl}`),
      });
    } else if ((targetUrl = needWorkspaceIDPrefixPaths.find((n) => req.url.startsWith(n)))) {
      req = req.clone({
        url: req.url.replace(targetUrl, `/${this.workspaceService.currentWorkspaceID}/${targetUrl}`),
      });
    }
    req = req.clone({
      url: uniqueSlash(protocolReg.test(req.url) ? req.url : url + req.url),
      headers: req.headers.append('Authorization', token),
    });

    return next.handle(req).pipe(
      filter((event) => event instanceof HttpResponse && [200, 201].includes(event.status)),
      map((event: HttpResponse<any>) => event.clone({ body: { status: 200, data: event.body.data } }))
    );
  }
}
