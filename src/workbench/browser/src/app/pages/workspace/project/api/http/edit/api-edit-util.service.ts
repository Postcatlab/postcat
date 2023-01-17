import { Injectable } from '@angular/core';
import { BodyParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/apiData.dto';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';
import { eoDeepCopy, whatType } from 'eo/workbench/browser/src/app/utils/index.utils';

import { filterTableData } from '../../../../../../utils/tree/tree.utils';
@Injectable({ providedIn: 'root' })
export class ApiEditUtilService {
  constructor() {}

  private parseApiUI2Storage(formData, filterArrFun): ApiData {
    const result = eoDeepCopy(formData);
    ['bodyParams', 'headerParams', 'queryParams', 'restParams'].forEach(tableName => {
      if (whatType(result.requestParams[tableName]) !== 'array') {
        return;
      }
      result.requestParams[tableName] = filterTableData(result.requestParams[tableName], {
        filterFn: filterArrFun
      });
    });
    ['bodyParams', 'headerParams'].forEach(tableName => {
      if (whatType(result.responseList[0].responseParams[tableName]) !== 'array') {
        return;
      }
      result.responseList[0].responseParams[tableName] = filterTableData(result.responseList[0].responseParams[tableName], {
        filterFn: filterArrFun
      });
    });
    return result;
  }
  /**
   * Handle api data for judge page has edit
   * Unlike the saved data, the api data being edited is not as strict
   *
   * @param formData
   * @returns apiData
   */
  formatEditingApiData(formData: ApiData): ApiData {
    return this.parseApiUI2Storage(formData, (val: BodyParam) => val?.name || val?.description || val.paramAttr?.example);
  }
  /**
   * Handle api data to be saved
   *
   * @param formData
   * @returns apiData
   */
  formatUIApiDataToStorage(formData): ApiData {
    const result = this.parseApiUI2Storage(formData, val => {
      val.paramAttr.example = val['paramAttr.example'];
      delete val['paramAttr.example'];
      return val?.name;
    });
    return result;
  }
  /**
   * Handle storage api data to ui
   *
   * @param apiData
   * @returns formData
   */
  formatStorageApiDataToUI(apiData) {
    return this.parseApiUI2Storage(apiData, val => {
      val['paramAttr.example'] = val.paramAttr.example || '';
      return true;
    });
  }
}
