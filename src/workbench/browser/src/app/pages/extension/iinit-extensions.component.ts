import { Component, OnInit } from '@angular/core';
import { SocketService } from 'eo/workbench/browser/src/app/pages/extension/socket.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';

@Component({
  selector: 'eo-extensions',
  template: `<span></span>`
})
export class ExtensionsComponent implements OnInit {
  constructor(public message: MessageService, private socket: SocketService) {}
  async ngOnInit(): Promise<void> {
    // * 通过 socketIO 告知 Node 端，建立 grpc 连接
    await this.socket.socket2Node();
    window.eo.gRPC = {
      send: params =>
        new Promise(resolve => {
          const subscription = this.message.get().subscribe(({ type, data }) => {
            if (type === 'msg-grpc-back') {
              // data: [res, err]
              subscription.unsubscribe();
              resolve(data);
              return;
            }
          });
          this.message.send({ type: 'msg-grpc', data: params });
        })
    };
  }
}
