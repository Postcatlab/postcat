import { Component, OnInit, Input } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { EoMessageService } from './eo-message.service';

type msgType = {
  content: string;
  icon: string;
  time: number;
  type: 'success' | 'error';
};

@Component({
  selector: 'eo-message',
  templateUrl: './eo-message.component.html',
  styleUrls: ['./eo-message.component.scss'],
})
export class EoMessageComponent implements OnInit {
  msgList: msgType[] = [];
  messageSubscription: Subscription;
  constructor(private eoMessage: EoMessageService) {}

  ngOnInit(): void {
    this.messageSubscription = this.eoMessage
      .onAlert()
      .pipe(distinct(({ content }) => content, interval(300)))
      .subscribe((alert: msgType) => {
        this.pushData(alert);
      });
  }
  pushData(data: msgType) {
    this.msgList.push(data);
    setTimeout(() => {
      this.msgList.splice(0, 1);
    }, data.time);
  }
}
