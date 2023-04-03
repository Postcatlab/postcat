import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { Workspace } from 'pc/browser/src/app/services/storage/db/models';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class DbWorkspaceService extends DbBaseService<Workspace> {
  baseService = new DbBaseService(dataSource.workspace);

  constructor() {
    super(dataSource.workspace);
  }

  async bulkRead(params: Record<string, any>) {
    const result = await this.baseService.bulkRead(params);

    result.data.forEach(item => {
      item.title = $localize`Personal Workspace`;
    });

    return result;
  }
}
