import { Injectable } from '@angular/core';
import { ApiBodyType } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { BodyParam } from 'pc/browser/src/app/services/storage/db/dto/apiData.dto';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { eoDeepCopy } from 'pc/browser/src/app/shared/utils/index.utils';

import { filterTableData } from '../../../../../../shared/utils/tree/tree.utils';

export const mui = {
  headerParams: 0,
  bodyParams: 1,
  queryParams: 2,
  restParams: 3
};

@Injectable({ providedIn: 'root' })
export class ApiEditUtilService {
  constructor() {}

  parseApiUI2Storage(formData, filterArrFun): ApiData {
    const result = eoDeepCopy(formData);

    //Parse Request body
    ['bodyParams', 'headerParams', 'queryParams', 'restParams'].forEach(tableName => {
      if (tableName === 'bodyParams' && [ApiBodyType.Binary, ApiBodyType.Raw].includes(formData.apiAttrInfo.contentType)) {
        if (result.requestParams.bodyParams?.[0]) {
          result.requestParams.bodyParams[0].orderNo = 0;
          result.requestParams.bodyParams[0].paramType = 0;
          result.requestParams.bodyParams[0].partType = mui['bodyParams'];
        }
        return;
      }
      result.requestParams[tableName] = filterTableData(result.requestParams[tableName], {
        filterFn: item => {
          item.partType = mui[tableName];
          item.paramType = 0;
          return filterArrFun(item);
        }
      });
    });

    //Parse response body
    if (!result.responseList?.[0]?.responseParams) {
      return result;
    }
    ['bodyParams', 'headerParams'].forEach(tableName => {
      if (tableName === 'bodyParams' && [ApiBodyType.Binary, ApiBodyType.Raw].includes(result.responseList[0].contentType)) {
        if (result.responseList[0].bodyParams?.[0]) {
          result.responseList[0].bodyParams[0].orderNo = 0;
          result.responseList[0].bodyParams[0].paramType = 1;
          result.responseList[0].bodyParams[0].partType = mui['bodyParams'];
        }
        return;
      }
      result.responseList[0].responseParams[tableName] = filterTableData(result.responseList[0].responseParams[tableName], {
        filterFn: item => {
          item.partType = mui[tableName];
          item.paramType = 1;
          return filterArrFun(item);
        }
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
      val.orderNo = 0;
      val.paramAttr ??= {};
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
      val['paramAttr.example'] = val.paramAttr?.example || '';
      return true;
    });
  }
}
