import type { Table } from 'dexie';

import { ApiOkResponse } from './decorators/api-response.decorator';
export class BaseService<T> {
  constructor(readonly db: Table<T>) {}

  @ApiOkResponse()
  read(params) {
    return this.db.get(params);
  }

  @ApiOkResponse()
  async create(params) {
    const id = await this.db.add(params);
    return this.read(id);
  }

  @ApiOkResponse()
  async update(params) {
    return this.db.put(params);
  }

  @ApiOkResponse()
  async delete(params) {
    return this.db.delete(params);
  }

  @ApiOkResponse()
  async bulkRead(params) {
    return this.db.bulkGet(params);
  }

  @ApiOkResponse()
  async bulkUpdate(params) {
    return this.db.bulkPut(params);
  }

  @ApiOkResponse()
  bulkDelete(params) {
    return this.db.bulkDelete(params);
  }

  @ApiOkResponse()
  bulkCreate(params) {
    return this.db.bulkAdd(params);
  }
}
