import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { Mock } from 'pc/browser/src/app/services/storage/db/models';
import { BaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class MockService extends BaseService<Mock> {
  constructor() {
    super(dataSource.mock);
  }
}
