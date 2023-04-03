import { SYSTEM_MOCK_NAME } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { isInherited } from 'pc/browser/src/app/pages/workspace/project/api/constants/auth.model';
import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import {
  ApiDataBulkCreateDto,
  ApiDataBulkReadDetailDto,
  ApiDataPageDto,
  ApiDataUpdateDto
} from 'pc/browser/src/app/services/storage/db/dto/apiData.dto';
import { MockCreateWay } from 'pc/browser/src/app/services/storage/db/models';
import type { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';
import { DbGroupService } from 'pc/browser/src/app/services/storage/db/services/group.service';

export class DbApiDataService extends DbBaseService<ApiData> {
  baseService = new DbBaseService(dataSource.apiData);
  mockService = new DbBaseService(dataSource.mock);
  groupService = new DbGroupService();

  constructor() {
    super(dataSource.apiData);
  }
  async bulkCreate(params: ApiDataBulkCreateDto) {
    const { apiList, workSpaceUuid, projectUuid } = params;
    const items = apiList.map(item => {
      return {
        ...item,
        workSpaceUuid,
        projectUuid
      };
    });
    const result = await this.baseService.bulkCreate(items);
    const systemMocks = result.data?.map(n => ({
      name: SYSTEM_MOCK_NAME,
      description: '',
      apiUuid: n.apiUuid,
      createWay: MockCreateWay.System,
      response: '',
      projectUuid: n.projectUuid,
      workSpaceUuid: n.workSpaceUuid
    }));
    await this.mockService.bulkCreate(systemMocks);
    return result;
  }

  async bulkReadDetail(params: ApiDataBulkReadDetailDto) {
    const result = await this.baseService.bulkRead(params);
    const promiseArr = result.data.map(async item => {
      const { data: groupInfo } = await this.groupService.read({ id: item.groupId });
      if (!groupInfo) return;
      item.authInfo = groupInfo?.authInfo;
      if (groupInfo.depth !== 0) {
        item.authInfo.isInherited = isInherited.inherit;
      }
    });

    await Promise.all(promiseArr);

    return result;
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

  /**
   * Incremental update
   *
   * @param params
   * @returns
   */
  async update(params: ApiDataUpdateDto) {
    const { api, projectUuid, workSpaceUuid } = params;
    const { data } = await this.baseService.read({ uuid: api.apiUuid });
    //Prevent the id from being modified
    api['id'] = data.id;
    return this.baseService.update({
      ...api,
      projectUuid,
      workSpaceUuid
    });
  }
}
