import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';
import { Environment } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

export class EnvironmentService extends BaseService<Environment> {
  constructor() {
    super(dataSource.environment);
  }
}
