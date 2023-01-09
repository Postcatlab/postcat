import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/base.service';
import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { Project } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

export class ProjectService extends BaseService<Project> {
  constructor() {
    super(dataSource.project);
  }
}
