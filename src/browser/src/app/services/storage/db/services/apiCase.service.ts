import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiCaseDeleteDto, ApiCaseCreateDto, ApiCaseUpdateDto } from 'pc/browser/src/app/services/storage/db/dto/apiCase.dto';
import { ApiCase } from 'pc/browser/src/app/services/storage/db/models';
import { DbApiDataService } from 'pc/browser/src/app/services/storage/db/services/apiData.service';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class DbApiCaseService extends DbBaseService<ApiCase> {
  baseService = new DbBaseService(dataSource.apiCase);
  apiDataService = new DbApiDataService();
  constructor() {
    super(dataSource.apiCase);
  }
  async bulkReadDetail(params) {
    const { apiCaseUuids, workSpaceUuid, projectUuid } = params;
    const result = await this.baseService.bulkRead({
      id: apiCaseUuids,
      workSpaceUuid,
      projectUuid
    });
    const promiseArr = result.data.map(async (item: ApiCase) => {
      const {
        data: [apiDataInfo]
      } = await this.apiDataService.bulkReadDetail({ apiUuids: [item.apiUuid], workSpaceUuid, projectUuid });
      item.authInfo = apiDataInfo.authInfo;
    });
    await Promise.all(promiseArr);
    return result;
  }
  async bulkCreate(params: ApiCaseCreateDto) {
    const { workSpaceUuid, projectUuid } = params;
    const result = await this.baseService.bulkCreate(params.apiCaseList);
    const promiseArr = result.data.map(async (item: ApiCase) => {
      const {
        data: [apiDataInfo]
      } = await this.apiDataService.bulkReadDetail({ apiUuids: [item.apiUuid], workSpaceUuid, projectUuid });
      item.authInfo = apiDataInfo.authInfo;
    });
    await Promise.all(promiseArr);
    return result;
  }
  async update(params: ApiCaseUpdateDto | any) {
    params['id'] = params.apiCaseUuid;
    return this.baseService.update(params);
  }
  bulkDelete(params: ApiCaseDeleteDto) {
    const { apiCaseUuids, ...rest } = params;
    rest['id'] = apiCaseUuids.map(uuid => uuid);
    return this.baseService.bulkDelete(rest);
  }
}
