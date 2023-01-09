import { Project } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/local/base.service';
import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/local/dataSource';

export class ProjectService extends BaseService<Project> {
  constructor() {
    super(dataSource.project);
  }
}
