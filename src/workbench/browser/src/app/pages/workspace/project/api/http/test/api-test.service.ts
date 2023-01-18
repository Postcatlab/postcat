import { Injectable } from '@angular/core';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';

import { ApiTestHistory } from '../../../../../../shared/services/storage/index.model';
import { ApiTestHistoryFrame } from './api-test.model';
@Injectable()
export class ApiTestService {
  constructor(private effectService: EffectService) {}
  getHistory(id): Promise<ApiTestHistory> {
    return this.effectService.getHistory(id);
  }
  addHistory(history: ApiTestHistoryFrame | any, apiUuid): Promise<any> {
    return this.effectService.createApiTestHistory({
      ...history,
      apiUuid
    });
  }
}
