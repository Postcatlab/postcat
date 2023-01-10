import { Component } from '@angular/core';
import { db } from 'eo/workbench/browser/src/app/shared/services/storage/db';

@Component({
  selector: 'eo-root',
  template: ` <router-outlet></router-outlet> `
})
export class AppComponent {
  constructor() {
    setTimeout(async () => {
      const d = await db.apiData.create({ name: '测试', projectUuid: crypto.randomUUID() });
      console.log('dddd', d);
    });
  }
}
