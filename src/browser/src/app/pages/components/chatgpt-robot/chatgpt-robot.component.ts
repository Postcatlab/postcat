import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EoNgButtonModule } from 'eo-ng-button';
import { FeatureControlService } from 'pc/browser/src/app/core/services/feature-control/feature-control.service';
import { Message, MessageService } from 'pc/browser/src/app/services/message';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { ExtensionInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import { ChatRobotModule } from '../../../components/chat-robot/chat-robot.module';
import { ChatRobotService } from '../../../components/chat-robot/chat-robot.service';
import { StarMotivationComponent } from '../../../components/star-motivation/star-motivation.component';

type messageItem = {
  text?: string;
  date: Date;
  reply: boolean;
  content?: TemplateRef<any>;
  type: string;
  user: {
    name: string;
    avatar: string;
  };
};

@Component({
  selector: 'pc-chatgpt-robot',
  standalone: true,
  imports: [StarMotivationComponent, CommonModule, EoNgButtonModule, ChatRobotModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%) translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translatY(0) translateX(0)' }))
      ]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%) translateY(100%)' }))])
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
        [messageContent]="msg.content"
        [sender]="msg.user.name"
        [avatar]="msg.user.avatar"
        [date]="msg.date"
      ></pc-chat-robot-message>
      <ng-template #moreTwice i18n>
        You have reached the maximum usage of ChatGPT for today. Please
        <button eo-ng-button class="mb-[2px]" nzType="primary" (click)="login()" nzSize="small">Sign in</button> to your Github account to
        Star/Fork to get more times.
      </ng-template>
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
  MAX_LIMIT = 5;
  nowUsage = StorageUtil.get('cr_usage');
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
    title: 'APISpace',
    link: 'https://www.apispace.com?utm_source=postcat&utm_medium=robot&utm_term=chatgptturbo'
  };
  messages: messageItem[] = [];
  @ViewChild('moreTwice') moreTwiceTmp: TemplateRef<any>;
  constructor(
    private http: HttpClient,
    public chat: ChatRobotService,
    public feature: FeatureControlService,
    private message: MessageService,
    private trace: TraceService,
    private store: StoreService
  ) {}
  ngOnInit() {
    this.watchExtensionChange();
  }
  login() {
    window.open(APP_CONFIG.GITHUB_REPO_URL, '_blank');
    this.trace.report('jump_to_github', {
      where_jump_to_github: 'chatGPT_extension'
    });
    setTimeout(() => {
      this.nowUsage = 0;
      StorageUtil.set('cr_usage', this.nowUsage);
    }, 5000);
  }
  sendChatGPTMessage($event) {
    this.loading = true;
    this.trace.report('send_chatGPT');
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
              text: `ChatGPT Error: ${res?.error || res?.msg || 'unknown error'}`,
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
          this.nowUsage++;
          StorageUtil.set('cr_usage', this.nowUsage, 24 * 60 * 60);
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
        name: this.store.getUserProfile?.email || $localize`Visitor`,
        avatar: 'https://data.eolink.com/PXMbLGmc2f0b29596764f7456eefb75478ed77b4fd172d9'
      }
    });
    if (this.nowUsage >= this.MAX_LIMIT) {
      this.messages.push({
        content: this.moreTwiceTmp,
        date: new Date(),
        reply: true,
        type: 'text',
        user: {
          name: 'Postcat',
          avatar: './assets/images/logo.svg'
        }
      });
      return;
    }
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
