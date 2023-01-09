import type { Table } from 'dexie';

export class BaseService<T> {
  constructor(readonly db: Table<T>) {}

  read(params) {
    return this.db.get(params);
  }
  create(params) {
    return this.db.add(params);
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
