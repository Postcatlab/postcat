import type { Table } from 'dexie';
import { HookGenerator } from 'eo/workbench/browser/src/app/shared/services/storage/db/decorators/base-hook.decorator';

import { ApiOkResponse, ApiResponseOptions } from '../decorators/api-response.decorator';
export class BaseService<T> {
  constructor(readonly db: Table<T>) {}

  private filterData(params: Record<string, any> = {}) {
    const entries = Object.entries(params);
    return this.db.filter(obj => {
      return entries.every(([key, value]) => {
        if (Array.isArray(value)) {
          return value.includes(obj[key]);
        } else {
          return Object.is(obj[key], value);
        }
      });
    });
  }

  @HookGenerator()
  @ApiOkResponse()
  read<P extends object>(params: P) {
    return this.db.where(params).first() as ApiResponseOptions<T>;
  }

  @HookGenerator()
  @ApiOkResponse()
  async create(params) {
    const id = await this.db.add(params);
    return this.read({ id }) as ApiResponseOptions<T>;
  }

  @HookGenerator()
  @ApiOkResponse()
  async update(params: Record<string, any> = {}) {
    const { id, ...rest } = params;
    await this.db.update(id, rest);
    return this.read({ id }) as ApiResponseOptions<T>;
  }

  @HookGenerator()
  @ApiOkResponse()
  async delete(params: Record<string, any> = {}) {
    return this.db.where(params).delete() as ApiResponseOptions<number>;
  }

  @HookGenerator()
  @ApiOkResponse()
  async bulkRead<P extends object>(params: P) {
    return this.filterData(params).toArray() as ApiResponseOptions<T[]>;
  }

  @HookGenerator()
  @ApiOkResponse()
  async bulkUpdate(params) {
    const keys = await this.db.bulkPut(params, { allKeys: true });
    return this.bulkRead({ id: keys }) as ApiResponseOptions<T[]>;
  }

  @HookGenerator()
  @ApiOkResponse()
  bulkDelete(params: Record<string, any> = {}) {
    return this.filterData(params).delete() as ApiResponseOptions<number>;
  }

  @HookGenerator()
  @ApiOkResponse()
  async bulkCreate(params) {
    const keys = await this.db.bulkAdd(params, { allKeys: true });
    return this.bulkRead({ id: keys }) as ApiResponseOptions<T[]>;
  }
}
