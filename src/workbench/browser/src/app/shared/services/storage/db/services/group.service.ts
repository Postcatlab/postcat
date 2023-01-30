import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { GroupDeleteDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/group.dto';
import { Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class GroupService extends BaseService<Group> {
  baseService = new BaseService(dataSource.group);
  apiDataService = new BaseService(dataSource.apiData);

  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;

  constructor() {
    super(dataSource.group);
  }

  async bulkRead(params) {
    // 0默认分组 1普通分组 2外部数据参与排序分组
    const result = await this.baseService.bulkRead(params);
    const { data: apiDataList } = await this.apiDataService.bulkRead({ projectUuid: params.projectUuid });

    const genGroupTree = (groups: Group[], paranId) => {
      const apiFilters = apiDataList.filter(n => n.groupId === paranId);
      const groupFilters = groups.filter(n => n.parentId === paranId);
      return [...apiFilters, ...groupFilters]
        .map(m => {
          // API
          if ('uri' in m) {
            return {
              ...m,
              type: 2,
              id: m.apiUuid,
              uuid: m.apiUuid,
              parentId: m.groupId,
              relationInfo: m
            };
          }
          // group
          else {
            return {
              ...m,
              children: genGroupTree(groups, m.id)
            };
          }
        })
        .sort((a, b) => a.sort - b.sort);
    };
    const rootGroup = result.data?.find(n => n.depth === 0);
    rootGroup['children'] = genGroupTree(result.data, rootGroup?.id);
    result.data = [rootGroup];
    // console.log('result', result);
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
      // console.log('afterBulkDelete 删除分组', delResult);
    }
  }
}
