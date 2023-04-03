import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiTestHistory } from 'pc/browser/src/app/services/storage/db/models';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class DbApiTestHistoryService extends DbBaseService<ApiTestHistory> {
  constructor() {
    super(dataSource.apiTestHistory);
  }
}
