import { dataSource } from 'eo/workbench/browser/src/app/shared/services/storage/db/dataSource';
import { ApiResponse, ResObj } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/api-response.decorator';
import { Environment } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BaseService } from 'eo/workbench/browser/src/app/shared/services/storage/db/services/base.service';

export class EnvironmentService extends BaseService<Environment> {
  baseService = new BaseService(dataSource.environment);
  constructor() {
    super(dataSource.environment);
  }

  @ApiResponse()
  create(params: any) {
    if (params.name?.length > 32) {
      throw new ResObj(null, { code: 131000001, message: $localize`Environment name length needs to be less than 32` });
    }
    return this.baseService.create(params);
  }

  @ApiResponse()
  update(params: any) {
    if (params.name?.length > 32) {
      throw new ResObj(null, { code: 131000001, message: $localize`Environment name length needs to be less than 32` });
    }
    return this.baseService.update(params);
  }
}
