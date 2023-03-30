import { dataSource } from 'pc/browser/src/app/services/storage/db/dataSource';
import { ApiCaseDeleteDto, ApiCaseCreateDto } from 'pc/browser/src/app/services/storage/db/dto/apiCase.dto';
import { ApiCase } from 'pc/browser/src/app/services/storage/db/models';
import { DbBaseService } from 'pc/browser/src/app/services/storage/db/services/base.service';

export class DbApiCaseService extends DbBaseService<ApiCase> {
  baseService = new DbBaseService(dataSource.apiCase);
  constructor() {
    super(dataSource.apiCase);
  }
  async bulkCreate(params: ApiCaseCreateDto) {
    return this.baseService.bulkCreate(params.apiCaseList);
  }
  bulkDelete(params: ApiCaseDeleteDto) {
    const { apiCaseUuids, ...rest } = params;
    rest['id'] = apiCaseUuids.map(uuid => uuid);
    console.log(rest);
    return this.baseService.bulkDelete(rest);
  }
}
