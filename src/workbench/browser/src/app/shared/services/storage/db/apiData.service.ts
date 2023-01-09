import { IndexableType } from 'dexie';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/base.service';
import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

export class ApiDataService extends BaseService<ApiData> {
  constructor() {
    super(dataSource.apiData);
  }

  // create(params): Promise<IndexableType> {
  //   console.log('afterCreate', params);
  //   return Promise.resolve(12);
  // }
}
