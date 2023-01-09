import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/base.service';
import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { Group } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

export class GroupService extends BaseService<Group> {
  constructor() {
    super(dataSource.group);
  }
}
