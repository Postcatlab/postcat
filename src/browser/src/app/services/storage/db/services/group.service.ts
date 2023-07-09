import { UpdateSpec } from 'dexie';
import { AuthTypeValue, isInherited, NONE_AUTH_OPTION } from 'pc/browser/src/app/pages/workspace/project/api/constants/auth.model';
import { GroupModule } from 'pc/browser/src/app/pages/workspace/project/api/group-edit/group.module';
import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiResponse } from 'pc/browser/src/app/services/storage/db/decorators/api-response.decorator';
import { GroupDeleteDto } from 'pc/browser/src/app/services/storage/db/dto/group.dto';
import { Group, GroupModuleType, GroupType, ViewGroup } from 'pc/browser/src/app/services/storage/db/models';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';
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

const genFileGroup = (module, model): ViewGroup | any => {
  // 不能直接返回 apiData, 要返回符合分组的格式
  switch (module) {
    case GroupModuleType.API: {
      return {
        type: GroupType.Virtual,
        module: GroupModuleType.API,
        id: `api_${model.apiUuid}`,
        parentId: model.groupId,
        relationInfo: {
          ...model,
          ...model?.apiAttrInfo
        }
      };
    }
    case GroupModuleType.Mock: {
      return {
        type: GroupType.Virtual,
        module: GroupModuleType.Mock,
        id: `mock_${model.id}`,
        parentId: `api_${model.apiUuid}`,
        relationInfo: model
      };
    }
    case GroupModuleType.Case: {
      return {
        type: GroupType.Virtual,
        module: GroupModuleType.Case,
        id: `case_${model.id}`,
        parentId: `api_${model.apiUuid}`,
        relationInfo: model
      };
    }
  }
};

export class DbGroupService extends DbBaseService<Group> {
  baseService = new DbBaseService(dataSource.group);
  apiDataService = new DbBaseService(dataSource.apiData);
  mockDataService = new DbBaseService(dataSource.mock);
  caseDataService = new DbBaseService(dataSource.apiCase);

  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;

  constructor() {
    super(dataSource.group);
    //TODO delete at 2023-07-01
    //Fixed root group authInfo
    //@ts-ignore
    this.baseService.db.update(1, {
      authInfo: {
        authType: NONE_AUTH_OPTION.name,
        isInherited: isInherited.notInherit,
        authInfo: {}
      }
    } as UpdateSpec<Group>);
  }

  async bulkCreate(params: Group[] = []) {
    const { data: parentGroups } = await this.baseService.bulkRead({ id: params.map(n => n.parentId) });
    parentGroups.forEach((item, index) => {
      params[index].depth = item.depth + 1;
    });
    params.forEach(val => {
      val.authInfo = {
        authType: NONE_AUTH_OPTION.name,
        isInherited: val.depth === 0 || val.depth === 1 ? isInherited.notInherit : isInherited.inherit,
        authInfo: {}
      };
    });

    return this.baseService.bulkCreate(params);
  }

  @ApiResponse()
  async update(params?: Record<string, any>) {
    const { id, parentId, module, sort, type } = params;
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

    // 拖动的是 API
    if (module === GroupModuleType.API) {
      const uuid = params.relationInfo.uuid;
      const apiParams = serializeObj({
        uuid: uuid,
        groupId: parentId,
        sort
      });
      const { data: oldApiData } = await this.apiDataService.read({ uuid });
      const { data: groupList } = await this.baseService.bulkRead({
        parentId: parentId ?? oldApiData.groupId,
        type: GroupType.UserCreated
      });
      const { data: apiDataList } = await this.apiDataService.bulkRead({ groupId: parentId ?? oldApiData.groupId });

      // 如果指定了 sort，则需要重新排序
      if (hasSort) {
        await sortData(
          groupList,
          apiDataList.filter(n => n.id !== oldApiData.id),
          { ...oldApiData, groupId: parentId }
        );
        const { data: newApiData } = await this.apiDataService.read({ uuid });
        return genFileGroup(GroupModuleType.API, newApiData);
      }
      // 如果 parentId 变了，则需要将其 sort = parent.children.length
      if (parentId && oldApiData.groupId !== parentId) {
        // 没有指定 sort，则默认排在最后
        apiParams.sort = groupList.length + apiDataList.length + 1;
        const { data: newApiData } = await this.apiDataService.update(apiParams);
        return genFileGroup(GroupModuleType.API, newApiData);
      }
    }
    // 修改分组
    else {
      const { data: oldGroup } = await this.baseService.read({ id });
      const { data: groupList } = await this.baseService.bulkRead({ parentId: parentId ?? oldGroup.parentId, type: GroupType.UserCreated });
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

  async read(params) {
    const result = await this.baseService.read(params);
    if (!result.data) {
      return {
        success: false,
        code: 1,
        data: null
      };
    }
    const group = result.data;
    const groupAuthType = group.authInfo?.authType;
    if (!groupAuthType) {
      group.authInfo = {
        authType: NONE_AUTH_OPTION.name,
        isInherited: isInherited.notInherit,
        authInfo: {}
      };
    }
    if (groupAuthType === AuthTypeValue.Inherited) {
      const { data: parentGroup } = await this.read({ id: group.parentId });
      if (parentGroup.depth !== 0) {
        group.authInfo = parentGroup.authInfo;
      }
      if (!groupAuthType || groupAuthType === AuthTypeValue.Inherited) {
        group.authInfo.isInherited = parentGroup.depth ? 1 : 0;
      } else {
        group.authInfo.isInherited = isInherited.notInherit;
      }
    }
    return result;
  }

  async bulkRead(params) {
    const result = await this.baseService.bulkRead(params);
    if (!result.data) {
      return {
        success: false,
        code: 1,
        data: null
      };
    }
    //! Warning  case/mock/group id may dupublicate in local
    const { data: apiDataList } = await this.apiDataService.bulkRead({ projectUuid: params.projectUuid });
    const { data: mockDataList } = await this.mockDataService.bulkRead({ projectUuid: params.projectUuid });
    const { data: caseDataList } = await this.caseDataService.bulkRead({ projectUuid: params.projectUuid });
    const genGroupTree = (groups: Group[], paranId) => {
      const groupFilters = groups.filter(n => n.parentId === paranId);
      const apiFilters = apiDataList.filter(n => n.groupId === paranId).map(val => genFileGroup(GroupModuleType.API, val));
      return [...groupFilters, ...apiFilters]
        .map((m: any) => {
          // Resource:api/case/mock
          if (m.module === GroupModuleType.API) {
            const mockFilters = mockDataList
              .filter(n => n.apiUuid === m.relationInfo.apiUuid)
              .map(val => genFileGroup(GroupModuleType.Mock, val));
            const caseFilters = caseDataList
              .filter(n => n.apiUuid === m.relationInfo.apiUuid)
              .map(val => genFileGroup(GroupModuleType.Case, val));
            return {
              ...m,
              children: [...mockFilters, ...caseFilters].sort((a, b) => a.sort - b.sort)
            };
          }
          // Group
          return {
            ...m,
            type: GroupType.UserCreated,
            children: genGroupTree(groups, m.id)
          };
        })
        .sort((a, b) => a.sort - b.sort);
    };
    const rootGroup = result.data?.find(n => n.depth === 0);
    rootGroup.children = genGroupTree(result.data, rootGroup?.id);
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
      // console.log('afterBulkDelete 删除分组', delResult);
    }
  }
}
