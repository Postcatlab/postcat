import { Injectable, Injector } from '@angular/core';
import { StorageHandleStatus } from './index.model';
import { IndexedDBStorage } from './IndexedDB/lib';
import { HttpStorage } from './http/lib';
import { isNotEmpty } from '../../../../../../../shared/common/common';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http';
import { map, Observable } from 'rxjs';
class StorageInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    console.log('interceptor');
    const jwtReq = req.clone({
      headers: req.headers.set('token', 'asdf'),
    });
    return next.handle(jwtReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          switch (event.status) {
            case 401:
              location.href = '';
              break;
            case 200:
              break;
            case 404:
              break;
          }
        }
        return event;
      })
    );
  }
}
/**
 * @description
 * A storage service
 */
export class StorageService {
  instance;
  constructor(private injector: Injector) {
    console.log('StorageService init');
    // this.instance=new IndexedDBStorage();
    this.instance = this.injector.get(HttpStorage);
  }
  /**
   * Handle data from IndexedDB
   *
   * @param args
   */
  run(action: string, params: Array<any>, callback): void {
    const handleResult = {
      status: StorageHandleStatus.invalid,
      data: undefined,
      callback: callback,
    };
    this.instance[action](...params).subscribe(
      (result: any) => {
        handleResult.data = result;
        if (isNotEmpty(result)) {
          handleResult.status = StorageHandleStatus.success;
        } else {
          handleResult.status = StorageHandleStatus.empty;
        }
        callback(handleResult);
      },
      (error: any) => {
        handleResult.status = StorageHandleStatus.error;
        callback(handleResult);
      }
    );
  }
}
