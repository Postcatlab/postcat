import type { Table } from 'dexie';
import { HookFactory } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/base-hook.decorator';

import { ApiOkResponse } from './decorators/api-response.decorator';
export class BaseService<T> {
  constructor(readonly db: Table<T>) {}

  @HookFactory()
  @ApiOkResponse()
  read(params) {
    return this.db.get(params);
  }

  @HookFactory()
  @ApiOkResponse()
  async create(params) {
    const id = await this.db.add(params);
    return this.read(id);
  }

  @HookFactory()
  @ApiOkResponse()
  async update(params) {
    return this.db.put(params);
  }

  @HookFactory()
  @ApiOkResponse()
  async delete(params) {
    return this.db.delete(params);
  }

  @HookFactory()
  @ApiOkResponse()
  async bulkRead(params) {
    return this.db.bulkGet(params);
  }

  @HookFactory()
  @ApiOkResponse()
  async bulkUpdate(params) {
    return this.db.bulkPut(params);
  }

  @HookFactory()
  @ApiOkResponse()
  bulkDelete(params) {
    return this.db.bulkDelete(params);
  }

  @HookFactory()
  @ApiOkResponse()
  bulkCreate(params) {
    return this.db.bulkAdd(params);
  }
}
