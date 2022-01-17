import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from './group.model';
import { StorageModelService } from '../../../modules/storage/storage.model.service'
import { Query } from '../../../modules/storage/storage.config';

/**
 * Group model service.
 */
@Injectable()
export class GroupService extends StorageModelService {
  /**
   * Table name.
   * @type {string}
   */
  protected tableName:string = 'group';

  create(data: Group): Observable<object> {
    if (!data.weight) {
      data.weight = 0;
    }
    if (!data.parentID) {
      data.parentID = 0;
    }
    return super.create(data);
  }

  bulkCreate(data: Array<Group>): Observable<object> {
    data = data.map(item => {
      if (!item.weight) {
        item.weight = 0;
      }
      if (!item.parentID) {
        item.parentID = 0;
      }
      return item;
    });
    return super.bulkCreate(data);
  }

  update(data: Group, uuid: number|string): Observable<object> {
    return super.update(data, uuid);
  }

  loadAllByProjectID(projectID: string|number): Observable<Array<object>> {
    const query: Query = {
      where: {projectID: projectID}
    };
    return this.loadAllBy(query);
  }

}
