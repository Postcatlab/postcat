/**
 * API Design reference: https://github.dev/akveo/nebular/blob/master/src/playground/with-layout/chat/chat.module.ts
 * Component Document:https://akveo.github.io/nebular/docs/components/chat-ui/overview/#nbchatcomponent
 */
import { Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';

import { ChatRobotMessageComponent } from '../chat-robot-message/chat-robot-message.component';
import { ChatRobotService } from '../chat-robot.service';

@Component({
  selector: 'pc-chat-robot',
  template: `
    <div class="header flex justify-between items-center">
      <span>{{ title }}</span>
      <button eo-ng-button nzType="text">
        <eo-iconpark-icon size="14" name="close" (click)="closeRobot()"></eo-iconpark-icon>
      </button>
    </div>
    <div class="messages flex flex-col flex-1">
      <ng-content select="pc-chat-robot-message"></ng-content>
      <p class="no-messages" *ngIf="!messages?.length"></p>
    </div>
    <div class="form">
      <ng-content select="pc-chat-robot-form"></ng-content>
      <p class="mt-[5px] text-[12px] text-tips"
        >Power by <a [href]="powerBy.link" target="_blank">{{ powerBy.title }}</a></p
      >
    </div>
  `,
  styleUrls: ['./chat-robot.component.scss']
})
export class ChatRobotComponent {
  @Input() title: string;
  @ContentChildren(ChatRobotMessageComponent) messages: QueryList<ChatRobotMessageComponent>;

  @Input() powerBy: { title: string; link: string };

  constructor(private chat: ChatRobotService) {}
  closeRobot() {
    this.chat.close();
  }
}
