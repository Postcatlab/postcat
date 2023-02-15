import { Injectable } from '@angular/core';

declare const gio;

@Injectable({
  providedIn: 'root'
})
export class TraceService {
  constructor() {}

  report(eventId, params = {}) {
    if (!eventId) {
      return;
    }
    console.log('trace =>>', eventId, JSON.stringify(params, null, 2));
    gio('track', eventId, params);
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
