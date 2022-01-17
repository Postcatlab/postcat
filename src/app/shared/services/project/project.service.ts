import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { StorageModelService } from '../../../modules/storage/storage.model.service'
import { Group } from '../group/group.model';

/**
 * 项目服务
 */
@Injectable()
export class ProjectService extends StorageModelService {
  /**
   * 表名
   * @type {string}
   */
  protected tableName:string = 'project';

  create(data: Project): Observable<object> {
    return super.create(data);
  }

  bulkCreate(data: Array<Project>): Observable<object> {
    return super.bulkCreate(data);
  }

  update(data: Project, uuid: number|string): Observable<object> {
    return super.update(data, uuid);
  }

}
