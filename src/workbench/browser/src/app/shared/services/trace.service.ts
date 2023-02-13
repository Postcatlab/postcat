import { Injectable } from '@angular/core';
// import { accountId } from 'eo/workbench/browser/growing.config.js';

declare const gio;

@Injectable({
  providedIn: 'root'
})
export class TraceService {
  constructor() {
    // gio('init', accountId, {});
    //custom page code begin here
    // window._gr_ignore_local_rule = true; // * Open local collection
    //Electron use hash mode
    if (!!window.electron) {
      gio('config', { hashtag: true });
    }
    //custom page code end here

    gio('send');
  }

  report(eventId, params = {}) {
    console.log('kkkk', eventId);
    // gio('track', eventId, params);
  }
  start() {
    gio('config', { dataCollect: false });
  }
  stop() {
    gio('config', { dataCollect: true });
  }
}
