import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiData } from './api-data.model';
import { StorageModelService } from '../../../modules/storage/storage.model.service';
import { Query } from '../../../modules/storage/storage.config';

/**
 * API数据服务
 */
@Injectable()
export class ApiDataService extends StorageModelService {
  /**
   * 表名
   * @type {string}
   */
  protected tableName: string = 'apiData';

  create(data: ApiData): Observable<object> {
    if (!data.weight) {
      data.weight = 0;
    }
    return super.create(data);
  }

  bulkCreate(data: Array<ApiData>): Observable<object> {
    data = data.map((item) => {
      if (!item.weight) {
        item.weight = 0;
      }
      return item;
    });
    return super.bulkCreate(data);
  }

  update(data: ApiData, uuid: number | string): Observable<object> {
    return super.update(data, uuid);
  }

  loadAllByProjectID(projectID: string | number): Observable<Array<object>> {
    const query: Query = {
      where: { projectID: projectID },
    };
    return this.loadAllBy(query);
  }

  loadAllByGroupID(groupID: string | number): Observable<Array<object>> {
    const query: Query = {
      where: { groupID: groupID },
    };
    return this.loadAllBy(query);
  }

  loadAllByProjectIDAndGroupID(projectID: string | number, groupID: string | number): Observable<Array<object>> {
    const query: Query = {
      where: { projectID: projectID, groupID: groupID },
    };
    return this.loadAllBy(query);
  }
}
