import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiResponse, ApiResponsePromise } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/api-response.decorator';
import { QueryAllDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/common.dto';
import {
  ProjectBulkCreateDto,
  ProjectPageDto,
  ProjectDeleteDto,
  ProjectUpdateDto,
  ImportProjectDto
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
    const { data: apiList } = await this.apiDataService.bulkRead(params);
    const { data: groupList } = await this.groupService.bulkRead(params);

    return {
      ...projectInfo,
      environmentList,
      apiList,
      groupList
    } as unknown as ApiResponsePromise<ImportProjectDto>;
  }

  async imports(params: ImportProjectDto) {
    const { apiList, groupList, environmentList, workSpaceUuid, projectUuid } = params;

    this.environmentService.bulkCreate(
      environmentList.map(e => ({
        ...e,
        workSpaceUuid,
        projectUuid
      }))
    );

    const { data: rootGroup } = await this.groupService.read({ projectUuid, depth: 0 });

    await this.deepCreateGroup(groupList, apiList, workSpaceUuid, projectUuid, [rootGroup]);
  }

  private deepCreateGroup = async (groupList = [], apiList = [], workSpaceUuid, projectUuid, rootGroup: Group[]) => {
    const groupFilters = groupList
      .filter(n => n.depth !== 0)
      .map(n => {
        const { id, children, ...rest } = n;
        rest.parentId ??= rootGroup[0].id;
        return rest;
      });
    let remoteGroups = rootGroup;

    if (groupFilters.length) {
      const groupIds = await this.apiGroupTable.bulkAdd(groupFilters, { allKeys: true });
      remoteGroups = await this.apiGroupTable.bulkGet(groupIds);
    }

    console.log('remoteGroups', remoteGroups);
    groupList.forEach((localGroup, index) => {
      const apiFilters = apiList
        .filter(n => n.groupId === localGroup.id)
        .map(n => {
          const { id, apiUuid, uuid, workSpaceUuid, ...rest } = n;
          return {
            ...rest,
            // 远程分组 id 替换本地分组 id
            groupId: remoteGroups[index]?.id
          };
        });

      if (apiFilters.length) {
        this.apiDataService.bulkCreate({
          apiList: apiFilters,
          projectUuid,
          workSpaceUuid
        });
      }

      // 如果本地分组还有子分组
      if (localGroup.children?.length) {
        localGroup.children.forEach(m => {
          m.type = 1;
          // 远程分组 id 替换本地分组 id
          m.parentId = remoteGroups[index]?.id;
          m.projectUuid = projectUuid;
          m.workSpaceUuid = workSpaceUuid;
        });
        this.deepCreateGroup(localGroup.children, apiList, workSpaceUuid, projectUuid, rootGroup);
      }
    });
  };
}
