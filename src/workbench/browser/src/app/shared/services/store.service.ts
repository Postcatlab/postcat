import { Injectable } from '@angular/core';

@Injectable()
export class StoreService {
  env = {
    parameters: [],
    hostUri: '',
  };
  constructor() {}
  setEnv(data) {
    this.env = Object.assign(this.env, data);
  }
}
