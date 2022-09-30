import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { filter, map, Observable } from 'rxjs';
import { uniqueSlash } from '../../../../../utils/api';
const protocolReg = new RegExp('^(http|https)://');

// implements StorageInterface
@Injectable()
export class BaseUrlInterceptor extends SettingService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url = '' } = this.getConfiguration('eoapi-common.remoteServer') || {};
    const token = StorageUtil.get('accessToken') || '';
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
