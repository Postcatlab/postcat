import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import {
  ApiDataBulkCreateDto,
  ApiDataBulkReadDetailDto,
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

  bulkReadDetail(params: ApiDataBulkReadDetailDto) {
    const { apiUuids, workSpaceUuid, projectUuid } = params;
    return this.baseService.bulkRead({
      uuid: apiUuids.map(uuid => uuid),
      workSpaceUuid,
      projectUuid
    });
  }

  bulkRead(params: ApiDataBulkReadDto) {
    const { workSpaceUuid, projectUuid } = params;
    return this.baseService.bulkRead({
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

  bulkDelete(params: ApiDataDeleteDto) {
    const { apiUuids, ...rest } = params;
    rest['uuid'] = apiUuids.map(uuid => uuid);
    return this.baseService.bulkDelete(rest);
  }
}
