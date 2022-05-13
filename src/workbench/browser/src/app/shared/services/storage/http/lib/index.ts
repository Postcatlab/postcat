import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Project,
  Environment,
  Group,
  ApiData,
  ApiTestHistory,
  StorageInterface,
  StorageItem,
} from '../../index.model';
// implements StorageInterface
@Injectable()
export class HttpStorage {
  constructor(private http: HttpClient) {
    console.log('eoapi http storage start');
  }
  /**
   * Load all group items by projectID.
   * @param projectID
   */
  groupLoadAllByProjectID(projectID: number | string): Observable<Object> {
    return this.http.get('/assets/header.json');
  }
}

