import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// import { EoMessageComponent } from './eo-message.component';

@Injectable({ providedIn: 'root' })
export class EoMessageService {
  // protected container?: EoMessageComponent;
  private subject = new Subject();
  constructor() {}
  onAlert() {
    return this.subject.asObservable();
  }
  success(content, time = 1000) {
    this.subject.next({ type: 'success', content, icon: 'check-circle' });
  }
  error(content, time = 1000) {
    this.subject.next({ type: 'error', content, icon: 'close-circle' });
  }
}
