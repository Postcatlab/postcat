import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiResponse } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/api-response.decorator';
import {
  ProjectBulkCreateDto,
  ProjectPageDto,
  ProjectDeleteDto,
  ProjectUpdateDto
} from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/project.dto';
import { genSimpleApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/initData/apiData';
import { ApiData, Group, Project } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { ApiDataService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/apiData.service';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';
import { GroupService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/group.service';

export class ProjectService extends BaseService<Project> {
  baseService = new BaseService(dataSource.project);
  apiDataService = new ApiDataService();
  groupService = new GroupService();

  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;
  apiTestHistoryTable = dataSource.apiTestHistory;
  environmentTable = dataSource.environment;
  mockTable = dataSource.mock;

  constructor() {
    super(dataSource.project);
  }

  private genApiGroupTree(apiGroups: Group[] = [], apiDatas: ApiData[] = [], groupId: number) {
    const apiDataFilters = apiDatas.filter(apiData => apiData.groupId === groupId);
    const apiGroupFilters = apiGroups.filter(n => n.parentId === groupId);

    return [
      ...apiGroupFilters.map(group => ({
        ...group,
        children: this.genApiGroupTree(apiGroups, apiDatas, group.id)
      })),
      ...apiDataFilters
    ];
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
      name: '根分组',
      depth: 0,
      projectUuid: item.uuid,
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

  /** 获取所有 API 及分组 */
  @ApiResponse()
  async collections(projectUuid: string) {
    const apiDatas = await this.apiDataTable.where({ projectUuid }).sortBy('orderNum');
    const apiGroups = await this.apiGroupTable.where({ projectUuid }).sortBy('sort');

    return this.genApiGroupTree(apiGroups, apiDatas, 0);
  }

  /** 导出整个项目 */
  @ApiResponse()
  async exports(projectUuid: string) {
    return {};
  }
}
