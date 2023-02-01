import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { filter, map, tap, Observable, catchError } from 'rxjs';
// implements StorageInterface

enum CODE {
  Unlogin = 132000006
}

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  protocolReg = new RegExp('^(http|https)://');
  constructor(private store: StoreService, private messageService: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const serverUrl = this.store.remoteUrl || '';
    req = req.clone({
      url: this.protocolReg.test(req.url) ? req.url : `${serverUrl}${req.url}`,
      headers: new HttpHeaders({
        Authorization: this.store.getLoginInfo?.accessToken || ''
      })
    });

    return next.handle(req).pipe(
      filter(event => event instanceof HttpResponse && [200, 201].includes(event.status)),
      map((event: HttpResponse<any>) => event.clone({ body: { status: 200, data: event.body.data, code: event.body.code } })),
      tap((event: any) => {
        const { code } = event.body;
        const isLocal = this.store.isLocal;
        if (!isLocal && code == CODE.Unlogin) {
          this.store.setLoginInfo();
          this.messageService.send({ type: 'login', data: {} });
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if ([500, 502, 503, 504].includes(err.status)) {
            this.messageService.send({ type: 'server-fail', data: {} });
          }
        }
        return err;
      })
    );
  }
}
