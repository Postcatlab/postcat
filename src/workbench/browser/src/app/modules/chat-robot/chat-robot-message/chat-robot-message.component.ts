import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'pc-chat-robot-message',
  template: `
    <nz-avatar [nzSize]="40" class="flex-shrink-0" nzIcon="user" [nzSrc]="avatar"></nz-avatar>
    <div class="message flex flex-col">
      <p class="sender mb-0.5 text-tips font-[12px]">
        <span class="mr-[5px]">{{ sender }}</span>
        <span>{{ date | date }}</span>
      </p>
      <div class="message-content">
        <ng-container *ngTemplateOutlet="messageContent"></ng-container>
        <pre *ngIf="message" class="text !mb-0"> {{ message }} </pre>
      </div>
    </div>
  `,
  styleUrls: ['./chat-robot-message.component.scss']
})
export class ChatRobotMessageComponent {
  /**
   * Message sender
   */
  @Input() sender: string;

  /**
   * Message sender
   */
  @Input() message: string;

  /**
   * Message send date
   */
  @Input() date: Date;

  /**
   *  Message send avatar
   */
  @Input() avatar: string;

  /**
   * Determines if a message is a reply
   */
  @Input()
  @HostBinding('class.reply')
  reply: boolean;

  @HostBinding('class.not-reply')
  get notReply() {
    return !this.reply;
  }
  @Input() messageContent: TemplateRef<any>;
}
