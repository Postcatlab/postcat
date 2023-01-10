import { Component } from '@angular/core';
import { db } from 'eo/workbench/browser/src/app/shared/services/storage/db';

@Component({
  selector: 'eo-root',
  template: ` <router-outlet></router-outlet> `
})
export class AppComponent {
  constructor() {
    setTimeout(async () => {
      const d = await db.project.collections('91ca042f-e12f-4416-9d93-ce5d2637e578');
      console.log('dddd', d);
    });
  }
}
