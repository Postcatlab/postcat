import Dexie, { Table } from 'dexie';
import { getSettings } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { messageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { DataSourceType } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
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
} from './index.model';
import { sampleApiData } from './IndexedDB/sample';

export type ResultType<T = any> = {
  status: StorageResStatus.success;
  data: T;
};

let isFirstLoad = true;
const getApiUrl = (apiData: ApiData) => {
  const dataSourceType: DataSourceType = getSettings()?.['eoapi-common.dataStorage'] ?? 'local';

  /** Is it a remote data source */
  const isRemote = dataSourceType === 'http';

  /** get mock url */
  const mockUrl = isRemote
    ? window.eo?.getModuleSettings?.('eoapi-common.remoteServer.url') + '/mock/eo-1/'
    : window.eo?.getMockUrl?.();

  const url = new URL(`${mockUrl}/${apiData.uri}`.replace(/(?<!:)\/{2,}/g, '/'), 'https://github.com/');
  // if (apiData) {
  //   url.searchParams.set('mockID', apiData.uuid + '');
  // }
  return decodeURIComponent(url.toString());
};

const createMockObj = (apiData: ApiData, options: Record<string, any> = {}) => {
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

const batchCreateMock = async (mock: Table<ApiMockEntity, number | string>, data: ApiData[]) => {
  try {
    if (Array.isArray(data)) {
      isFirstLoad = false;
      const mockList = await mock.where('uuid').above(0).toArray();
      const noHasDefaultMockApiDatas = data
        .filter((item) => !mockList.some((m) => Number(m.apiDataID) === item.uuid))
        .map((item) => createMockObj(item, { name: $localize`Default Mock`, createWay: 'system' }));

      await mock.bulkAdd(noHasDefaultMockApiDatas);
    }
    messageService.send({ type: 'mockAutoSyncSuccess', data: {} });
  } catch (e) {}
  return Promise.resolve(true);
};

/**
 * @description
 * A storage service with IndexedDB.
 */
export default class localStorage extends Dexie {

  private resProxy(data): ResultType {
    const result = {
      status: StorageResStatus.success,
      data,
    };
    return result as ResultType;
  }

  add(table: Table, items: Array<StorageItem>): object {
    const time = Date.now();
    const result = table.bulkAdd(
      items.map((item: StorageItem) => ({
        createdAt: time,
        updatedAt: time,
        ...item,
      }))
    );
    return this.resProxy(result);
  }

  remove(table: Table, uuids: Array<number | string>): object {
    const result = table.bulkDelete(uuids);
    return this.resProxy(result);
  }

  load(table: Table, uuids: Array<number | string>): object {
    return new Promise((resolve, reject) => {
      table
        .bulkGet(uuids)
        .then((result) => {
          resolve(this.resProxy(result));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  update({table: Table, items: Array<StorageItem>}): object {
    const time = Date.now();
    const list: any = items.map((item: StorageItem) => ({
      ...item,
      updatedAt: time,
    }));
    return new Promise((resolve, reject) => {
      table
        .bulkGet(list)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
