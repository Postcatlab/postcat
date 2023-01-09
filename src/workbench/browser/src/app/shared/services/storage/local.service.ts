import { Injectable } from '@angular/core';

import { db } from './db';

const ErrorStyle = 'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

const SuccessStyle = 'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  constructor() {}

  api_environmentCreate(params) {
    return new Promise(resolve => {
      db.environment
        .create(params)
        .then(({ status, data }: any) => {
          console.log('%c environment - create 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c environment - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }
}
