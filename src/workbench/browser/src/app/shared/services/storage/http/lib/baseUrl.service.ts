import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { filter, map, Observable } from 'rxjs';
const protocolReg = new RegExp('^(http|https)://');

// implements StorageInterface
@Injectable()
export class BaseUrlInterceptor extends RemoteService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url = '', token = '' } = this.getConfiguration('eoapi-common.remoteServer') || {};
    req = req.clone({
      url: protocolReg.test(req.url) ? req.url : url + req.url,
      headers: req.headers.append('x-api-key', token),
    });

    return next.handle(req).pipe(
      filter((event) => event instanceof HttpResponse && [200, 201].includes(event.status)),
      map((event: HttpResponse<any>) => event.clone({ body: { status: 200, data: event.body.data } }))
    );
  }
}
