import Dexie, { Table } from 'dexie';
import { messageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import {
  DataSourceType,
  DATA_SOURCE_TYPE_KEY,
} from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { Observable } from 'rxjs';
import {
  Project,
  Environment,
  Group,
  ApiData,
  ApiTestHistory,
  ApiMockEntity,
  StorageInterface,
  StorageItem,
  StorageResStatus,
} from '../../index.model';
import { sampleApiData } from '../sample';

/**
 * @description
 * A storage service with IndexedDB.
 */
export class IndexedDBStorage extends Dexie implements StorageInterface {
  project!: Table<Project, number | string>;
  group!: Table<Group, number | string>;
  environment!: Table<Environment, number | string>;
  apiData!: Table<ApiData, number | string>;
  apiTestHistory!: Table<ApiTestHistory, number | string>;
  mock!: Table<ApiMockEntity, number | string>;

  constructor() {
    super('eoapi_core');
    this.version(2).stores({
      project: '++uuid, name',
      environment: '++uuid, name, projectID',
      group: '++uuid, name, projectID, parentID',
      apiData: '++uuid, name, projectID, groupID',
      apiTestHistory: '++uuid, projectID, apiDataID',
      mock: '++uuid, name, apiDataID, projectID, createWay',
    });
    this.open();
    this.on('populate', () => this.populate());
  }

  async populate() {
    await this.project.add({ uuid: 1, name: 'Default' });
    // @ts-ignore
    await this.apiData.bulkAdd(sampleApiData);
  }

  getApiUrl(apiData: ApiData) {
    const dataSourceType: DataSourceType = (localStorage.getItem(DATA_SOURCE_TYPE_KEY) as DataSourceType) || 'local';

    /** Is it a remote data source */
    const isRemote = dataSourceType === 'http';

    /** get mock url */
    const mockUrl = isRemote
      ? window.eo?.getModuleSettings?.('eoapi-common.remoteServer.url') + '/mock/eo-1/'
      : window.eo?.getMockUrl?.();

    const url = new URL(`${mockUrl}/${apiData.uri}`.replace(/(?<!:)\/{2,}/g, '/'), 'https://github.com/');
    if (apiData) {
      url.searchParams.set('mockID', apiData.uuid + '');
    }
    console.log('getApiUrl', decodeURIComponent(url.toString()));
    return decodeURIComponent(url.toString());
  }

  private createMockObj = (apiData: ApiData, options: Record<string, any> = {}) => {
    const { name = '', createWay = 'custom', ...rest } = options;
    return {
      name,
      url: this.getApiUrl(apiData),
      apiDataID: apiData.uuid,
      projectID: 1,
      createWay,
      response: JSON.stringify(tree2obj([].concat(apiData.responseBody))),
      ...rest,
    };
  };

  private resProxy(data) {
    let result = {
      status: StorageResStatus.success,
      data: data,
    };
    // if (isNotEmpty(data)) {
    //   result.status = StorageResStatus.success;
    // } else {
    //   result.status = StorageResStatus.empty;
    // }
    return result;
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
          obs.next(this.resProxy(Object.assign(item, { uuid: result })));
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
          obs.next(this.resProxy({ number: result }));
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
            obs.next(this.resProxy(result));
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
        .bulkGet(uuids.map(Number))
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
              .bulkPut(
                newItems.map((n: any) => ({
                  ...n,
                  groupID: ~~n.groupID.replace('group-', ''),
                }))
              )
              .then((result) => {
                obs.next(this.resProxy({ number: result, items: newItems }));
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
  private remove(table: Table, uuid: number | string): Observable<object> {
    return new Observable((obs) => {
      table
        .delete(uuid)
        .then(() => {
          obs.next(this.resProxy(true));
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
  private bulkRemove(table: Table, uuids: Array<number | string>): Observable<object> {
    return new Observable((obs) => {
      table
        .bulkDelete(uuids)
        .then(() => {
          obs.next(this.resProxy(true));
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
            obs.next(this.resProxy(result));
            obs.complete();
          } else {
            obs.error(`Nothing found from table [${table.name}] with id [${uuid}].`);
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
  private bulkLoad(table: Table, uuids: Array<number | string>): Observable<object> {
    return new Observable((obs) => {
      table
        .bulkGet(uuids)
        .then((result) => {
          if (result) {
            obs.next(this.resProxy(result));
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
    where: { [key: string]: string | number | null },
    callback?
  ): Observable<object> {
    return new Observable((obs) => {
      table
        .where(where)
        .toArray()
        .then(async (result) => {
          if (result) {
            await callback?.(result);
            obs.next(this.resProxy(result));
            obs.complete();
          } else {
            obs.error(`Nothing found from table [${table.name}].`);
          }
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }
  apiDataBulkCreate(items: Array<ApiData>): Observable<object> {
    return this.bulkCreate(this.apiData, items);
  }
  apiDataBulkLoad(uuids: Array<number | string>): Observable<object> {
    return this.bulkLoad(this.apiData, uuids);
  }
  apiDataBulkRemove(uuids: Array<number | string>): Observable<object> {
    return this.bulkRemove(this.apiData, uuids);
  }
  apiDataBulkUpdate(items: Array<ApiData>): Observable<object> {
    return this.bulkUpdate(this.apiData, items);
  }
  apiDataCreate(item: ApiData): Observable<object> {
    return this.create(this.apiData, item);
  }
  apiDataLoad(uuid: number | string): Observable<object> {
    return this.load(this.apiData, uuid);
  }

  apiDataLoadAllByGroupID(groupID: number | string): Observable<object> {
    return this.loadAllByConditions(this.apiData, { groupID });
  }

  apiDataLoadAllByProjectID(projectID: number | string): Observable<object> {
    const callback = async (data: ApiData) => {
      if (Array.isArray(data)) {
        const mockList = await this.mock.where('uuid').above(0).toArray();
        const noHasDefaultMockApiDatas = data
          .filter((item) => !mockList.some((m) => Number(m.apiDataID) === item.uuid))
          .map((item) => this.createMockObj(item, { name: '默认 Mock', createWay: 'system' }));

        await this.mock.bulkAdd(noHasDefaultMockApiDatas);
      }
      messageService.send({ type: 'mockAutoSyncSuccess', data: {} });
      return Promise.resolve(true);
    };
    const result = this.loadAllByConditions(this.apiData, { projectID }, callback);

    return result;
  }

  /**
   * Load all apiData items by projectID and groupID.
   * @param projectID
   * @param groupID
   */
  apiDataLoadAllByProjectIDAndGroupID(projectID: number | string, groupID: number | string): Observable<object> {
    return this.loadAllByConditions(this.apiData, { projectID, groupID });
  }

  /**
   * Delete apiData item.
   * @param uuid
   */
  apiDataRemove(uuid: number | string): Observable<object> {
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
  apiTestHistoryBulkLoad(uuids: Array<number | string>): Observable<object> {
    return this.bulkLoad(this.apiTestHistory, uuids);
  }

  /**
   * Bulk remove apiTestHistory items.
   * @param uuids
   */
  apiTestHistoryBulkRemove(uuids: Array<number | string>): Observable<object> {
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
  apiTestHistoryLoadAllByApiDataID(apiDataID: number | string): Observable<object> {
    return this.loadAllByConditions(this.apiTestHistory, { apiDataID: apiDataID });
  }

  /**
   * Load all mock items by apiDataID.
   * @param apiDataID
   */
  apiMockLoadAllByApiDataID(apiDataID: number | string): Observable<object> {
    return this.loadAllByConditions(this.mock, { apiDataID });
  }

  /**
   * Load all apiTestHistory items by projectID.
   * @param projectID
   */
  apiTestHistoryLoadAllByProjectID(projectID: number | string): Observable<object> {
    return this.loadAllByConditions(this.apiTestHistory, { projectID: projectID });
  }

  /**
   * Delete apiTestHistory item.
   * @param uuid
   */
  apiTestHistoryRemove(uuid: number | string): Observable<object> {
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
  environmentBulkLoad(uuids: Array<number | string>): Observable<object> {
    return this.bulkLoad(this.environment, uuids);
  }

  /**
   * Bulk delete environment items.
   * @param uuids
   */
  environmentBulkRemove(uuids: Array<number | string>): Observable<object> {
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
  environmentLoadAllByProjectID(projectID: number | string): Observable<object> {
    return this.loadAllByConditions(this.environment, { projectID: projectID });
  }

  /**
   * Delete environment item.
   * @param uuid
   */
  environmentRemove(uuid: number | string): Observable<object> {
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
  groupBulkLoad(uuids: Array<number | string>): Observable<object> {
    return this.bulkLoad(this.group, uuids);
  }

  /**
   * Bulk delete group items.
   * @param uuids
   */
  groupBulkRemove(uuids: Array<number | string>): Observable<object> {
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

  groupLoadAllByProjectID(projectID: number | string): Observable<object> {
    return this.loadAllByConditions(this.group, { projectID: projectID });
  }

  /**
   * Delete group item.
   * @param uuid
   */
  groupRemove(uuid: number | string): Observable<object> {
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
          if (tableName === 'project') {
            result[tableName] = (await this[tableName].toArray())[0];
          } else {
            result[tableName] = await this[tableName].toArray();
          }
        }
        obs.next(this.resProxy(result));
        obs.complete();
      };
      fun();
    });
  }
  /**
   * Bulk load project items.
   * @param uuids
   */
  projectBulkLoad(uuids: Array<number | string>): Observable<object> {
    return this.bulkLoad(this.project, uuids);
  }

  /**
   * Bulk delete project items.
   * @param uuids
   */
  projectBulkRemove(uuids: Array<number | string>): Observable<object> {
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
  projectRemove(uuid: number | string): Observable<object> {
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

  /**
   * Create mock item.
   * @param item
   */
  mockCreate(item: ApiMockEntity): Observable<object> {
    return this.create(this.mock, item);
  }

  /**
   * Load mock item.
   * @param uuid
   */
  mockLoad(uuid: number | string): Observable<object> {
    return this.load(this.mock, uuid);
  }

  /**
   * Delete mock item.
   * @param uuid
   */
  mockRemove(uuid: number | string): Observable<object> {
    return this.remove(this.mock, uuid);
  }

  /**
   * Update mock item.
   * @param item
   * @param uuid
   */
  mockUpdate(item: ApiMockEntity, uuid: number | string): Observable<object> {
    return this.update(this.mock, item, uuid);
  }
}
