import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiCase } from 'pc/browser/src/app/services/storage/db/models';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class DbApiCaseService extends DbBaseService<ApiCase> {
  baseService = new DbBaseService(dataSource.apiCase);
  constructor() {
    super(dataSource.apiCase);
  }
  async bulkCreate(params) {
    return this.baseService.bulkCreate(params.apiCaseList);
  }
}
