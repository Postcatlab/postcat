import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiOkResponse } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/api-response.decorator';
import {
  ProjectBulkCreateDto,
  ProjectBulkReadDto,
  ProjectDeleteDto
} from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/project.dto';
import { ApiData, Group, Project } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class ProjectService extends BaseService<Project> {
  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;
  apiTestHistoryTable = dataSource.apiTestHistory;
  environmentTable = dataSource.environment;
  mockTable = dataSource.mock;

  constructor() {
    super(dataSource.project);
  }

  private genApiGroupTree(apiGroups: Group[], apiDatas: ApiData[], groupId: number) {
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

  /** 批量创建 API 入参前转换 参数数据结构 */
  bulkCreateParamTransformer(params: ProjectBulkCreateDto) {
    const { projectMsgs, workSpaceUuid } = params;

    return [
      projectMsgs.map(item => ({
        ...item,
        workSpaceUuid
      }))
    ];
  }
  /** 删除项目 前转换参数名 */
  bulkDeleteParamTransformer(params: ProjectDeleteDto) {
    const { projectUuids, ...rest } = params;
    rest['uuid'] = projectUuids;
    return [rest];
  }
  /** 获取项目列表 前转换参数名 */
  bulkReadParamTransformer(params: ProjectBulkReadDto) {
    const { projectUuidS, ...rest } = params;
    rest['uuid'] = projectUuidS;
    return [rest];
  }

  /** 删除项目之后，将会删除与被删除的项目相关的所有数据 */
  async afterBulkDelete({ params, result }) {
    if (result.code === 0 && result.data > 0) {
      const projectUuids = params.uuid;
      const needHandles = [this.apiDataTable, this.apiGroupTable, this.apiTestHistoryTable, this.environmentTable, this.mockTable];
      const promises = needHandles.map(table => table.filter(item => projectUuids.includes(item.projectUuid)).delete());
      const result = await Promise.all(promises);
      console.log('删除项目', result);
    }
  }

  /** 获取所有 API 及分组 */
  @ApiOkResponse()
  async collections(projectUuid: string) {
    const apiDatas = await this.apiDataTable.where({ projectUuid }).sortBy('orderNum');
    const apiGroups = await this.apiGroupTable.where({ projectUuid }).sortBy('sort');

    return this.genApiGroupTree(apiGroups, apiDatas, 0);
  }

  /** 导出整个项目 */
  @ApiOkResponse()
  async exports(projectUuid: string) {
    return {};
  }
}
