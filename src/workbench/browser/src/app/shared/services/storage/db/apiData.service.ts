import { IndexableType } from 'dexie';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/base.service';
import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiDataDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/apiData.dto';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';

export class ApiDataService extends BaseService<ApiData> {
  constructor() {
    super(dataSource.apiData);
  }

  bulkCreateParamTransformer(params: ApiDataDto) {
    const { apiList, workSpaceUuid, projectUuid } = params;
    return [
      apiList.map(item => ({
        ...item,
        workSpaceUuid,
        projectUuid
      }))
    ];
  }
}
