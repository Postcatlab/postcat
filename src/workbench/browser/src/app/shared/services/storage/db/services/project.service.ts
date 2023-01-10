import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiOkResponse } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/api-response.decorator';
import { ProjectBulkCreateDto, ProjectDeleteDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/project.dto';
import { ApiData, Group, Project } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class ProjectService extends BaseService<Project> {
  apiDataTable = dataSource.apiData;
  apiGroupTable = dataSource.group;

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

  bulkCreateParamTransformer(params: ProjectBulkCreateDto) {
    const { projectMsgs, workSpaceUuid } = params;

    return [
      projectMsgs.map(item => ({
        ...item,
        workSpaceUuid
      }))
    ];
  }

  @ApiOkResponse()
  async collections(projectUuid: string) {
    const apiDatas = await this.apiDataTable.where({ projectUuid }).sortBy('orderNum');
    const apiGroups = await this.apiGroupTable.where({ projectUuid }).sortBy('sort');

    return this.genApiGroupTree(apiGroups, apiDatas, 0);
  }

  /** 删除 API 前转换参数名 */
  bulkDeleteParamTransformer(params: ProjectDeleteDto) {
    params['uuid'] = params['apiUuid'];
    return [params];
  }
}
