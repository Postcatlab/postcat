import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Project,
  Environment,
  Group,
  ApiData,
  ApiTestHistory,
  StorageInterface,
  ApiMockEntity,
} from '../../index.model';

@Injectable()
export class HttpStorage implements StorageInterface {
  constructor(private http: HttpClient) {
    console.log('eoapi http storage start');
  }
  systemCheck() {
    return this.http.get('/system/status') as Observable<object>;
  }
  // Project
  projectImport(uuid: number, item: Project) {
    return this.http.put(`/project/${uuid}/import`, item) as Observable<object>;
  }
  // Project collections
  projectCollections(uuid: number) {
    return this.http.get(`/project/${uuid}/collections`) as Observable<object>;
  }
  projectCreate(item: Project) {
    return this.http.post(`/project`, item) as Observable<object>;
  }
  projectUpdate(item: Project, uuid: number | string) {
    return this.http.put(`/project/${uuid}`, item) as Observable<object>;
  }
  projectBulkUpdate: (items: Array<Project>) => Observable<object>;
  projectRemove(uuid: number | string) {
    return this.http.delete(`/project/${uuid}`) as Observable<object>;
  }
  projectBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  projectLoad: (uuid: number | string) => Observable<object>;
  projectBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  projectExport(projectID) {
    return this.http.get(`/project/${projectID}/export`) as Observable<object>;
  }
  // Environment
  environmentCreate(item: Environment) {
    return this.http.post(`/environment`, item) as Observable<object>;
  }
  environmentUpdate(item: Environment, uuid: number | string) {
    return this.http.put(`/environment/${uuid}`, item) as Observable<object>;
  }
  environmentBulkCreate: (items: Array<Environment>) => Observable<object>;
  environmentBulkUpdate: (items: Array<Environment>) => Observable<object>;
  environmentRemove(uuid: number | string) {
    return this.http.delete(`/environment/${uuid}`) as Observable<object>;
  }
  environmentBulkRemove: (uuids: Array<number | string>) => Observable<object>;
  environmentLoad(uuid: number | string) {
    return this.http.get(`/environment/${uuid}`) as Observable<object>;
  }
  environmentBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  environmentLoadAllByProjectID(projectID: number | string) {
    return this.http.get(`/environment?projectID=${projectID}`) as Observable<object>;
  }
  // Group
  groupCreate(item: Group) {
    return this.http.post(`/group`, item) as Observable<object>;
  }
  groupUpdate(item: Group, uuid: number | string) {
    return this.http.put(`/group/${uuid}`, item) as Observable<object>;
  }
  groupBulkCreate: (items: Array<Group>) => Observable<object>;
  groupBulkUpdate(items: Array<Group>) {
    return this.http.put(`/group/batch`, items) as Observable<object>;
  }
  groupRemove(uuid: number | string) {
    return this.http.delete(`/group?uuids=[${uuid}]`) as Observable<object>;
  }
  groupBulkRemove(uuids: Array<number | string>) {
    return this.http.delete(`/group?uuids=[${uuids}]`) as Observable<object>;
  }
  groupLoad: (uuid: number | string) => Observable<object>;
  groupBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  groupLoadAllByProjectID(projectID) {
    return this.http.get(`/group?projectID=${projectID}`) as Observable<object>;
  }
  // Api Data
  apiDataCreate(item: ApiData) {
    return this.http.post(`/api_data`, item) as Observable<object>;
  }
  apiDataUpdate(item: ApiData, uuid: number | string) {
    return this.http.put(`/api_data/${uuid}`, item) as Observable<object>;
  }
  apiDataBulkCreate: (items: Array<ApiData>) => Observable<object>;
  apiDataBulkUpdate(items: Array<ApiData>) {
    return this.http.put(`/api_data/batch`, items) as Observable<object>;
  }
  apiDataRemove(uuid: number | string) {
    return this.http.delete(`/api_data?uuids=[${uuid}]`) as Observable<object>;
  }
  apiDataBulkRemove(uuids: Array<number | string>) {
    return this.http.delete(`/api_data?uuids=[${uuids}]`) as Observable<object>;
  }
  apiDataLoad(uuid: number | string) {
    return this.http.get(`/api_data/${uuid}`) as Observable<object>;
  }
  apiDataBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  apiDataLoadAllByProjectID(projectID: number | string) {
    return this.http.get(`/api_data?projectID=${projectID}`) as Observable<object>;
  }
  apiDataLoadAllByGroupID: (groupID: number | string) => Observable<object>;
  apiDataLoadAllByProjectIDAndGroupID: (projectID: number | string, groupID: number | string) => Observable<object>;
  // Api Test History
  apiTestHistoryCreate(item: ApiTestHistory) {
    return this.http.post(`/api_test_history`, item) as Observable<object>;
  }
  apiTestHistoryUpdate: (item: ApiTestHistory, uuid: number | string) => Observable<object>;
  apiTestHistoryBulkCreate: (items: Array<ApiTestHistory>) => Observable<object>;
  apiTestHistoryBulkUpdate: (items: Array<ApiTestHistory>) => Observable<object>;
  apiTestHistoryRemove(uuid: number | string) {
    return this.http.delete(`/api_test_history?uuids=[${uuid}]`) as Observable<object>;
  }
  apiTestHistoryBulkRemove(uuids: Array<number | string>) {
    return this.http.delete(`/api_test_history?uuids=[${uuids}]`) as Observable<object>;
  }
  apiTestHistoryLoad(uuid: number | string) {
    return this.http.get(`/api_test_history/${uuid}`) as Observable<object>;
  }
  apiTestHistoryBulkLoad: (uuids: Array<number | string>) => Observable<object>;
  apiTestHistoryLoadAllByProjectID(projectID: number | string) {
    return this.http.get(`/api_test_history?projectID=${projectID}`) as Observable<object>;
  }
  apiTestHistoryLoadAllByApiDataID(apiDataID: number | string) {
    return this.http.get(`/api_test_history?apiDataID=${apiDataID}`) as Observable<object>;
  }
  mockCreate(item: ApiMockEntity) {
    if (typeof item.response !== 'string') {
      item.response = JSON.stringify(item.response);
    }
    const obj = { ...item };
    delete obj.url;
    return this.http.post('/mock', obj) as Observable<object>;
  }
  mockLoad(uuid: number | string): Observable<object> {
    return this.http.get(`/mock/${uuid}`) as Observable<object>;
  }
  mockRemove(uuid: number | string): Observable<object> {
    return this.http.delete(`/mock/${uuid}`);
  }
  mockUpdate(item: ApiMockEntity, uuid: number | string): Observable<object> {
    if (typeof item.response !== 'string') {
      item.response = JSON.stringify(item.response);
    }
    const obj = { ...item };
    delete obj.url;
    return this.http.put(`/mock/${uuid}`, obj);
  }
  apiMockLoadAllByApiDataID(apiDataID: number | string): Observable<object> {
    return this.http.get(`/mock?apiDataID=${apiDataID}`);
  }

  getWorkspaceInfo(workspaceID: number): Observable<object> {
    return this.http.get(`/workspace/${workspaceID}`);
  }
}
