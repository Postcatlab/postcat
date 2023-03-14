import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiResponse, ApiResponsePromise } from 'pc/browser/src/app/services/storage/db/decorators/api-response.decorator';
import { QueryAllDto } from 'pc/browser/src/app/services/storage/db/dto/common.dto';
import {
  ProjectBulkCreateDto,
  ProjectPageDto,
  ProjectDeleteDto,
  ProjectUpdateDto,
  ImportProjectDto,
  Collection,
  CollectionTypeEnum
} from 'pc/browser/src/app/services/storage/db/dto/project.dto';
import { genSimpleApiData } from 'pc/browser/src/app/services/storage/db/initData/apiData';
import { Group, Project } from 'pc/browser/src/app/services/storage/db/models';
import { ApiDataService } from 'pc/browser/src/app/services/storage/db/services/apiData.service';
import { BaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';
import { EnvironmentService } from 'pc/browser/src/app/services/storage/db/services/environment.service';
import { GroupService } from 'pc/browser/src/app/services/storage/db/services/group.service';
import { parseAndCheckApiData } from 'pc/browser/src/app/services/storage/db/validate/validate';

export class ProjectService extends BaseService<Project> {
  baseService = new BaseService(dataSource.project);
  projectSyncSettingService = new BaseService(dataSource.projectSyncSetting);
  apiDataService = new ApiDataService();
  groupService = new GroupService();
  environmentService = new EnvironmentService();

  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;

  constructor() {
    super(dataSource.project);
  }

  @ApiResponse()
  async syncBatchUpdate(params) {
    const { collections = [], projectUuid } = params;

    const { data: rootGroup } = await this.groupService.read({ projectUuid, depth: 0 });

    await this.deepIncreUpdateGroup(collections, rootGroup);
    return true;
  }
  async deepIncreUpdateGroup(collections = [], parentGroup: Group) {
    const { projectUuid, workSpaceUuid, depth, id: parentId } = parentGroup;

    const promises = collections.map(async (item, sort) => {
      if (item.collectionType === CollectionTypeEnum.GROUP) {
        const { data: targetGroup } = await this.groupService.read({
          name: item.name,
          depth: depth + 1,
          parentId,
          projectUuid,
          workSpaceUuid
        });
        if (targetGroup) {
          // @ts-ignore
          this.apiGroupTable.update(targetGroup.id, { sort });
          if (item.children?.length) {
            await this.deepIncreUpdateGroup(item.children, targetGroup);
          }
        } else {
          const groupID = await this.apiGroupTable.add({ ...item, parentId, sort, depth: depth + 1, projectUuid, workSpaceUuid });
          const group = await this.apiGroupTable.get(groupID);

          if (item.children?.length) {
            await this.deepIncreUpdateGroup(item.children, group);
          }
        }
      } else if (item.collectionType === CollectionTypeEnum.API_DATA) {
        const { data: apiData } = await this.apiDataService.read({
          projectUuid,
          uri: item.uri,
          'apiAttrInfo.requestMethod': item.apiAttrInfo?.requestMethod
        });
        if (apiData) {
          // @ts-ignore
          await this.apiDataTable.update(apiData.id, {
            ...apiData,
            ...item,
            sort,
            groupId: parentId,
            projectUuid,
            workSpaceUuid
          });
        } else {
          await this.apiDataTable.add({
            ...item,
            sort,
            groupId: parentId,
            projectUuid,
            workSpaceUuid
          });
        }
      }
    });
    await Promise.all(promises);
  }

  // 添加项目同步配置
  async createSyncSetting(params) {
    const { data: target } = await this.projectSyncSettingService.read(params);
    if (params.id || target) {
      params.id = target.id ?? params.id;
      return this.projectSyncSettingService.update(params);
    } else {
      return this.projectSyncSettingService.create(params);
    }
  }

  // 更新项目同步配置
  updateSyncSetting(params) {
    return this.projectSyncSettingService.update(params);
  }

  // 获取项目同步配置
  getSyncSettingList(params) {
    return this.projectSyncSettingService.bulkRead(params);
  }

  // 删除项目同步配置
  delSyncSetting(params) {
    return this.projectSyncSettingService.delete(params);
  }

  async bulkCreate(params: ProjectBulkCreateDto, isInitApiData = false) {
    const { projectMsgs, workSpaceUuid } = params;

    const result = await this.baseService.bulkCreate(
      projectMsgs.map(item => ({
        ...item,
        workSpaceUuid
      }))
    );
    const groups = result.data?.map(item => ({
      type: 0,
      name: $localize`Root Group`,
      depth: 0,
      projectUuid: item.projectUuid,
      workSpaceUuid: item.workSpaceUuid
    }));

    this.groupService.bulkCreate(groups).then(({ data }) => {
      if (isInitApiData) {
        data.forEach(group => {
          const sampleApiData = genSimpleApiData({ workSpaceUuid, projectUuid: group.projectUuid, groupId: group.id });
          // @ts-ignore
          this.apiDataService.bulkCreate(sampleApiData);
        });
      }
    });

    return result;
  }

  async update(params: ProjectUpdateDto) {
    const { projectUuid, ...rest } = params;
    const { data } = await this.read({ uuid: projectUuid });
    rest['id'] = data.id;
    return this.baseService.update(rest);
  }

  /** 批量删除项目  */
  async bulkDelete(params: ProjectDeleteDto) {
    const { projectUuids, ...rest } = params;
    rest['uuid'] = projectUuids;
    const result = await this.baseService.bulkDelete(rest);
    await this.afterBulkDelete(rest, result);
    return result;
  }
  /** 获取项目列表  */
  page(params: ProjectPageDto) {
    const { projectUuids, ...rest } = params;
    if (projectUuids.length) {
      rest['uuid'] = projectUuids;
    }
    return this.baseService.page(rest);
  }

  /** 删除项目之后，将会删除与被删除的项目相关的所有数据 */
  async afterBulkDelete(params, result) {
    if (result.code === 0 && result.data > 0) {
      const projectUuids = params.uuid;

      const promises = dataSource.tables.map(table => table.filter(item => projectUuids.includes(item.projectUuid)).delete());
      const result = await Promise.all(promises);
      console.log('删除项目', result);
    }
  }

  /** 导出整个项目 */
  @ApiResponse()
  async exports(params: QueryAllDto) {
    const { data: projectInfo } = await this.baseService.read({ uuid: params.projectUuid });
    const { data: environmentList } = await this.environmentService.bulkRead(params);
    const { data: apiGroupTree } = await this.groupService.bulkRead({ projectUuid: params.projectUuid });

    const formatTree = (arr = []) => {
      return arr.map(item => {
        if (item.type === 2) {
          return {
            ...item.relationInfo,
            collectionType: CollectionTypeEnum.API_DATA
          };
        } else {
          item.collectionType = CollectionTypeEnum.GROUP;
          // ...
          if (item.children?.length) {
            item.children = formatTree(item.children);
          }
          return item;
        }
      });
    };

    const result: ImportProjectDto = {
      ...projectInfo,
      environmentList,
      collections: formatTree(apiGroupTree[0].children) as Collection[]
    };

    return result as unknown as ApiResponsePromise<ImportProjectDto>;
  }

  @ApiResponse()
  async import(params: ImportProjectDto) {
    const { collections, environmentList = [], workSpaceUuid, projectUuid } = params;

    if (environmentList.length) {
      this.environmentService.bulkCreate(
        environmentList.map(e => ({
          ...e,
          workSpaceUuid,
          projectUuid
        }))
      );
    }

    const { data: rootGroup } = await this.groupService.read({ projectUuid, depth: 0 });

    const result = {
      errors: {
        apiData: []
      },
      successes: {
        group: [],
        apiData: [],
        environment: []
      }
    };

    await this.deepCreateGroup(collections, rootGroup, result);
    return result;
  }

  private async bulkCreateApiData(apiList, parentGroup, result) {
    const { workSpaceUuid, projectUuid, id: groupId } = parentGroup;

    const apiFilters = apiList
      .filter(item => {
        const parseResult = parseAndCheckApiData(item);
        if (!parseResult.validate) {
          result.errors.apiData.push(item.name || item.uri);
          return;
        }
        return parseResult.validate;
      })
      .map(n => {
        const { id, apiUuid, uuid, workSpaceUuid, ...rest } = n;
        return {
          ...rest,
          // 远程分组 id 替换本地分组 id
          groupId
        };
      });

    if (apiFilters.length) {
      const createResult = await this.apiDataService.bulkCreate({
        apiList: apiFilters,
        projectUuid,
        workSpaceUuid
      });
      result.successes.apiData.push(...createResult.data);
      return createResult;
    }
  }

  private async bulkCreateGroup(groupList: Group[] = [], parentGroup: Group, result) {
    const { workSpaceUuid, projectUuid, id: parentId, depth } = parentGroup;

    const groups = groupList.map(n => {
      const { id, children, ...rest } = n;
      rest.parentId = parentId;
      rest.depth = depth + 1;
      rest.workSpaceUuid = workSpaceUuid;
      rest.projectUuid = projectUuid;
      return rest;
    });

    if (groups.length) {
      const groupIds = await this.apiGroupTable.bulkAdd(groups, { allKeys: true });
      const remoteGroups = await this.apiGroupTable.bulkGet(groupIds);

      for (const [index, localGroup] of groupList.entries()) {
        // 如果本地分组还有子分组
        if (localGroup.children?.length) {
          await this.deepCreateGroup(localGroup.children, remoteGroups[index], result);
        }
      }
    }
  }

  private groupCollections(collections = []) {
    // 将集合筛选为 groupList 和 apiDataList 两组
    const { groupList = [], apiDataList = [] } = collections
      .filter(n => n.depth !== 0)
      .group((item, index) => {
        // 排序号根据原始数组索引来
        item.sort = index;
        if (item.collectionType === CollectionTypeEnum.GROUP) {
          return 'groupList';
        } else if (item.collectionType === CollectionTypeEnum.API_DATA) {
          return 'apiDataList';
        } else {
          return '垃圾数据分类';
        }
      });
    return { groupList, apiDataList };
  }

  /** 递归创建分组及 API */
  private deepCreateGroup = async (collections = [], parentGroup: Group, result) => {
    // 将集合筛选为 groupList 和 apiDataList 两组
    const { groupList = [], apiDataList = [] } = this.groupCollections(collections);

    await Promise.all([this.bulkCreateApiData(apiDataList, parentGroup, result), this.bulkCreateGroup(groupList, parentGroup, result)]);
  };
}
