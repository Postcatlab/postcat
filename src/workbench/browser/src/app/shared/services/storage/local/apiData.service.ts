import { IndexableType } from 'dexie';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/local/base.service';
import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/local/dataSource';

export class ApiDataService extends BaseService<ApiData> {
  constructor() {
    super(dataSource.apiData);
  }

  afterCreate(params: any) {
    return Promise.resolve(12);
  }
}
