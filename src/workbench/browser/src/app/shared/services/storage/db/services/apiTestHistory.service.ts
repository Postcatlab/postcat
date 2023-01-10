import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';
import { ApiTestHistory } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

export class ApiTestHistoryService extends BaseService<ApiTestHistory> {
  constructor() {
    super(dataSource.apiTestHistory);
  }
}
