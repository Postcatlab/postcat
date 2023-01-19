import { Injectable } from '@angular/core';
import { ApiTestHistory } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';

@Injectable()
export class ApiTestService {
  constructor(private effectService: EffectService) {}
  getHistory(id): Promise<ApiTestHistory> {
    return this.effectService.getHistory(id);
  }
  addHistory(history: ApiTestHistory): Promise<any> {
    return this.effectService.createApiTestHistory({
      apiUuid: history.apiUuid || -1,
      general: '{}',
      request: JSON.stringify(history.request),
      response: JSON.stringify(history.response)
    });
  }
}
