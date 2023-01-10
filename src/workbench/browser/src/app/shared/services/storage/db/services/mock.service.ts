import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';
import { Mock } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

export class MockService extends BaseService<Mock> {
  constructor() {
    super(dataSource.mock);
  }
}
