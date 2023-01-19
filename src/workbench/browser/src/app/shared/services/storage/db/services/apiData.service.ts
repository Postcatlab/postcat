import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import {
  ApiDataBulkCreateDto,
  ApiDataBulkReadDetailDto,
  ApiDataBulkReadDto,
  ApiDataDeleteDto,
  ApiDataPageDto,
  ApiDataUpdateDto
} from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/apiData.dto';
import type { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class ApiDataService extends BaseService<ApiData> {
  baseService = new BaseService(dataSource.apiData);
  mockService = new BaseService(dataSource.mock);

  constructor() {
    super(dataSource.apiData);
  }

  async bulkCreate(params: ApiDataBulkCreateDto) {
    const { apiList, workSpaceUuid, projectUuid } = params;
    const items = apiList.map(item => ({
      ...item,
      workSpaceUuid,
      projectUuid
    }));
    const result = await this.baseService.bulkCreate(items);
    const systemMocks = result.data?.map(n => ({
      name: '默认 Mock',
      description: '',
      apiUuid: n.apiUuid,
      createWay: 'system',
      response: '',
      projectUuid: n.projectUuid,
      workSpaceUuid: n.workSpaceUuid
    }));
    await this.mockService.bulkCreate(systemMocks);
    return result;
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

  page(params: ApiDataPageDto) {
    // sort: 排序正逆 ASC DESC(默认)
    // order: 排序字段 默认 updateTime
    const { groupIds, sort = 'DESC', order = 'updateTime', ...restParams } = params;

    if (groupIds?.length) {
      restParams['groupId'] = groupIds;
    }

    return this.baseService.page(restParams, async collection => {
      const items = await (sort === 'DESC' ? collection.reverse() : collection).sortBy(order);
      // TODO 由于 dexie 3.0 尚未支持 orderBy 方法，so...
      // https://dexie.org/docs/Table/Table.orderBy()
      return items
        .sort((a, b) => b.orderNum - a.orderNum)
        .map(n => ({
          ...n,
          ...n?.apiAttrInfo
        }));
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
