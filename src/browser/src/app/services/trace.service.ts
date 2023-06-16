import { Injectable } from '@angular/core';

import packageJson from '../../../../../package.json';
import { ElectronService } from '../core/services/electron/electron.service';
declare const gio;

/**
 * GrowingIO Event Tracking Service
 */
@Injectable({
  providedIn: 'root'
})
export class TraceService {
  constructor(private electron: ElectronService) {
    this.setVisitor({ client_type: this.electron.isElectron ? 'client' : 'web', app_version: packageJson.version });
  }

  report(eventId, params = {}) {
    if (!eventId) {
      return;
    }
    // scheduler.postTask(report, {priority: 'background'});
    //TODO Use background priority to optimize job: https://web.dev/optimize-long-tasks/#a-dedicated-scheduler-api
    gio('track', eventId, params);
  }
  setUserID(id) {
    gio('setUserId', id);
  }
  setUser(data = {}) {
    gio('people.set', data);
  }
  setVisitor(data = {}) {
    gio('visitor.set', data);
  }
  start() {
    gio('config', { dataCollect: false });
  }
  stop() {
    gio('config', { dataCollect: true });
  }
}
