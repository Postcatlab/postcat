import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, Environment, Group, ApiData, ApiTestHistory, StorageInterface, StorageItem } from '../../index.model';
// implements StorageInterface
@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = 'https://mockapi.eolink.com/sP1lMiZf774b0e7e107c6ac3cd8607c14318770dbfed925/api/v1';
    req = req.clone({
      url: url + req.url,
    });
    return next.handle(req);
  }
}
@Injectable()
export class HttpStorage implements StorageInterface {
  constructor(private http: HttpClient) {
    console.log('eoapi http storage start');
  }
  systemCheck() {
    return this.http.get('/system/status') as Observable<object>;
  }
  // Project
  projectCreate: (item: Project) => Observable<object>;
  projectUpdate: (item: Project, uuid: number | string) => Observable<object>;
  projectBulkUpdate: (items: Array<Project>) => Observable<object>;
  projectRemove: (uuid: number | string) => Observable<Object>;
  projectBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  projectLoad: (uuid: number | string) => Observable<object>;
  projectBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  projectExport: () => Observable<object>;
  // Environment
  environmentCreate: (item: Environment) => Observable<object>;
  environmentUpdate: (item: Environment, uuid: number | string) => Observable<object>;
  environmentBulkCreate: (items: Array<Environment>) => Observable<object>;
  environmentBulkUpdate: (items: Array<Environment>) => Observable<object>;
  environmentRemove: (uuid: number | string) => Observable<object>;
  environmentBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  environmentLoad: (uuid: number | string) => Observable<object>;
  environmentBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  environmentLoadAllByProjectID: (projectID: number | string) => Observable<object>;
  // Group
  groupCreate: (item: Group) => Observable<object>;
  groupUpdate: (item: Group, uuid: number | string) => Observable<object>;
  groupBulkCreate: (items: Array<Group>) => Observable<object>;
  groupBulkUpdate: (items: Array<Group>) => Observable<object>;
  groupRemove: (uuid: number | string) => Observable<object>;
  groupBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  groupLoad: (uuid: number | string) => Observable<object>;
  groupBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  groupLoadAllByProjectID(projectID) {
    return this.http.post('/group/loadAllByConditions', {
      projectID,
    }) as Observable<object>;
  }
  // Api Data
  apiDataCreate: (item: ApiData) => Observable<object>;
  apiDataUpdate: (item: ApiData, uuid: number | string) => Observable<object>;
  apiDataBulkCreate: (items: Array<ApiData>) => Observable<object>;
  apiDataBulkUpdate: (items: Array<ApiData>) => Observable<object>;
  apiDataRemove: (uuid: number | string) => Observable<object>;
  apiDataBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  apiDataLoad: (uuid: number | string) => Observable<object>;
  apiDataBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  apiDataLoadAllByProjectID(projectID: number | string) {
    return this.http.post('/apiData/loadAllByConditions', {
      projectID,
    }) as Observable<object>;
  }
  apiDataLoadAllByGroupID: (groupID: number | string) => Observable<object>;
  apiDataLoadAllByProjectIDAndGroupID: (
    projectID: number | string,
    groupID: number | string
  ) => Observable<object>;
  // Api Test History
  apiTestHistoryCreate: (item: ApiTestHistory) => Observable<object>;
  apiTestHistoryUpdate: (item: ApiTestHistory, uuid: number | string) => Observable<object>;
  apiTestHistoryBulkCreate: (items: Array<ApiTestHistory>) => Observable<object>;
  apiTestHistoryBulkUpdate: (items: Array<ApiTestHistory>) => Observable<object>;
  apiTestHistoryRemove: (uuid: number | string) => Observable<object>;
  apiTestHistoryBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  apiTestHistoryLoad: (uuid: number | string) => Observable<object>;
  apiTestHistoryBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  apiTestHistoryLoadAllByProjectID: (projectID: number | string) => Observable<object>;
  apiTestHistoryLoadAllByApiDataID: (apiDataID: number | string) => Observable<object>;
}
