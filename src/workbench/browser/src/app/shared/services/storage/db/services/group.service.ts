import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class GroupService extends BaseService<Group> {
  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;

  constructor() {
    super(dataSource.group);
  }

  /** 删除分组之后，将会删除与被删除的分组下的所有数据 */
  async afterDelete({ params, result }) {
    if (result.code === 0 && result.data > 0) {
      const groupId = params.id;
      this.apiDataTable.filter(item => item.groupId === groupId).delete();
      const groupChildren = await this.apiGroupTable.where({ parentId: groupId });
      (await groupChildren.toArray()).forEach(group => this.afterDelete({ params: group, result }));
      const delResult = await groupChildren.delete();
      console.log('afterBulkDelete 删除分组', delResult);
    }
  }
}
