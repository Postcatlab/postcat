import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import {
  ApiDataBulkCreateDto,
  ApiDataBulkReadDto,
  ApiDataDeleteDto,
  ApiDataUpdateDto
} from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/apiData.dto';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class ApiDataService extends BaseService<ApiData> {
  baseService = new BaseService(dataSource.apiData);

  constructor() {
    super(dataSource.apiData);
  }

  bulkCreate(params: ApiDataBulkCreateDto) {
    const { apiList, workSpaceUuid, projectUuid } = params;
    const items = apiList.map(item => ({
      ...item,
      workSpaceUuid,
      projectUuid
    }));
    return this.baseService.bulkCreate(items);
  }

  bulkRead(params: ApiDataBulkReadDto) {
    const { api, workSpaceUuid, projectUuid } = params;
    return this.baseService.bulkRead({
      uuid: api.apiUuids,
      workSpaceUuid,
      projectUuid
    });
  }

  async update(params: ApiDataUpdateDto) {
    const { api, projectUuid, workSpaceUuid } = params;
    const { data } = await this.baseService.read({ uuid: api.apiUuid });
    api['id'] = data.id;
    return this.baseService.update({
      ...api,
      projectUuid,
      workSpaceUuid
    });
  }

  delete(params: ApiDataDeleteDto) {
    const { apiUuid, ...rest } = params;
    rest['uuid'] = apiUuid;
    return this.baseService.delete(rest);
  }
}
