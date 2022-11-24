import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { action, computed, makeObservable, reaction, observable } from 'mobx';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  // observable data
  @observable.shallow env = {
    hostUri: '',
    parameters: [],
    frontURI: '',
  };

  // computed data
  @computed get getEnv() {
    return this.env;
  }

  constructor() {
    makeObservable(this); // don't forget to add this if the class has observable fields
  }

  // actions
  @action changeEnv(data) {
    this.env =
      data == null
        ? {
            hostUri: '',
            parameters: [],
            frontURI: '',
          }
        : data;
  }
}
