import type { IndexableType, Table } from 'dexie';

export abstract class BaseService<T> {
  constructor(readonly db: Table<T>) {}

  afterCreate?(params: IndexableType): void;

  read(params) {
    return this.db.get(params);
  }
  async create(params) {
    const result = await this.db.add(params);
    this.afterCreate(result);
    return result;
  }
  update(params) {
    return this.db.put(params);
  }
  delete(params) {
    return this.db.delete(params);
  }

  bulkRead(params) {
    return this.db.bulkGet(params);
  }
  bulkUpdate(params) {
    return this.db.bulkPut(params);
  }
  bulkDelete(params) {
    return this.db.bulkDelete(params);
  }
  bulkCreate(params) {
    return this.db.bulkAdd(params);
  }
}
