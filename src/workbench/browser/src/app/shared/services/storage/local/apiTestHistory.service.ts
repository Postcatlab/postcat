import { ApiTestHistory } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/local/base.service';
import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/local/dataSource';

export class ApiTestHistoryService extends BaseService<ApiTestHistory> {
  constructor() {
    super(dataSource.apiTestHistory);
  }
}
