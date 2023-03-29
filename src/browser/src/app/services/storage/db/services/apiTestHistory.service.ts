import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiTestHistory } from 'pc/browser/src/app/services/storage/db/models';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class DbApiTestHistoryService extends DbBaseService<ApiTestHistory> {
  baseService = new DbBaseService(dataSource.apiTestHistory);

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
