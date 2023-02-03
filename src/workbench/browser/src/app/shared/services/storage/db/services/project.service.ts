import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiResponse, ApiResponsePromise } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/api-response.decorator';
import { QueryAllDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/common.dto';
import {
  ProjectBulkCreateDto,
  ProjectPageDto,
  ProjectDeleteDto,
  ProjectUpdateDto,
  ImportProjectDto,
  Collection,
  CollectionTypeEnum
} from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/project.dto';
import { genSimpleApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/initData/apiData';
import { Group, Project } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { ApiDataService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/apiData.service';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';
import { EnvironmentService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/environment.service';
import { GroupService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/group.service';

export class ProjectService extends BaseService<Project> {
  baseService = new BaseService(dataSource.project);
  apiDataService = new ApiDataService();
  groupService = new GroupService();
  environmentService = new EnvironmentService();

  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;
  apiTestHistoryTable = dataSource.apiTestHistory;
  environmentTable = dataSource.environment;
  mockTable = dataSource.mock;

  constructor() {
    super(dataSource.project);
  }
  async bulkCreate(params: ProjectBulkCreateDto) {
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
      data.forEach(group => {
        const sampleApiData = genSimpleApiData({ workSpaceUuid, projectUuid: group.projectUuid, groupId: group.id });
        // @ts-ignore
        this.apiDataService.bulkCreate(sampleApiData);
      });
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
      const needHandles = [this.apiDataTable, this.apiGroupTable, this.apiTestHistoryTable, this.environmentTable, this.mockTable];
      const promises = needHandles.map(table => table.filter(item => projectUuids.includes(item.projectUuid)).delete());
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

    await this.deepCreateGroup(collections, rootGroup);
    return true;
  }

  private bulkCreateApiData(apiList, parentGroup) {
    const { workSpaceUuid, projectUuid, id: groupId } = parentGroup;

    const apiFilters = apiList.map(n => {
      const { id, apiUuid, uuid, workSpaceUuid, ...rest } = n;
      return {
        ...rest,
        // 远程分组 id 替换本地分组 id
        groupId
      };
    });

    if (apiFilters.length) {
      return this.apiDataService.bulkCreate({
        apiList: apiFilters,
        projectUuid,
        workSpaceUuid
      });
    }
  }

  private async bulkCreateGroup(groupList: Group[] = [], parentGroup: Group) {
    const { workSpaceUuid, projectUuid, id: parentId } = parentGroup;

    const groups = groupList.map(n => {
      const { id, children, ...rest } = n;
      rest.parentId = parentId;
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
          await this.deepCreateGroup(localGroup.children, remoteGroups[index]);
        }
      }
    }
  }
  /** 递归创建分组及 API */
  private deepCreateGroup = async (collections = [], parentGroup: Group) => {
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

    await this.bulkCreateApiData(apiDataList, parentGroup);
    await this.bulkCreateGroup(groupList, parentGroup);
  };
}
