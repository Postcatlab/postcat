import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from './environment.model';
import { StorageModelService } from '../../../modules/storage/storage.model.service'
import { Query } from '../../../modules/storage/storage.config';
import { Group } from '../group/group.model';

/**
 * 环境服务
 */
@Injectable()
export class EnvironmentService extends StorageModelService {
  /**
   * 表名
   * @type {string}
   */
  protected tableName:string = 'environment';

  create(data: Environment): Observable<object> {
    return super.create(data);
  }

  bulkCreate(data: Array<Environment>): Observable<object> {
    return super.bulkCreate(data);
  }

  update(data: Environment, uuid: number|string): Observable<object> {
    return super.update(data, uuid);
  }

  loadAllByProjectID(projectID: string|number): Observable<Array<object>> {
    const query: Query = {
      where: {projectID: projectID}
    };
    return this.loadAllBy(query);
  }

}
