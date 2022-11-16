import { Component, OnInit } from '@angular/core';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { SocketService } from 'eo/workbench/browser/src/app/shared/services/socket.service';
import { resolve } from 'path';

@Component({
  selector: 'eo-extensions',
  template: `
    <!-- <micro-app [attr.name]="'Hello'" [attr.url]="'http://localhost:4009'" default-page="/"></micro-app> -->
  `,
})
export class ExtensionsComponent implements OnInit {
  constructor(public message: MessageService, private socket: SocketService) {}
  async ngOnInit(): Promise<void> {
    this.socket.socket2Node();
    const self = this;
    window.eo.gRPC = {
      send: (params) =>
        new Promise((resolve) => {
          console.log('send msg-grpc');
          self.message.get().subscribe(({ type, data }) => {
            if (type === 'msg-grpc-back') {
              console.log('msg-grpc-back near');
              resolve([data, null]);
              return;
            }
          });
          self.message.send({ type: 'msg-grpc', data: params });
        }),
    };
  }
}
