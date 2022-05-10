import Dexie, { Table } from 'dexie';
import { Observable } from 'rxjs';
import { Project, Environment, Group, ApiData, ApiTestHistory, StorageInterface, StorageItem } from '../types';
import { sampleApiData } from '../sample';

class Storage extends Dexie implements StorageInterface {
  project!: Table<Project, number | string>;
  group!: Table<Group, number | string>;
  environment!: Table<Environment, number | string>;
  apiData!: Table<ApiData, number | string>;
  apiTestHistory!: Table<ApiTestHistory, number | string>;

  constructor() {
    console.log('eoapi indexedDB storage start');
    super('eoapi_core');
    this.version(1).stores({
      project: '++uuid, name',
      environment: '++uuid, name, projectID',
      group: '++uuid, name, projectID, parentID',
      apiData: '++uuid, name, projectID, groupID',
      apiTestHistory: '++uuid, projectID, apiDataID',
    });
    this.open();
    this.on('populate', () => this.populate());
  }

  async populate() {
    await this.project.add({ uuid: 1, name: 'Default' });
    // @ts-ignore
    await this.apiData.bulkAdd(sampleApiData);
  }

  /**
   * Create item.
   * @param table
   * @param item
   */
  private create(table: Table, item: StorageItem): Observable<object> {
    if (!item.createdAt) {
      item.createdAt = new Date();
    }
    item.updatedAt = item.createdAt;
    return new Observable((obs) => {
      table
        .add(item)
        .then((result) => {
          obs.next(Object.assign(item, { uuid: result }));
          obs.complete();
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }

  /**
   * Bulk create items.
   * @param table
   * @param items
   */
  private bulkCreate(table: Table, items: Array<StorageItem>): Observable<object> {
    items = items.map((item: StorageItem) => {
      if (!item.createdAt) {
        item.createdAt = new Date();
      }
      item.updatedAt = item.createdAt;
      return item;
    });
    return new Observable((obs) => {
      // @ts-ignore
      table
        .bulkAdd(items)
        .then((result) => {
          obs.next({ number: result });
          obs.complete();
        })
        .catch((error: any) => {
          obs.error(error);
        });
    });
  }

  /**
   * Update item.
   * @param table
   * @param item
   * @param uuid
   */
  private update(table: Table, item: StorageItem, uuid: number | string): Observable<object> {
    if (!item.updatedAt) {
      item.updatedAt = new Date();
    }
    return new Observable((obs) => {
      table
        .update(uuid, item)
        .then(async (updated) => {
          if (updated) {
            let result = await table.get(uuid);
            obs.next(result);
            obs.complete();
          } else {
            // obs.error(`Nothing was updated [${table.name}] - there were no data with primary key: ${uuid}`);
          }
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }

  /**
   * Bulk update items.
   * @param table
   * @param items
   */
  private bulkUpdate(table: Table, items: Array<StorageItem>): Observable<object> {
    items = items.map((item: StorageItem) => {
      if (!item.updatedAt) {
        item.updatedAt = new Date();
      }
      return item;
    });
    return new Observable((obs) => {
      let uuids: Array<number | string> = [];
      let updateData = {};
      items
        .filter((item: StorageItem) => item.uuid)
        .forEach((item: StorageItem) => {
          if (item.uuid) {
            uuids.push(item.uuid);
            // @ts-ignore
            updateData[item.uuid] = item;
            delete item['uuid'];
          }
        });
      table
        .bulkGet(uuids)
        .then((existItems) => {
          if (existItems) {
            let newItems: Array<StorageItem> = [];
            existItems
              .filter((x) => x)
              .forEach((item: StorageItem) => {
                // @ts-ignore
                newItems.push(Object.assign(item, updateData[item.uuid] || {}));
              });
            // @ts-ignore
            table
              .bulkPut(newItems)
              .then((result) => {
                obs.next({ number: result, items: newItems });
                obs.complete();
              })
              .catch((error: any) => {
                obs.error(error);
              });
          } else {
            // obs.error(`Nothing found from table [${table.name}].`);
          }
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }

  /**
   * Delete item.
   * @param table
   * @param uuid
   */
  private remove(table: Table, uuid: number | string): Observable<boolean> {
    return new Observable((obs) => {
      table
        .delete(uuid)
        .then(() => {
          obs.next(true);
          obs.complete();
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }

  /**
   * Bulk delete items.
   * @param table
   * @param uuids
   */
  private bulkRemove(table: Table, uuids: Array<number | string>): Observable<boolean> {
    return new Observable((obs) => {
      table
        .bulkDelete(uuids)
        .then(() => {
          obs.next(true);
          obs.complete();
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }

  /**
   * Load item with primary key.
   * @param table
   * @param uuid
   */
  private load(table: Table, uuid: number | string): Observable<object> {
    return new Observable((obs) => {
      table
        .get(uuid)
        .then((result) => {
          if (result) {
            obs.next(result);
            obs.complete();
          } else {
            // obs.error(`Nothing found from table [${table.name}] with id [${uuid}].`);
          }
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }

  /**
   * Bulk load items with primary keys.
   * @param table
   * @param uuids
   */
  private bulkLoad(table: Table, uuids: Array<number | string>): Observable<Array<object>> {
    return new Observable((obs) => {
      table
        .bulkGet(uuids)
        .then((result) => {
          if (result) {
            obs.next(result);
            obs.complete();
          } else {
            // obs.error(`Nothing found from table [${table.name}] with uuids [${JSON.stringify(uuids)}].`);
          }
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }

  /**
   * Load all items by conditions.
   * @param table
   * @param where
   */
  private loadAllByConditions(
    table: Table,
    where: { [key: string]: string | number | null }
  ): Observable<Array<object>> {
    return new Observable((obs) => {
      table
        .where(where)
        .toArray()
        .then((result) => {
          if (result) {
            obs.next(result);
            obs.complete();
          } else {
            // obs.error(`Nothing found from table [${table.name}].`);
          }
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }

  /**
   * Bulk create apiData items.
   * @param items
   */
  apiDataBulkCreate(items: Array<ApiData>): Observable<object> {
    return this.bulkCreate(this.apiData, items);
  }

  /**
   * Bulk load apiData items.
   * @param uuids
   */
  apiDataBulkLoad(uuids: Array<number | string>): Observable<Array<object>> {
    return this.bulkLoad(this.apiData, uuids);
  }

  /**
   * Bulk delete apiData items.
   * @param uuids
   */
  apiDataBulkRemove(uuids: Array<number | string>): Observable<boolean> {
    return this.bulkRemove(this.apiData, uuids);
  }

  /**
   * Bulk update apiData items.
   * @param items
   */
  apiDataBulkUpdate(items: Array<ApiData>): Observable<object> {
    return this.bulkUpdate(this.apiData, items);
  }

  /**
   * Create apiData item.
   * @param item
   */
  apiDataCreate(item: ApiData): Observable<object> {
    return this.create(this.apiData, item);
  }

  /**
   * Load apiData item with primary key.
   * @param uuid
   */
  apiDataLoad(uuid: number | string): Observable<object> {
    return this.load(this.apiData, uuid);
  }

  /**
   * Load all apiData items by groupID.
   * @param groupID
   */
  apiDataLoadAllByGroupID(groupID: number | string): Observable<Array<object>> {
    return this.loadAllByConditions(this.apiData, { groupID: groupID });
  }

  /**
   * Load all apiData items by projectID.
   * @param projectID
   */
  apiDataLoadAllByProjectID(projectID: number | string): Observable<Array<object>> {
    return this.loadAllByConditions(this.apiData, { projectID: projectID });
  }

  /**
   * Load all apiData items by projectID and groupID.
   * @param projectID
   * @param groupID
   */
  apiDataLoadAllByProjectIDAndGroupID(projectID: number | string, groupID: number | string): Observable<Array<object>> {
    return this.loadAllByConditions(this.apiData, { projectID: projectID, groupID: groupID });
  }

  /**
   * Delete apiData item.
   * @param uuid
   */
  apiDataRemove(uuid: number | string): Observable<boolean> {
    return this.remove(this.apiData, uuid);
  }

  /**
   * Update apiData item.
   * @param item
   * @param uuid
   */
  apiDataUpdate(item: ApiData, uuid: number | string): Observable<object> {
    return this.update(this.apiData, item, uuid);
  }

  /**
   * Bulk create apiTestHistory items.
   * @param items
   */
  apiTestHistoryBulkCreate(items: Array<ApiTestHistory>): Observable<object> {
    return this.bulkCreate(this.apiTestHistory, items);
  }

  /**
   * Bulk load apiTestHistory items.
   * @param uuids
   */
  apiTestHistoryBulkLoad(uuids: Array<number | string>): Observable<Array<object>> {
    return this.bulkLoad(this.apiTestHistory, uuids);
  }

  /**
   * Bulk remove apiTestHistory items.
   * @param uuids
   */
  apiTestHistoryBulkRemove(uuids: Array<number | string>): Observable<boolean> {
    return this.bulkRemove(this.apiTestHistory, uuids);
  }

  /**
   * Bulk update apiTestHistory items.
   * @param items
   */
  apiTestHistoryBulkUpdate(items: Array<ApiTestHistory>): Observable<object> {
    return this.bulkUpdate(this.apiTestHistory, items);
  }

  /**
   * Create apiTestHistory item.
   * @param item
   */
  apiTestHistoryCreate(item: ApiTestHistory): Observable<object> {
    return this.create(this.apiTestHistory, item);
  }

  /**
   * Load apiTestHistory item.
   * @param uuid
   */
  apiTestHistoryLoad(uuid: number | string): Observable<object> {
    return this.load(this.apiTestHistory, uuid);
  }

  /**
   * Load all apiTestHistory items by apiDataID.
   * @param apiDataID
   */
  apiTestHistoryLoadAllByApiDataID(apiDataID: number | string): Observable<Array<object>> {
    return this.loadAllByConditions(this.apiTestHistory, { apiDataID: apiDataID });
  }

  /**
   * Load all apiTestHistory items by projectID.
   * @param projectID
   */
  apiTestHistoryLoadAllByProjectID(projectID: number | string): Observable<Array<object>> {
    return this.loadAllByConditions(this.apiTestHistory, { projectID: projectID });
  }

  /**
   * Delete apiTestHistory item.
   * @param uuid
   */
  apiTestHistoryRemove(uuid: number | string): Observable<boolean> {
    return this.remove(this.apiTestHistory, uuid);
  }

  /**
   * Update apiTestHistory item.
   * @param item
   * @param uuid
   */
  apiTestHistoryUpdate(item: ApiTestHistory, uuid: number | string): Observable<object> {
    return this.update(this.apiTestHistory, item, uuid);
  }

  /**
   * Bulk create environment items.
   * @param items
   */
  environmentBulkCreate(items: Array<Environment>): Observable<object> {
    return this.bulkCreate(this.environment, items);
  }

  /**
   * Bulk load environment items.
   * @param uuids
   */
  environmentBulkLoad(uuids: Array<number | string>): Observable<Array<object>> {
    return this.bulkLoad(this.environment, uuids);
  }

  /**
   * Bulk delete environment items.
   * @param uuids
   */
  environmentBulkRemove(uuids: Array<number | string>): Observable<boolean> {
    return this.bulkRemove(this.environment, uuids);
  }

  /**
   * Bulk update environment items.
   * @param items
   */
  environmentBulkUpdate(items: Array<Environment>): Observable<object> {
    return this.bulkUpdate(this.environment, items);
  }

  /**
   * Create environment item.
   * @param item
   */
  environmentCreate(item: Environment): Observable<object> {
    return this.create(this.environment, item);
  }

  /**
   * Load environment item.
   * @param uuid
   */
  environmentLoad(uuid: number | string): Observable<object> {
    return this.load(this.environment, uuid);
  }

  /**
   * Load all environment items by projectID.
   * @param projectID
   */
  environmentLoadAllByProjectID(projectID: number | string): Observable<Array<object>> {
    return this.loadAllByConditions(this.environment, { projectID: projectID });
  }

  /**
   * Delete environment item.
   * @param uuid
   */
  environmentRemove(uuid: number | string): Observable<boolean> {
    return this.remove(this.environment, uuid);
  }

  /**
   * Update environment item.
   * @param item
   * @param uuid
   */
  environmentUpdate(item: Environment, uuid: number | string): Observable<object> {
    return this.update(this.environment, item, uuid);
  }

  /**
   * Bulk create group items.
   * @param items
   */
  groupBulkCreate(items: Array<Group>): Observable<object> {
    return this.bulkCreate(this.group, items);
  }

  /**
   * Bulk load group items.
   * @param uuids
   */
  groupBulkLoad(uuids: Array<number | string>): Observable<Array<object>> {
    return this.bulkLoad(this.group, uuids);
  }

  /**
   * Bulk delete group items.
   * @param uuids
   */
  groupBulkRemove(uuids: Array<number | string>): Observable<boolean> {
    return this.bulkRemove(this.group, uuids);
  }

  /**
   * Bulk update group items.
   * @param items
   */
  groupBulkUpdate(items: Array<Group>): Observable<object> {
    return this.bulkUpdate(this.group, items);
  }

  /**
   * Create group item.
   * @param item
   */
  groupCreate(item: Group): Observable<object> {
    return this.create(this.group, item);
  }

  /**
   * Load group item.
   * @param uuid
   */
  groupLoad(uuid: number | string): Observable<object> {
    return this.load(this.group, uuid);
  }

  /**
   * Load all group items by projectID.
   * @param projectID
   */
  groupLoadAllByProjectID(projectID: number | string): Observable<Array<object>> {
    return this.loadAllByConditions(this.group, { projectID: projectID });
  }

  /**
   * Delete group item.
   * @param uuid
   */
  groupRemove(uuid: number | string): Observable<boolean> {
    return this.remove(this.group, uuid);
  }

  /**
   * Update group item.
   * @param item
   * @param uuid
   */
  groupUpdate(item: Group, uuid: number | string): Observable<object> {
    return this.update(this.group, item, uuid);
  }

  /**
   * Bulk create project items.
   * @param items
   */
  projectBulkCreate(items: Array<Project>): Observable<object> {
    return this.bulkCreate(this.project, items);
  }
  projectExport(): Observable<object> {
    return new Observable((obs) => {
      let fun = async () => {
        let result = {},
          tables = ['environment', 'group', 'project', 'apiData'];
        for (var i = 0; i < tables.length; i++) {
          let tableName = tables[i];
          result[tableName] = await this[tableName].toArray();
        }
        obs.next(result);
        obs.complete();
      };
      fun();
    });
  }
  /**
   * Bulk load project items.
   * @param uuids
   */
  projectBulkLoad(uuids: Array<number | string>): Observable<Array<object>> {
    return this.bulkLoad(this.project, uuids);
  }

  /**
   * Bulk delete project items.
   * @param uuids
   */
  projectBulkRemove(uuids: Array<number | string>): Observable<boolean> {
    return this.bulkRemove(this.project, uuids);
  }

  /**
   * Bulk update project items.
   * @param items
   */
  projectBulkUpdate(items: Array<Project>): Observable<object> {
    return this.bulkUpdate(this.project, items);
  }

  /**
   * Create project item.
   * @param item
   */
  projectCreate(item: Project): Observable<object> {
    return this.create(this.project, item);
  }

  /**
   * Load project item.
   * @param uuid
   */
  projectLoad(uuid: number | string): Observable<object> {
    return this.load(this.project, uuid);
  }

  /**
   * Delete project item.
   * @param uuid
   */
  projectRemove(uuid: number | string): Observable<boolean> {
    return this.remove(this.project, uuid);
  }

  /**
   * Update project item.
   * @param item
   * @param uuid
   */
  projectUpdate(item: Project, uuid: number | string): Observable<object> {
    return this.update(this.project, item, uuid);
  }
}

export const storage = new Storage();
