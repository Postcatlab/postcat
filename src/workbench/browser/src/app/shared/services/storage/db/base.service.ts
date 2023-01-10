import type { Table } from 'dexie';
import { HookGenerator } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/base-hook.decorator';

import { ApiOkResponse } from './decorators/api-response.decorator';
export class BaseService<T> {
  constructor(readonly db: Table<T>) {}

  @HookGenerator()
  @ApiOkResponse()
  read(params: Record<string, any> = {}) {
    return this.db.where(params).first();
  }

  @HookGenerator()
  @ApiOkResponse()
  async create(params) {
    const id = await this.db.add(params);
    return this.read({ id });
  }

  @HookGenerator()
  @ApiOkResponse()
  async update(params) {
    return this.db.put(params);
  }

  @HookGenerator()
  @ApiOkResponse()
  async delete(params) {
    return this.db.delete(params);
  }

  @HookGenerator()
  @ApiOkResponse()
  async bulkRead(params: Record<string, any> = {}) {
    return this.db.where(params).toArray();
  }

  @HookGenerator()
  @ApiOkResponse()
  async bulkUpdate(params) {
    return this.db.bulkPut(params);
  }

  @HookGenerator()
  @ApiOkResponse()
  bulkDelete(params) {
    return this.db.bulkDelete(params);
  }

  @HookGenerator()
  @ApiOkResponse()
  bulkCreate(params) {
    return this.db.bulkAdd(params);
  }
}
