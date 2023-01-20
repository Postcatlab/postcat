import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { Mock } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class MockService extends BaseService<Mock> {
  constructor() {
    super(dataSource.mock);
  }
}
