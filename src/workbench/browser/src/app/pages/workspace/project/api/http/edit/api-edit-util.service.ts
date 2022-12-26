import { Injectable, ɵɵsetComponentScope } from '@angular/core';
import { RequestProtocol } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { eoDeepCopy, whatType } from 'eo/workbench/browser/src/app/utils/index.utils';
import { omit } from 'lodash-es';

import { ModalService } from '../../../../../../shared/services/modal.service';
import { ApiData } from '../../../../../../shared/services/storage/index.model';
import { filterTableData } from '../../../../../../utils/tree/tree.utils';
@Injectable()
export class ApiEditUtilService {
  constructor(private modalService: ModalService) {}

  parseApiStorage2UI(apiData) {
    const result = apiData;
    result.protocol = RequestProtocol.HTTP;
    result.groupID = (result.groupID === 0 ? -1 : result.groupID || -1).toString();
    return result;
  }

  private parseApiUI2Storage(formData, filterArrFun): ApiData {
    const result = eoDeepCopy(formData);
    result.groupID = Number(result.groupID === '-1' ? '0' : result.groupID);
    ['requestBody', 'queryParams', 'restParams', 'requestHeaders', 'responseHeaders', 'responseBody'].forEach(tableName => {
      if (whatType(result[tableName]) !== 'array') {
        return;
      }
      result[tableName] = filterTableData(result[tableName], {
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
  formatEditingApiData(formData): ApiData {
    return this.parseApiUI2Storage(formData, val => val?.name || val?.description || val?.example);
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
