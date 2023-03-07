import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ChatRobotModule } from '../../../modules/chat-robot/chat-robot.module';
import { ChatRobotService } from '../../../modules/chat-robot/chat-robot.service';
import { StarMotivationComponent } from '../../../modules/star-motivation/star-motivation.component';
import { TraceService } from '../../../shared/services/trace.service';

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
  template: `
    <pc-chat-robot *ngIf="chat.isShow" [powerBy]="powerBy" [title]="title">
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
      <pc-chat-robot-form (send)="sendMessage($event)"></pc-chat-robot-form>
    </pc-chat-robot>
  `,
  styleUrls: ['./chatgpt-robot.component.scss']
})
export class ChatgptRobotComponent implements OnInit {
  title = $localize`ChatGPT Robot`;
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
  constructor(private http: HttpClient, public chat: ChatRobotService) {}
  ngOnInit() {
    this.messages.push(
      {
        text: 'test im user',
        date: new Date(),
        reply: false,
        type: 'text',
        user: {
          name: 'Visitor',
          avatar: 'https://data.eolink.com/PXMbLGmc2f0b29596764f7456eefb75478ed77b4fd172d9'
        }
      },
      {
        text: `I'm sorry, I cannot respond to this as it is not a coherent sentence or request. Please provide a valid question or statement.`,
        date: new Date(),
        reply: true,
        type: 'text',
        user: {
          name: 'ChatGPT',
          avatar: 'https://data-apibee.apispace.com/license/167773762614902e10710-8d88-4d7e-b962-2df477b361ec'
        }
      }
    );
  }
  sendChatGPTMessage($event) {
    this.http
      .post(
        'https://eolink.o.apispace.com/chatgpt-turbo/create',
        {},
        {
          headers: {
            'Authorization-Type': 'apikey',
            'X-APISpace-Token': ''
          }
        }
      )
      .subscribe((res: any) => {
        console.log(res);
      });
  }
  sendMessage($event) {
    this.messages.push({
      text: $event.message,
      date: new Date(),
      reply: false,
      type: 'text',
      user: {
        name: 'Visitor',
        avatar: 'https://data.eolink.com/PXMbLGmc2f0b29596764f7456eefb75478ed77b4fd172d9'
      }
    });
  }
}
