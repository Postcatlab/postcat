import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FeatureControlService } from 'eo/workbench/browser/src/app/core/services/feature-control/feature-control.service';
import { ExtensionInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';

import { ChatRobotModule } from '../../../modules/chat-robot/chat-robot.module';
import { ChatRobotService } from '../../../modules/chat-robot/chat-robot.service';
import { StarMotivationComponent } from '../../../modules/star-motivation/star-motivation.component';

type messageItem = {
  text: string;
  date: Date;
  reply: boolean;
  type: string;
  user: {
    name: string;
    avatar: string;
  };
};

@Component({
  selector: 'pc-chatgpt-robot',
  standalone: true,
  imports: [StarMotivationComponent, CommonModule, ChatRobotModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ])
  ],
  template: `
    <pc-chat-robot *ngIf="chat.isShow && feature.config.chatRobot" [@slideInOut] [powerBy]="powerBy" [title]="title">
      <pc-chat-robot-message
        [reply]="initMessage.reply"
        [sender]="initMessage.user.name"
        [avatar]="initMessage.user.avatar"
        [date]="initMessage.date"
        [messageContent]="messageTemplate"
      >
        <ng-template #messageTemplate>
          <pc-star-motivation subject="ChatGPT Extensions" i18n-subject></pc-star-motivation>
        </ng-template>
      </pc-chat-robot-message>
      <pc-chat-robot-message
        *ngFor="let msg of messages"
        [message]="msg.text"
        [reply]="msg.reply"
        [sender]="msg.user.name"
        [avatar]="msg.user.avatar"
        [date]="msg.date"
      ></pc-chat-robot-message>
      <pc-chat-robot-form
        (send)="sendMessage($event)"
        [loading]="loading"
        placeholder="Send message to AI"
        i18n-placeholder
      ></pc-chat-robot-form>
    </pc-chat-robot>
  `,
  styleUrls: ['./chatgpt-robot.component.scss']
})
export class ChatgptRobotComponent implements OnInit {
  title = $localize`ChatGPT Robot`;
  loading = false;
  initMessage = {
    date: new Date(),
    reply: true,
    type: 'init',
    user: {
      name: 'Postcat',
      avatar: './assets/images/logo.svg'
    }
  };
  powerBy = {
    title: 'APISPace',
    link: 'https://www.apispace.com?utm_source=postcat&utm_medium=robot&utm_term=chatgptturbo'
  };
  messages: messageItem[] = [];
  constructor(
    private http: HttpClient,
    public chat: ChatRobotService,
    public feature: FeatureControlService,
    private message: MessageService
  ) {}
  ngOnInit() {
    setTimeout(() => {
      this.watchExtensionChange();
    }, 5 * 1000);
  }
  sendChatGPTMessage($event) {
    this.loading = true;
    this.http
      .post(`${APP_CONFIG.EXTENSION_URL}/chatGPT`, {
        message: this.messages.map(val => {
          if (val.reply) {
            return `assistant: ${val.text}`;
          }
          return `user: ${val.text}`;
        })
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (!res?.result) {
            this.messages.push({
              text: `ChatGPT Error:${res?.msg}`,
              date: new Date(),
              reply: true,
              type: 'text',
              user: {
                name: 'ChatGPT',
                avatar: 'https://data-apibee.apispace.com/license/167773762614902e10710-8d88-4d7e-b962-2df477b361ec'
              }
            });
            return;
          }
          this.messages.push({
            text: res.result,
            date: new Date(),
            reply: true,
            type: 'text',
            user: {
              name: 'ChatGPT',
              avatar: 'https://data-apibee.apispace.com/license/167773762614902e10710-8d88-4d7e-b962-2df477b361ec'
            }
          });
        },
        error: e => {
          this.loading = false;
          this.messages.push({
            text: 'ChatGPT Error',
            date: new Date(),
            reply: true,
            type: 'text',
            user: {
              name: 'ChatGPT',
              avatar: 'https://data-apibee.apispace.com/license/167773762614902e10710-8d88-4d7e-b962-2df477b361ec'
            }
          });
        }
      });
  }
  sendMessage($event) {
    this.messages.push({
      text: $event.message,
      date: new Date(),
      reply: false,
      type: 'text',
      user: {
        name: $localize`Visitor`,
        avatar: 'https://data.eolink.com/PXMbLGmc2f0b29596764f7456eefb75478ed77b4fd172d9'
      }
    });
    this.sendChatGPTMessage($event);
  }
  watchExtensionChange() {
    this.message.get().subscribe((inArg: Message) => {
      if (inArg.type !== 'extensionsChange') return;
      const extension: ExtensionInfo = inArg.data.extension;
      if (!extension?.features?.featureControl?.length) return;
      switch (inArg.data.action) {
        case 'install':
        case 'enable': {
          this.chat.open();
          break;
        }
      }
    });
  }
}
