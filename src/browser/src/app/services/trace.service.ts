import { Injectable } from '@angular/core';

import { ElectronService } from '../core/services/electron/electron.service';

declare const gio;

@Injectable({
  providedIn: 'root'
})
export class TraceService {
  constructor(private electron: ElectronService) {
    this.setUser({ client_type: this.electron.isElectron ? 'client' : 'web' });
  }

  report(eventId, params = {}) {
    if (!eventId) {
      return;
    }
    // console.log('trace =>>', eventId, JSON.stringify(params, null, 2));
    gio('track', eventId, params);
  }
  setUserID(id) {
    gio('setUserId', id);
  }
  setUser(data = {}) {
    gio('people.set', data);
  }
  start() {
    gio('config', { dataCollect: false });
  }
  stop() {
    gio('config', { dataCollect: true });
  }
}
