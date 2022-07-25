import { Injectable } from '@angular/core';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { ApiData, StorageRes } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { listToTreeHasLevel, treeToListHasLevel } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
@Injectable()
export class ApiEditService {
  constructor(private storage: StorageService, private apiTab: ApiTabStorageService, private apiService: ApiService) {}
  async getApi(id): Promise<ApiData> {
    let result: ApiData;
    //Recovery from tab
    if (this.apiTab.currentTab && this.apiTab.tabCache[this.apiTab.tabID]) {
      let tabData = this.apiTab.tabCache[this.apiTab.tabID];
      return tabData.apiData;
    }
    if (!id) {
      let tmpApiData = window.sessionStorage.getItem('apiDataWillbeSave');
      if (tmpApiData) {
        //Add From Test|Copy Api
        window.sessionStorage.removeItem('apiDataWillbeSave');
        Object.assign(result, JSON.parse(tmpApiData));
      } else {
        //Add directly
        Object.assign(result, {
          requestBodyType: 'json',
          requestBodyJsonType: 'object',
          requestBody: [],
          queryParams: [],
          restParams: [],
          requestHeaders: [],
          responseHeaders: [],
          responseBodyType: 'json',
          responseBodyJsonType: 'object',
          responseBody: [],
        });
      }
    } else {
      result = (await this.apiService.get(id)) as ApiData;
      ['requestBody', 'responseBody'].forEach((tableName) => {
        if (['xml', 'json'].includes(result[`${tableName}Type`])) {
          result[tableName] = treeToListHasLevel(result[tableName]);
        }
      });
    }
    return result;
  }
  editApi(apiData): Promise<StorageRes> {
    apiData.groupID = Number(apiData.groupID === '-1' ? '0' : apiData.groupID);
    ['requestBody', 'queryParams', 'restParams', 'requestHeaders', 'responseHeaders', 'responseBody'].forEach(
      (tableName) => {
        if (typeof apiData[tableName] !== 'object') {
          return;
        }
        apiData[tableName] = (apiData[tableName] || []).filter((val) => val.name);
        if (['requestBody', 'responseBody'].includes(tableName)) {
          if (['xml', 'json'].includes(apiData[`${tableName}Type`])) {
            apiData[tableName] = listToTreeHasLevel(apiData[tableName]);
          }
        }
      }
    );
    const busEvent = apiData.uuid ? 'editApi' : 'addApi';
    if (busEvent === 'editApi') {
      return new Promise((resolve) => {
        this.storage.run('apiDataUpdate', [apiData, apiData.uuid], resolve);
      });
    } else {
      return this.apiService.add(apiData);
    }
  }
}
