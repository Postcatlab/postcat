import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiResponseOptions } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/api-response.decorator';
import { Workspace } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class WorkspaceService extends BaseService<Workspace> {
  constructor() {
    super(dataSource.workspace);
  }
}
