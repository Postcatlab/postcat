import type { Table } from 'dexie';

import { ApiPageResponsePromise, ApiResponse, ApiResponsePromise } from '../decorators/api-response.decorator';
export class BaseService<T> {
  constructor(readonly db: Table<T>) {}

  private filterData(params: Record<string, any> = {}) {
    const entries = Object.entries(params);
    return this.db.filter(obj => {
      return entries.every(([key, value]) => {
        if (!Reflect.has(obj as unknown as object, key)) {
          return true;
        }
        if (Array.isArray(value)) {
          return value.includes(obj[key]);
        } else {
          return Object.is(obj[key], value);
        }
      });
    });
  }

  @ApiResponse()
  read(params: Record<string, any> = {}) {
    return this.filterData(params).first() as ApiResponsePromise<T>;
  }

  @ApiResponse()
  async create(params) {
    const id = await this.db.add(params);
    return this.read({ id }) as ApiResponsePromise<T>;
  }

  @ApiResponse()
  async update(params: Record<string, any> = {}) {
    const { id, ...rest } = params;
    await this.db.update(id, rest);
    return this.read({ id }) as ApiResponsePromise<T>;
  }

  @ApiResponse()
  async delete(params: Record<string, any> = {}) {
    return this.db.where(params).delete() as ApiResponsePromise<number>;
  }

  @ApiResponse()
  async bulkRead(params: Record<string, any>) {
    return this.filterData(params).toArray() as ApiResponsePromise<T[]>;
  }

  @ApiResponse()
  async bulkUpdate(params: any[]) {
    const keys = await this.db.bulkPut(params, { allKeys: true });
    const promiseArr = params.map(item => {
      const { id, ...rest } = item;
      return this.db.update(id, rest);
    });
    await Promise.all(promiseArr);
    return this.bulkRead({ id: keys }) as ApiResponsePromise<T[]>;
  }

  @ApiResponse()
  bulkDelete(params: Record<string, any> = {}) {
    return this.filterData(params).delete() as ApiResponsePromise<number>;
  }

  @ApiResponse()
  async bulkCreate(params) {
    const keys = await this.db.bulkAdd(params, { allKeys: true });
    return this.bulkRead({ id: keys }) as ApiResponsePromise<T[]>;
  }

  @ApiResponse()
  async page(params) {
    let { page = 1, pageSize, ...restParams } = params;
    const filterRecords = this.filterData(restParams);
    const total = await filterRecords.count();

    pageSize ??= total;

    const items = await filterRecords
      .offset(Math.max(0, page - 1))
      .limit(pageSize)
      .toArray();

    const paginator = {
      page,
      total,
      size: pageSize
    };
    return {
      paginator,
      items
    } as unknown as ApiPageResponsePromise<T[]>;
  }
}
