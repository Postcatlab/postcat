import { isInherited } from 'pc/browser/src/app/pages/workspace/project/api/constants/auth.model';
import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiResponse, ApiResponsePromise } from 'pc/browser/src/app/services/storage/db/decorators/api-response.decorator';
import { QueryAllDto } from 'pc/browser/src/app/services/storage/db/dto/common.dto';
import {
  ProjectBulkCreateDto,
  ProjectPageDto,
  ProjectDeleteDto,
  ProjectUpdateDto,
  ImportProjectDto,
  Collection
} from 'pc/browser/src/app/services/storage/db/dto/project.dto';
import { SampleCollection } from 'pc/browser/src/app/services/storage/db/initData/apiData';
import { CollectionTypeEnum, Group, GroupType, Project } from 'pc/browser/src/app/services/storage/db/models';
import { DbApiDataService } from 'pc/browser/src/app/services/storage/db/services/apiData.service';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';
import { DbEnvironmentService } from 'pc/browser/src/app/services/storage/db/services/environment.service';
import { DbGroupService } from 'pc/browser/src/app/services/storage/db/services/group.service';
import { parseAndCheckApiData } from 'pc/browser/src/app/services/storage/db/validate/validate';

export class DbProjectService extends DbBaseService<Project> {
  baseService = new DbBaseService(dataSource.project);
  projectSyncSettingService = new DbBaseService(dataSource.projectSyncSetting);
  DbApiDataService = new DbApiDataService();
  groupService = new DbGroupService();
  DbEnvironmentService = new DbEnvironmentService();

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
      if (item.collectionType === CollectionTypeEnum.Group) {
        const { data: targetGroup } = await this.groupService.read({
          name: item.name,
          depth: depth + 1,
          parentId,
          projectUuid,
          workSpaceUuid
        });
        if (targetGroup) {
          //@ts-ignore
          this.apiGroupTable.update(targetGroup.id, { sort });
          if (item.children?.length) {
            await this.deepIncreUpdateGroup(item.children, targetGroup);
          }
        } else {
          const { data: group } = await this.groupService.create({ ...item, parentId, sort, depth: depth + 1, projectUuid, workSpaceUuid });
          if (item.children?.length) {
            await this.deepIncreUpdateGroup(item.children, group);
          }
        }
        return;
      }

      if (item.collectionType !== CollectionTypeEnum.API) return;
      const { data: apiData } = await this.DbApiDataService.read({
        projectUuid,
        uri: item.uri,
        'apiAttrInfo.requestMethod': item.apiAttrInfo?.requestMethod
      });
      if (apiData) {
        await this.DbApiDataService.update({
          api: {
            ...apiData,
            ...item,
            sort,
            groupId: parentId,
            projectUuid,
            workSpaceUuid
          },
          projectUuid,
          workSpaceUuid
        });
      } else {
        await this.DbApiDataService.bulkCreate({
          apiList: [
            {
              ...item,
              sort,
              groupId: parentId,
              projectUuid,
              workSpaceUuid
            }
          ],
          projectUuid,
          workSpaceUuid
        });
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
      type: GroupType.System,
      name: $localize`Root Group`,
      depth: 0,
      authInfo: {
        authInfo: {},
        authType: 'none',
        isInherited: isInherited.notInherit
      },
      projectUuid: item.projectUuid,
      workSpaceUuid: item.workSpaceUuid
    }));

    this.groupService.bulkCreate(groups).then(({ data }) => {
      if (isInitApiData) {
        data.forEach(group => {
          this.import({
            //@ts-ignore
            collections: SampleCollection.collections,
            workSpaceUuid,
            projectUuid: group.projectUuid
          });
        });
      }
    });

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

  /** 批量删除项目  */
  async bulkDelete(params: ProjectDeleteDto) {
    const { projectUuids, ...rest } = params;
    const result = await this.baseService.bulkDelete(params);
    await this.afterBulkDelete(projectUuids, result);
    return result;
  }
  /** 删除项目之后，将会删除与被删除的项目相关的所有数据 */
  async afterBulkDelete(projectUuids, result) {
    if (result.code === 0 && result.data > 0) {
      const promises = dataSource.tables.map(table => table.filter(item => projectUuids.includes(item.projectUuid)).delete());
      const result = await Promise.all(promises);
      console.log('删除项目', result);
    }
  }

  /** 导出整个项目 */
  @ApiResponse()
  async exports(params: QueryAllDto) {
    const { data: projectInfo } = await this.baseService.read({ uuid: params.projectUuid });
    const { data: environmentList } = await this.DbEnvironmentService.bulkRead(params);
    const { data: apiGroupTree } = await this.groupService.bulkRead({ projectUuid: params.projectUuid });

    const formatTree = (arr = []) => {
      return arr.map(item => {
        if (item.type === GroupType.Virtual) {
          return {
            ...item.relationInfo,
            collectionType: CollectionTypeEnum.API
          };
        } else {
          item.collectionType = CollectionTypeEnum.Group;
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
      this.DbEnvironmentService.bulkCreate(
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
      const createResult = await this.DbApiDataService.bulkCreate({
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
        const isAPI = item.collectionType == CollectionTypeEnum.API;
        if (!isAPI) {
          return 'groupList';
        } else if (isAPI) {
          return 'apiDataList';
        } else {
          return 'uselessData';
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
