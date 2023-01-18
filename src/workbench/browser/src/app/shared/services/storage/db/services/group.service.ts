import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { GroupDeleteDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/group.dto';
import { Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class GroupService extends BaseService<Group> {
  baseService = new BaseService(dataSource.group);

  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;

  constructor() {
    super(dataSource.group);
  }

  async bulkRead(params) {
    const result = await this.baseService.bulkRead(params);
    const genGroupTree = (groups: Group[], paranId) => {
      return groups
        .filter(n => n.parentId === paranId)
        .map(m => ({
          ...m,
          children: genGroupTree(groups, m.id)
        }));
    };
    const rootGroup = result.data?.find(n => n.depth === 0);
    rootGroup['children'] = genGroupTree(result.data, rootGroup?.id);
    result.data = [rootGroup];
    return result;
  }

  async delete(params: GroupDeleteDto) {
    const result = await this.baseService.delete(params);
    await this.afterDelete(params, result);
    return result;
  }

  /** 删除分组之后，将会删除与被删除的分组下的所有数据 */
  async afterDelete(params, result) {
    if (result.code === 0 && result.data > 0) {
      const groupId = params.id;
      this.apiDataTable.filter(item => item.groupId === groupId).delete();
      const groupChildren = await this.apiGroupTable.where({ parentId: groupId });
      (await groupChildren.toArray()).forEach(group => this.afterDelete(group, result));
      const delResult = await groupChildren.delete();
      console.log('afterBulkDelete 删除分组', delResult);
    }
  }
}
