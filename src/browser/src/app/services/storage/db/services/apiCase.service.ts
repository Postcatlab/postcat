import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiCase } from 'pc/browser/src/app/services/storage/db/models';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class DbApiCaseService extends DbBaseService<ApiCase> {
  baseService = new DbBaseService(dataSource.apiCase);
  constructor() {
    super(dataSource.apiCase);
  }
  async bulkReadDetail(params) {
    const { apiCaseUuid, workSpaceUuid, projectUuid } = params;
    const result = await this.baseService.bulkRead({
      uuid: apiCaseUuid.map(uuid => uuid),
      workSpaceUuid,
      projectUuid
    });
    return result;
  }
}
