import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiTestHistory } from 'pc/browser/src/app/services/storage/db/models';
import { BaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class ApiTestHistoryService extends BaseService<ApiTestHistory> {
  baseService = new BaseService(dataSource.apiTestHistory);

  constructor() {
    super(dataSource.apiTestHistory);
  }

  async bulkDelete(params) {
    const { ids, ...restParams } = params;
    return this.baseService.bulkDelete({
      id: ids,
      ...restParams
    });
  }
}
