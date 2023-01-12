import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { Workspace } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class WorkspaceService extends BaseService<Workspace> {
  constructor() {
    super(dataSource.workspace);
  }
}
