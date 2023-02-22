import type { Collection, IndexableType, Table, UpdateSpec } from 'dexie';

import { ApiPageResponsePromise, ApiResponse, ApiResponsePromise } from '../decorators/api-response.decorator';

type PageCallback<T> = (collection: Collection<T, IndexableType>) => Collection | Promise<T[]>;

export class BaseService<T extends object> {
  constructor(readonly db: Table<T>) {}

  private filterData(params: Record<string, any> = {}) {
    const entries = Object.entries(params);
    return this.db.filter(obj => {
      return entries.every(([key, value]) => {
        // support keypath
        const keys = key.split('.');
        const lastKey = keys.pop();
        const lastObj = keys.reduce((p, k) => p[k], obj);

        if (!Reflect.has(lastObj, lastKey)) {
          return true;
        }
        if (Array.isArray(value)) {
          return value.includes(lastObj[lastKey]);
        } else {
          return Object.is(lastObj[lastKey], value);
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
    const { id, uuid, ...rest } = params;
    if (id) {
      await this.db.update(id, rest as UpdateSpec<T>);
    } else {
      const result: any = await this.read({ uuid });
      await this.db.update(result.data.id, rest as UpdateSpec<T>);
    }
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
  private async __bulkRead(params: Record<string, any>) {
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
    return this.__bulkRead({ id: keys }) as ApiResponsePromise<T[]>;
  }

  @ApiResponse()
  bulkDelete(params: Record<string, any> = {}) {
    return this.filterData(params).delete() as ApiResponsePromise<number>;
  }

  @ApiResponse()
  async bulkCreate(params) {
    const keys = await this.db.bulkAdd(params, { allKeys: true });
    return this.__bulkRead({ id: keys }) as ApiResponsePromise<T[]>;
  }

  @ApiResponse()
  async page(params, callback?: PageCallback<T>) {
    let { page = 1, pageSize, ...restParams } = params;
    const filterRecords = this.filterData(restParams);
    const total = await filterRecords.count();

    // 外面不传分页大小的话，默认获取所有数据，有需要可以在上面自行给 pageSize 设置一个默认值。
    pageSize ??= total;

    const collection = filterRecords.offset(Math.max(0, page - 1)).limit(pageSize);

    const items = await (callback ? callback(collection) : collection.toArray());

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
