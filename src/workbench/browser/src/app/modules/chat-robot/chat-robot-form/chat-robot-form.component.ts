import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pc-chat-robot-form',
  template: ` <div class="flex items-end">
    <textarea
      eo-ng-input
      class="mr-[5px]"
      fullWidth
      [nzAutosize]="{ minRows: 1, maxRows: 6 }"
      [(ngModel)]="message"
      type="text"
      [placeholder]="placeholder"
      (keyup.enter)="sendMessage()"
    ></textarea>
    <button eo-ng-button nzType="primary" [nzLoading]="loading" (click)="sendMessage()" i18n class="send-button">Send</button>
  </div>`,
  styles: []
})
export class ChatRobotFormComponent {
  /**
   * Predefined message text
   *
   * @type {string}
   */
  @Input() message: string = '';
  @Input() placeholder: string = '';

  @Input() loading: boolean = false;

  /**
   * Send message triggle event
   */
  @Output() readonly send = new EventEmitter<{ message: string }>();
  sendMessage() {
    if (this.loading) return;
    if (!String(this.message).trim().length) return;
    this.send.emit({ message: this.message.replace(/^[\r\n]+|[\r\n]+$/g, '') });
    this.message = '';
  }
}
