import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { Mock } from 'pc/browser/src/app/services/storage/db/models';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class DbMockService extends DbBaseService<Mock> {
  baseService = new DbBaseService(dataSource.mock);
  DbApiDataService = new DbBaseService(dataSource.apiData);
  constructor() {
    super(dataSource.mock);
  }
  async read(params) {
    const result = await this.baseService.read(params);
    if (!result.data) {
      return {
        success: false,
        code: 1,
        data: null
      };
    }
    const { data: apiItem } = await this.DbApiDataService.read({
      apiUuid: result.data.apiUuid
    });
    result.data.uri = apiItem.uri;
    return result;
  }
}
