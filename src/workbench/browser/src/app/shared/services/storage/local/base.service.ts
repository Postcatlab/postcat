import type { Table } from 'dexie';

export class BaseService<T> {
  constructor(readonly db: Table<T>) {}

  query(params) {
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
}
