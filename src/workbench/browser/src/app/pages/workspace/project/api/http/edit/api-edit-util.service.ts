import { Injectable } from '@angular/core';
import { RequestProtocol } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { BodyParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/apiData.dto';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';
import { eoDeepCopy, whatType } from 'eo/workbench/browser/src/app/utils/index.utils';
import { omit } from 'lodash-es';

import { ModalService } from '../../../../../../shared/services/modal.service';
import { filterTableData } from '../../../../../../utils/tree/tree.utils';
@Injectable()
export class ApiEditUtilService {
  constructor(private modalService: ModalService) {}

  parseApiStorage2UI(apiData) {
    const result = apiData;
    result.protocol = RequestProtocol.HTTP;
    result.groupId = (result.groupId === 0 ? -1 : result.groupId || -1).toString();
    return result;
  }

  private parseApiUI2Storage(formData, filterArrFun): ApiData {
    const result = eoDeepCopy(formData);
    result.groupId = Number(result.groupId === '-1' ? '0' : result.groupId);
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
  formatSavingApiData(formData): ApiData {
    return this.parseApiUI2Storage(formData, val => val?.name);
  }
}
