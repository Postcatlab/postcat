import {
  inheritAuth,
  noAuth
} from 'pc/browser/src/app/pages/workspace/project/api/components/authorization-extension-form/authorization-extension-form.component';
import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import {
  ApiResponse,
  ApiResponseOptions,
  ApiResponsePromise
} from 'pc/browser/src/app/services/storage/db/decorators/api-response.decorator';
import { GroupDeleteDto } from 'pc/browser/src/app/services/storage/db/dto/group.dto';
import { Group } from 'pc/browser/src/app/services/storage/db/models';
import { BaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';
import { serializeObj } from 'pc/browser/src/app/services/storage/db/utils';

// 对数据重新进行升序编排
const formatSort = (arr: any[] = []) => {
  return arr
    .sort((a, b) => a.sort - b.sort)
    .map((item, index) => {
      item.sort = index;
      return item;
    });
};

const genGroupType2 = apiData => {
  // 不能直接返回 apiData, 要返回符合分组的格式
  return {
    ...apiData,
    // 0默认分组 1普通分组 2外部数据参与排序分组
    type: 2,
    id: apiData.apiUuid,
    uuid: apiData.apiUuid,
    parentId: apiData.groupId,
    relationInfo: {
      ...apiData,
      ...apiData?.apiAttrInfo
    }
  };
};

export class GroupService extends BaseService<Group> {
  baseService = new BaseService(dataSource.group);
  apiDataService = new BaseService(dataSource.apiData);

  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;

  constructor() {
    super(dataSource.group);
  }

  async bulkCreate(params = []) {
    const { data: parentGroups } = await this.baseService.bulkRead({ id: params.map(n => n.parentId) });
    parentGroups.forEach((item, index) => {
      params[index].depth = item.depth + 1;
    });
    return this.baseService.bulkCreate(params);
  }

  @ApiResponse()
  async update(params?: Record<string, any>) {
    const { id, parentId, name, sort, type } = params;
    const hasSort = Number.isInteger(sort);

    // 对分组下的数据进行重排
    const sortData = async (groupList, apiDataList, target) => {
      // 对数据进行分组
      const { mostThan = [], lessThan = [] } = formatSort([...groupList, ...apiDataList]).group(item => {
        return item.sort >= sort ? 'mostThan' : 'lessThan';
      });
      const sorteLessThan = formatSort(lessThan);
      const sorteMostdThan = formatSort(mostThan);

      const arr = [...sorteLessThan, target, ...sorteMostdThan].map((n, i) => {
        n.sort = i;
        return n;
      });

      const { groups, apis } = arr.group(item => (item.uri ? 'apis' : 'groups'));
      groups && (await this.baseService.bulkUpdate(groups));
      apis && (await this.apiDataService.bulkUpdate(apis));
    };

    // 0默认分组 1普通分组 2外部数据参与排序分组
    // 拖动的是 API
    if (type === 2) {
      const apiParams = serializeObj({
        uuid: id,
        groupId: parentId,
        sort
      });
      const { data: oldApiData } = await this.apiDataService.read({ uuid: id });
      const { data: groupList } = await this.baseService.bulkRead({ parentId: parentId ?? oldApiData.groupId, type: 1 });
      const { data: apiDataList } = await this.apiDataService.bulkRead({ groupId: parentId ?? oldApiData.groupId });

      // 如果指定了 sort，则需要重新排序
      if (hasSort) {
        await sortData(
          groupList,
          apiDataList.filter(n => n.id !== oldApiData.id),
          { ...oldApiData, groupId: parentId }
        );
        const { data: newApiData } = await this.apiDataService.read({ uuid: id });
        return genGroupType2(newApiData);
      }
      // 如果 parentId 变了，则需要将其 sort = parent.children.length
      if (parentId && oldApiData.groupId !== parentId) {
        // 没有指定 sort，则默认排在最后
        apiParams.sort = groupList.length + apiDataList.length + 1;
        const { data: newApiData } = await this.apiDataService.update(apiParams);
        return genGroupType2(newApiData);
      }
    }
    // 修改分组
    else {
      const { data: oldGroup } = await this.baseService.read({ id });
      const { data: groupList } = await this.baseService.bulkRead({ parentId: parentId ?? oldGroup.parentId, type: 1 });
      const { data: apiDataList } = await this.apiDataService.bulkRead({ groupId: parentId ?? oldGroup.parentId });

      // 如果指定了 sort，则需要重新排序
      if (hasSort) {
        await sortData(
          groupList.filter(n => n.id !== oldGroup.id),
          apiDataList,
          { ...oldGroup, parentId }
        );
        return this.baseService.read({ id });
      }
      // 如果 parentId 变了，则需要将其 sort = parent.children.length
      if (parentId && oldGroup.parentId !== parentId) {
        // 没有指定 sort，则默认排在最后
        params.sort = groupList.length + apiDataList.length + 1;
        const { data: parentGroup } = await this.baseService.read({ id: parentId });
        params.depth = parentGroup.depth + 1;
      }

      return this.baseService.update(params);
    }
  }

  async read(params, isCallByApiData = false) {
    const result = await this.baseService.read(params);
    const group = result.data;
    const groupAuthType = group.authInfo?.authType;

    // if (groupAuthType === inheritAuth.name) {
    //   group.authInfo.authType = inheritAuth.name;
    //   group.authInfo.isInherited = group.depth > 1 ? 1 : 0;
    // }
    // 递归获取父级分组鉴权信息
    if (group && (!groupAuthType || groupAuthType === inheritAuth.name)) {
      group.authInfo = {
        authType: noAuth.name,
        isInherited: 0,
        authInfo: {}
      };
      if (group.depth !== 0) {
        const { data: parentGroup } = await this.read({ id: group.parentId });
        if (parentGroup.depth !== 0) {
          group.authInfo = parentGroup.authInfo;
        }
        if (isCallByApiData || !groupAuthType || groupAuthType === inheritAuth.name) {
          group.authInfo.isInherited = (isCallByApiData ? group : parentGroup).depth ? 1 : 0;
        } else {
          group.authInfo.isInherited = 0;
        }
      }
    } else if (groupAuthType) {
      group.authInfo.isInherited = isCallByApiData ? 1 : 0;
    }
    return result;
  }

  async bulkRead(params) {
    const result = await this.baseService.bulkRead(params);
    const { data: apiDataList } = await this.apiDataService.bulkRead({ projectUuid: params.projectUuid });

    const genGroupTree = (groups: Group[], paranId) => {
      const apiFilters = apiDataList.filter(n => n.groupId === paranId);
      const groupFilters = groups.filter(n => n.parentId === paranId);
      return [...apiFilters, ...groupFilters]
        .map(m => {
          // API
          if ('uri' in m) {
            return genGroupType2(m);
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
