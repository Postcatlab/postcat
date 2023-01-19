import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { filter, map, tap, Observable, catchError } from 'rxjs';
// implements StorageInterface
@Injectable()
export class BaseUrlInterceptor extends SettingService implements HttpInterceptor {
  protocolReg = new RegExp('^(http|https)://');
  constructor(private store: StoreService, private messageService: MessageService, private web: WebService) {
    super();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const serverUrl = !this.web.isWeb ? 'https://postcat.com/' : '';
    req = req.clone({
      url: this.protocolReg.test(req.url) ? req.url : `${serverUrl}${req.url}`,
      headers: new HttpHeaders({
        Authorization: this.store.getLoginInfo?.accessToken || ''
      })
    });

    return next.handle(req).pipe(
      filter(event => event instanceof HttpResponse && [200, 201].includes(event.status)),
      map((event: HttpResponse<any>) => event.clone({ body: { status: 200, data: event.body.data, code: event.body.code } })),
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
