import Dexie, { Table } from 'dexie';
import { getSettings } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { DataSourceType } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { uniqueSlash } from 'eo/workbench/browser/src/app/utils/api';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { firstValueFrom, Observable } from 'rxjs';
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

import { parseAndCheckApiData, parseAndCheckEnv, parseAndCheckGroup } from './validate';
import { sampleApiData } from './index.constant';

export type ResultType<T = any> = {
  status: StorageResStatus.success;
  data: T;
};

const getApiUrl = (apiData: ApiData) => {
  const dataSourceType: DataSourceType = getSettings()?.['eoapi-common.dataStorage'] ?? 'local';

  /** Is it a remote data source */
  const isRemote = dataSourceType === 'http';

  /** get mock url */
  const mockUrl = isRemote
    ? window.eo?.getExtensionSettings?.('eoapi-common.remoteServer.url') + '/mock/eo-1/'
    : window.eo?.getMockUrl?.();

  const url = new URL(uniqueSlash(`${mockUrl}/${apiData.uri}`), 'https://github.com/');
  // if (apiData) {
  //   url.searchParams.set('mockID', apiData.uuid + '');
  // }
  return decodeURIComponent(url.toString());
};

export const createMockObj = (apiData: ApiData, options: Record<string, any> = {}) => {
  const { name = '', createWay = 'custom', ...rest } = options;
  return {
    name,
    url: getApiUrl(apiData),
    apiDataID: apiData.uuid,
    projectID: 1,
    createWay,
    response: JSON.stringify(tree2obj([].concat(apiData.responseBody))),
    ...rest,
  };
};

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
    const apiDataKeys = await this.apiData.bulkAdd(sampleApiData, { allKeys: true });
    const apiData = sampleApiData.map((n, i) =>
      createMockObj(n, { name: $localize`Default Mock`, createWay: 'system', apiDataID: apiDataKeys.at(i) })
    );
    this.mock.bulkAdd(apiData);
  }

  private resProxy(data): ResultType {
    const result = {
      status: StorageResStatus.success,
      data,
    };
    return result as ResultType;
  }
  /**
   * Create item.
   *
   * @param table
   * @param item
   */
  private create(table: Table, item: StorageItem): Observable<any> {
    if (!item.createdAt) {
      item.createdAt = new Date();
    }
    delete item.uuid;
    item.updatedAt = item.createdAt;
    const result = table.add(item);
    return new Observable((obs) => {
      result
        .then((uuid) => {
          obs.next(this.resProxy(Object.assign(item, { uuid })));
          obs.complete();
        })
        .catch((error) => {
          obs.error(error);
        });
    });
  }

  /**
   * Bulk create items.
   *
   * @param table
   * @param items
   */
  private bulkCreate(table: Table, items: Array<StorageItem>): Observable<object> {
    items = items.map((item: StorageItem) => {
      delete item.uuid;
      if (!item.createdAt) {
        item.createdAt = new Date();
      }
      item.updatedAt = item.createdAt;
      return item;
    });
    const result = table.bulkAdd(items);
    return new Observable((obs) => {
      result
        .then((res) => {
          obs.next(this.resProxy({ number: res }));
          obs.complete();
        })
        .catch((error: any) => {
          obs.error(error);
        });
    });
  }

  /**
   * Update item.
   *
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
            const result = await table.get(uuid);
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
   *
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
      const uuids: Array<number | string> = [];
      const updateData = {};
      items
        .filter((item: StorageItem) => item.uuid)
        .forEach((item: StorageItem) => {
          if (item.uuid) {
            uuids.push(item.uuid);
            updateData[item.uuid] = item;
            delete item.uuid;
          }
        });
      table
        .bulkGet(uuids.map(Number))
        .then((existItems) => {
          if (existItems) {
            const newItems: Array<StorageItem> = [];
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
   *
   * @param table
   * @param uuid
   */
  private remove(table: Table, uuid: number | string): Observable<object> {
    const result = table.delete(uuid);
    return new Observable((obs) => {
      result
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
   *
   * @param table
   * @param uuids
   */
  private bulkRemove(table: Table, uuids: Array<number | string>): Observable<object> {
    const result = table.bulkDelete(uuids);
    return new Observable((obs) => {
      result
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
   *
   * @param table
   * @param uuid
   */
  private load(table: Table, uuid: number | string): Observable<object> {
    const result = table.get(uuid);
    return new Observable((obs) => {
      result
        .then((res) => {
          if (res) {
            obs.next(this.resProxy(res));
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
   *
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
   *
   * @param table
   * @param where
   */
  private loadAllByConditions(table: Table, where: { [key: string]: string | number | null }): Observable<object> {
    const result = table.where(where).toArray();
    return new Observable((obs) => {
      result
        .then(async (res) => {
          if (res) {
            obs.next(this.resProxy(res));
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
  apiDataBulkRemoveByGroupIDs(groupIDs: number[]) {
    return this.apiData.where('groupID').anyOf(groupIDs).delete();
  }
  apiDataBulkUpdate(items: Array<ApiData>): Observable<object> {
    return this.bulkUpdate(this.apiData, items);
  }
  apiDataCreate(item: ApiData): Observable<ResultType<ApiData>> {
    const result = this.create(this.apiData, item);
    result.subscribe(async ({ status, data }: ResultType<ApiData>) => {
      if (status === 200 && data) {
        await this.mock.add(createMockObj(data, { name: '默认 Mock', createWay: 'system' }));
      }
    });
    return result;
  }
  apiDataLoad(uuid: number | string): Observable<object> {
    return this.load(this.apiData, uuid);
  }

  apiDataLoadAllByGroupID(groupID: number | string): Observable<object> {
    return this.loadAllByConditions(this.apiData, { groupID });
  }

  apiDataLoadAllByProjectID(projectID: number | string): Observable<object> {
    return this.loadAllByConditions(this.apiData, { projectID });
  }

  /**
   * Load all apiData items by projectID and groupID.
   *
   * @param projectID
   * @param groupID
   */
  apiDataLoadAllByProjectIDAndGroupID(projectID: number | string, groupID: number | string): Observable<object> {
    return this.loadAllByConditions(this.apiData, { projectID, groupID });
  }

  /**
   * Delete apiData item.
   *
   * @param uuid
   */
  apiDataRemove(uuid: number | string): Observable<object> {
    const result = this.remove(this.apiData, uuid);

    result.subscribe(async ({ status, data }: ResultType<ApiData>) => {
      if (status === 200 && data) {
        const mockList = await this.mock.where('apiDataID').equals(uuid).toArray();
        this.mock.bulkDelete(mockList.map((n) => n.uuid));
      }
    });

    return result;
  }

  /**
   * Update apiData item.
   *
   * @param item
   * @param uuid
   */
  apiDataUpdate(item: ApiData, uuid: number | string): Observable<object> {
    return this.update(this.apiData, item, uuid);
  }

  /**
   * Bulk create apiTestHistory items.
   *
   * @param items
   */
  apiTestHistoryBulkCreate(items: Array<ApiTestHistory>): Observable<object> {
    return this.bulkCreate(this.apiTestHistory, items);
  }

  /**
   * Bulk load apiTestHistory items.
   *
   * @param uuids
   */
  apiTestHistoryBulkLoad(uuids: Array<number | string>): Observable<object> {
    return this.bulkLoad(this.apiTestHistory, uuids);
  }

  /**
   * Bulk remove apiTestHistory items.
   *
   * @param uuids
   */
  apiTestHistoryBulkRemove(uuids: Array<number | string>): Observable<object> {
    return this.bulkRemove(this.apiTestHistory, uuids);
  }

  /**
   * Bulk update apiTestHistory items.
   *
   * @param items
   */
  apiTestHistoryBulkUpdate(items: Array<ApiTestHistory>): Observable<object> {
    return this.bulkUpdate(this.apiTestHistory, items);
  }

  /**
   * Create apiTestHistory item.
   *
   * @param item
   */
  apiTestHistoryCreate(item: ApiTestHistory): Observable<object> {
    return this.create(this.apiTestHistory, item);
  }

  /**
   * Load apiTestHistory item.
   *
   * @param uuid
   */
  apiTestHistoryLoad = (uuid: number | string): Observable<object> => this.load(this.apiTestHistory, uuid);

  /**
   * Load all apiTestHistory items by apiDataID.
   *
   * @param apiDataID
   */
  apiTestHistoryLoadAllByApiDataID(apiDataID: number | string): Observable<object> {
    return this.loadAllByConditions(this.apiTestHistory, { apiDataID: Number(apiDataID) });
  }

  /**
   * Load all mock items by apiDataID.
   *
   * @param apiDataID
   */
  apiMockLoadAllByApiDataID(apiDataID: number | string): Observable<object> {
    return this.loadAllByConditions(this.mock, { apiDataID: Number(apiDataID) });
  }

  /**
   * Load all apiTestHistory items by projectID.
   *
   * @param projectID
   */
  apiTestHistoryLoadAllByProjectID(projectID: number | string): Observable<object> {
    return this.loadAllByConditions(this.apiTestHistory, { projectID });
  }

  /**
   * Delete apiTestHistory item.
   *
   * @param uuid
   */
  apiTestHistoryRemove(uuid: number | string): Observable<object> {
    return this.remove(this.apiTestHistory, uuid);
  }

  /**
   * Update apiTestHistory item.
   *
   * @param item
   * @param uuid
   */
  apiTestHistoryUpdate(item: ApiTestHistory, uuid: number | string): Observable<object> {
    return this.update(this.apiTestHistory, item, uuid);
  }

  /**
   * Bulk create environment items.
   *
   * @param items
   */
  environmentBulkCreate(items: Array<Environment>): Observable<object> {
    return this.bulkCreate(this.environment, items);
  }

  /**
   * Bulk load environment items.
   *
   * @param uuids
   */
  environmentBulkLoad(uuids: Array<number | string>): Observable<object> {
    return this.bulkLoad(this.environment, uuids);
  }

  /**
   * Bulk delete environment items.
   *
   * @param uuids
   */
  environmentBulkRemove(uuids: Array<number | string>): Observable<object> {
    return this.bulkRemove(this.environment, uuids);
  }

  /**
   * Bulk update environment items.
   *
   * @param items
   */
  environmentBulkUpdate(items: Array<Environment>): Observable<object> {
    return this.bulkUpdate(this.environment, items);
  }

  /**
   * Create environment item.
   *
   * @param item
   */
  environmentCreate(item: Environment): Observable<object> {
    return this.create(this.environment, item);
  }

  /**
   * Load environment item.
   *
   * @param uuid
   */
  environmentLoad(uuid: number | string): Observable<object> {
    return this.load(this.environment, uuid);
  }

  /**
   * Load all environment items by projectID.
   *
   * @param projectID
   */
  environmentLoadAllByProjectID(projectID: number | string): Observable<object> {
    return this.loadAllByConditions(this.environment, { projectID });
  }

  /**
   * Delete environment item.
   *
   * @param uuid
   */
  environmentRemove(uuid: number | string): Observable<object> {
    return this.remove(this.environment, uuid);
  }

  /**
   * Update environment item.
   *
   * @param item
   * @param uuid
   */
  environmentUpdate(item: Environment, uuid: number | string): Observable<object> {
    return this.update(this.environment, item, uuid);
  }

  /**
   * Bulk create group items.
   *
   * @param items
   */
  groupBulkCreate(items: Array<Group>): Observable<object> {
    return this.bulkCreate(this.group, items);
  }

  /**
   * Bulk load group items.
   *
   * @param uuids
   */
  groupBulkLoad(uuids: Array<number | string>): Observable<object> {
    return this.bulkLoad(this.group, uuids);
  }

  /**
   * Bulk delete group items.
   *
   * @param uuids
   */
  groupBulkRemove(uuids: Array<number>): Observable<object> {
    this.apiDataBulkRemoveByGroupIDs(uuids);
    return this.bulkRemove(this.group, uuids);
  }

  /**
   * Bulk update group items.
   *
   * @param items
   */
  groupBulkUpdate(items: Array<Group>): Observable<object> {
    return this.bulkUpdate(this.group, items);
  }

  /**
   * Create group item.
   *
   * @param item
   */
  groupCreate(item: Group): Observable<ResultType<Group>> {
    return this.create(this.group, item);
  }

  /**
   * Load group item.
   *
   * @param uuid
   */
  groupLoad(uuid: number | string): Observable<object> {
    return this.load(this.group, uuid);
  }

  groupLoadAllByProjectID(projectID: number | string): Observable<object> {
    return this.loadAllByConditions(this.group, { projectID });
  }
  /**
   * Load project collections
   *
   * @param projectID
   * @returns
   */
  projectCollections(projectID: number | string): Observable<object> {
    return new Observable((obs) => {
      const fun = async () => {
        const result = {
          groups: await this.group.where({ projectID }).toArray(),
          apis: await this.apiData.where({ projectID }).toArray(),
        };
        obs.next(this.resProxy(result));
        obs.complete();
      };
      fun();
    });
  }

  /**
   * Delete group item.
   *
   * @param uuid
   */
  groupRemove(uuid: number | string): Observable<object> {
    return this.remove(this.group, uuid);
  }

  /**
   * Update group item.
   *
   * @param item
   * @param uuid
   */
  groupUpdate(item: Group, uuid: number | string): Observable<object> {
    return this.update(this.group, item, uuid);
  }
  projectImport(uuid: number, data, groupID = 0): Observable<object> {
    return new Observable((obs) => {
      const errors = {
        apiData: [],
      };
      const successes = {
        group: [],
        apiData: [],
        environment: [],
      };
      //Add api and group
      const deepFn = (collections, parentID) =>
        new Promise(async (resolve) => {
          if (collections.length === 0) {
            resolve('');
          }
          const promiseTask = collections.map(async (item) => {
            item.projectID = uuid;
            //Judge item is api or group
            if (item.uri || item.method || item.protocol) {
              delete item.uuid;
              item.groupID = parentID;
              const result = parseAndCheckApiData(item);
              if (!result.validate) {
                errors.apiData.push(item.name || item.uri);
                return;
              }
              const apiData = (await firstValueFrom(this.apiDataCreate(result.data))).data;
              successes.apiData.push({
                uri: apiData.uri,
                name: apiData.name,
                uuid: apiData.uuid,
              });
            } else {
              item.parentID = parentID;
              const result = parseAndCheckGroup(item);
              if (!result.validate) {
                return;
              }
              const group = (await firstValueFrom(this.groupCreate(result.data))).data;
              item.uuid = group.uuid;
              successes.group.push({ name: group.name, uuid: group.uuid });
            }
            if (item.children?.length) {
              await deepFn(item.children, item.uuid);
            }
          });
          await Promise.allSettled(promiseTask);
          resolve('');
        });
      deepFn(data.collections, groupID).then(() => {
        //Add env
        if (data.enviroments && data.enviroments.length) {
          data.enviroments.forEach((item) => {
            item.projectID = uuid;
            const result = parseAndCheckEnv(item);
            if (!result.validate) {
              return;
            }
            this.environmentCreate(result.data).subscribe(({ status, data: environment }: ResultType<Environment>) => {
              if (status === 200 && data) {
                successes.environment.push({
                  name: environment.name,
                  uuid: environment.uuid,
                });
              }
            });
          });
        }
        obs.next(
          this.resProxy({
            errors,
            successes,
          })
        );
        obs.complete();
      });
    });
  }
  /**
   * Bulk create project items.
   *
   * @param items
   */

  projectBulkCreate(items: Array<Project>): Observable<object> {
    return this.bulkCreate(this.project, items);
  }
  projectExport(): Observable<object> {
    return new Observable((obs) => {
      const fun = async () => {
        const result = {};
        const tables = ['environment', 'group', 'project', 'apiData', 'mock'];
        for (const tableName of tables) {
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
   *
   * @param uuids
   */
  projectBulkLoad(uuids: Array<number | string>): Observable<object> {
    return this.bulkLoad(this.project, uuids);
  }

  /**
   * Bulk delete project items.
   *
   * @param uuids
   */
  projectBulkRemove(uuids: Array<number | string>): Observable<object> {
    return this.bulkRemove(this.project, uuids);
  }

  /**
   * Bulk update project items.
   *
   * @param items
   */
  projectBulkUpdate(items: Array<Project>): Observable<object> {
    return this.bulkUpdate(this.project, items);
  }

  /**
   * Create project item.
   *
   * @param item
   */
  projectCreate(item: Project): Observable<object> {
    return this.create(this.project, item);
  }

  /**
   * Load project item.
   *
   * @param uuid
   */
  projectLoad(uuid: number | string): Observable<object> {
    return this.load(this.project, uuid);
  }

  /**
   * Delete project item.
   *
   * @param uuid
   */
  projectRemove(uuid: number | string): Observable<object> {
    return this.remove(this.project, uuid);
  }

  /**
   * Update project item.
   *
   * @param item
   * @param uuid
   */
  projectUpdate(item: Project, uuid: number | string): Observable<object> {
    return this.update(this.project, item, uuid);
  }

  /**
   * Create mock item.
   *
   * @param item
   */
  mockCreate(item: ApiMockEntity): Observable<object> {
    return this.create(this.mock, item);
  }

  /**
   * Load mock item.
   *
   * @param uuid
   */
  mockLoad(uuid: number | string): Observable<object> {
    return this.load(this.mock, uuid);
  }

  /**
   * Delete mock item.
   *
   * @param uuid
   */
  mockRemove(uuid: number | string): Observable<object> {
    return this.remove(this.mock, uuid);
  }

  /**
   * Update mock item.
   *
   * @param item
   * @param uuid
   */
  mockUpdate(item: ApiMockEntity, uuid: number | string): Observable<object> {
    return this.update(this.mock, item, uuid);
  }
}
