import { Injectable } from '@angular/core';
import { ApiTestHistory } from 'pc/browser/src/app/services/storage/db/models';

import { ApiEffectService } from '../../store/api-effect.service';

@Injectable()
export class ApiTestService {
  constructor(private effect: ApiEffectService) {}
  getHistory(id): Promise<ApiTestHistory> {
    return this.effect.getHistory(id);
  }
  addHistory(history: ApiTestHistory): Promise<any> {
    return this.effect.createHistory({
      apiUuid: history.apiUuid || -1,
      general: '{}',
      request: JSON.stringify(history.request),
      response: JSON.stringify(history.response)
    });
  }
}
