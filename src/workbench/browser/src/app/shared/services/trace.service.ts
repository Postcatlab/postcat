import { Injectable } from '@angular/core';
import { accountId } from 'eo/workbench/browser/growing.config';

declare const gio;

@Injectable({
  providedIn: 'root'
})
export class TraceService {
  constructor() {
    // @ts-ignore
    gio('init', accountId, {});
    //custom page code begin here
    //Electron use hash mode
    if (!!window.electron) {
      gio('config', { hashtag: true });
    }
    //custom page code end here
    gio('send');
  }

  report(eventId, params = {}) {
    if (!eventId) {
      return;
    }
    console.log('trace =>>', eventId, JSON.stringify(params, null, 2));
    gio('track', eventId, params);
  }
  start() {
    gio('config', { dataCollect: false });
  }
  stop() {
    gio('config', { dataCollect: true });
  }
}
