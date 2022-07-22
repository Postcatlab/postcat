import { Injectable } from '@angular/core';
import { ApiModule } from 'eo/workbench/browser/src/app/pages/api/api.module';

@Injectable({
  providedIn: ApiModule,
})
export class ApiTabService {
  constructor() {}
  watchRouteChange() {}
  initContent() {}
  restoreFromData() {}
  watchContentChange() {}
}
