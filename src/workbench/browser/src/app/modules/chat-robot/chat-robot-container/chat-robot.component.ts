/**
 * API Design reference: https://github.dev/akveo/nebular/blob/master/src/playground/with-layout/chat/chat.module.ts
 * Component Document:https://akveo.github.io/nebular/docs/components/chat-ui/overview/#nbchatcomponent
 */
import { Component, ContentChildren, Input, QueryList } from '@angular/core';

import { ChatRobotMessageComponent } from '../chat-robot-message/chat-robot-message.component';

@Component({
  selector: 'pc-chat-robot',
  template: `
    <div class="header flex justify-between">
      <span>{{ title }}</span>
      <eo-iconpark-icon
        class="box-border flex items-center justify-center w-4 h-4 rounded-full end_icon"
        name="close"
        size="10"
      ></eo-iconpark-icon>
    </div>
    <div class="messages flex flex-col flex-1">
      <ng-content select="pc-chat-robot-message"></ng-content>
      <p class="no-messages" *ngIf="!messages?.length"></p>
    </div>
    <div class="form">
      <ng-content select="pc-chat-robot-form"></ng-content>
      <p class="mt-[5px] text-[12px] text-tips">Power by <a href="https://www.apispace.com" target="_blank">APISpace</a></p>
    </div>
  `,
  styleUrls: ['./chat-robot.component.scss']
})
export class ChatRobotComponent {
  @Input() title: string;
  @ContentChildren(ChatRobotMessageComponent) messages: QueryList<ChatRobotMessageComponent>;
}
