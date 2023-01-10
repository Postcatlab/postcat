import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiDataBulkCreateDto, ApiDataDeleteDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/apiData.dto';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class ApiDataService extends BaseService<ApiData> {
  constructor() {
    super(dataSource.apiData);
  }

  /** 批量新增 API 前 将参数先转换为可以直接入库的数据结构 */
  bulkCreateParamTransformer(params: ApiDataBulkCreateDto) {
    const { apiList, workSpaceUuid, projectUuid } = params;
    return [
      apiList.map(item => ({
        ...item,
        workSpaceUuid,
        projectUuid
      }))
    ];
  }

  /** 更新 API 前转换参数名 */
  updateParamTransformer(params: ApiDataDeleteDto) {
    params['uuid'] = params['apiUuid'];
    Reflect.deleteProperty(params, 'apiUuid');
    return [params];
  }

  /** 删除 API 前转换参数名 */
  deleteParamTransformer(params: ApiDataDeleteDto) {
    params['uuid'] = params['apiUuid'];
    return [params];
  }
}
