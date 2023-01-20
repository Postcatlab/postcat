import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { Environment } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class EnvironmentService extends BaseService<Environment> {
  constructor() {
    super(dataSource.environment);
  }
}
