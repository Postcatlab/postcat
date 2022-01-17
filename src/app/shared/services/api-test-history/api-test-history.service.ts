import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiTestHistory } from './api-test-history.model';
import { StorageModelService } from '../../../modules/storage/storage.model.service';
import { Query, QueryOrder } from '../../../modules/storage/storage.config';

/**
 * ApiTestHistory model service.
 */
@Injectable()
export class ApiTestHistoryService extends StorageModelService {
  /**
   * Table name.
   * @type {string}
   */
  protected tableName: string = 'apiTestHistory';

  create(data: ApiTestHistory): Observable<object> {
    return super.create(data);
  }

  bulkCreate(data: Array<ApiTestHistory>): Observable<object> {
    return super.bulkCreate(data);
  }

  update(data: ApiTestHistory, uuid: number | string): Observable<object> {
    return super.update(data, uuid);
  }

  loadAllByProjectID(projectID: string | number): Observable<Array<object>> {
    const query: Query = {
      where: { projectID: projectID },
    };
    return this.loadAllBy(query);
  }

  loadAllByApiDataID(apiDataID: string | number): Observable<Array<object>> {
    const query: Query = {
      where: { apiDataID: apiDataID },
      sort: { key: 'createdAt', order: QueryOrder.DESC },
    };
    return this.loadAllBy(query);
  }
}
