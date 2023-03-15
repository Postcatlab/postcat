/**
 * API Design reference: https://github.dev/akveo/nebular/blob/master/src/playground/with-layout/chat/chat.module.ts
 * Component Document:https://akveo.github.io/nebular/docs/components/chat-ui/overview/#nbchatcomponent
 */
import { AfterViewInit, Component, ContentChildren, ElementRef, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';

import { ChatRobotMessageComponent } from '../chat-robot-message/chat-robot-message.component';
import { ChatRobotService } from '../chat-robot.service';

@Component({
  selector: 'pc-chat-robot',
  template: `
    <div class="header flex justify-between items-center">
      <span>{{ title }}</span>
      <button eo-ng-button nzType="text" (click)="closeRobot()">
        <eo-iconpark-icon size="14" name="close"></eo-iconpark-icon>
      </button>
    </div>
    <div class="messages flex flex-col flex-1" #scrollable>
      <ng-content select="pc-chat-robot-message"></ng-content>
      <p class="no-messages" *ngIf="!messages?.length"></p>
    </div>
    <div class="form">
      <ng-content select="pc-chat-robot-form"></ng-content>
      <p class="mt-[7px] text-[12px] text-tips" i18n
        >Power by <a [href]="powerBy.link" target="_blank">{{ powerBy.title }}</a></p
      >
    </div>
  `,
  styleUrls: ['./chat-robot.component.scss']
})
export class ChatRobotComponent implements AfterViewInit {
  @Input() title: string;
  @ContentChildren(ChatRobotMessageComponent) messages: QueryList<ChatRobotMessageComponent>;

  @ViewChild('scrollable') scrollable: ElementRef;

  @Input() powerBy: { title: string; link: string };

  constructor(private chat: ChatRobotService) {}
  closeRobot() {
    this.chat.close();
  }

  ngAfterViewInit() {
    this.messages.changes.subscribe(messages => {
      this.messages = messages;
      this.updateView();
    });

    this.updateView();
  }
  scrollListBottom() {
    this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight;
  }

  updateView() {
    this.scrollListBottom();
  }
}
