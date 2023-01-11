import type { Table } from 'dexie';

import { ApiOkResponse, ApiResponsePromise } from '../decorators/api-response.decorator';
export class BaseService<T> {
  constructor(readonly db: Table<T>) {
    return this;
  }

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

  @ApiOkResponse()
  read(params: Record<string, any> = {}) {
    return this.db.where(params).first() as ApiResponsePromise<T>;
  }

  @ApiOkResponse()
  async create(params) {
    const id = await this.db.add(params);
    return this.read({ id }) as ApiResponsePromise<T>;
  }

  @ApiOkResponse()
  async update(params: Record<string, any> = {}) {
    const { id, ...rest } = params;
    await this.db.update(id, rest);
    return this.read({ id }) as ApiResponsePromise<T>;
  }

  @ApiOkResponse()
  async delete(params: Record<string, any> = {}) {
    return this.db.where(params).delete() as ApiResponsePromise<number>;
  }

  @ApiOkResponse()
  async bulkRead(params: Record<string, any>) {
    return this.filterData(params).toArray() as ApiResponsePromise<T[]>;
  }

  @ApiOkResponse()
  async bulkUpdate(params) {
    const keys = await this.db.bulkPut(params, { allKeys: true });
    return this.bulkRead({ id: keys }) as ApiResponsePromise<T[]>;
  }

  @ApiOkResponse()
  bulkDelete(params: Record<string, any> = {}) {
    return this.filterData(params).delete() as ApiResponsePromise<number>;
  }

  @ApiOkResponse()
  async bulkCreate(params) {
    const keys = await this.db.bulkAdd(params, { allKeys: true });
    return this.bulkRead({ id: keys }) as ApiResponsePromise<T[]>;
  }
}
