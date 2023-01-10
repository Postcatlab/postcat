import { IndexableType } from 'dexie';
import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiDataBulkCreateDto, ApiDataDeleteDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/apiData.dto';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class ApiDataService extends BaseService<ApiData> {
  constructor() {
    super(dataSource.apiData);
  }

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

  deleteParamTransformer(params: ApiDataDeleteDto) {
    params['uuid'] = params['apiUuid'];
    return [params];
  }
}
