import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Message } from './message.model';
/**
 * @description
 * A message queue global send and get message
 */
@Injectable({ providedIn: 'root' })
export class MessageService {
  private subject = new Subject<Message>();

  constructor() {}

  /**
   * send message
   *
   * @param message
   */
  send(message: Message): void {
    this.subject.next(message);
  }

  /**
   * get message
   *
   * @returns message mutation observer
   */
  get(): Observable<Message> {
    return this.subject.asObservable();
  }
}

export const messageService = new MessageService();
