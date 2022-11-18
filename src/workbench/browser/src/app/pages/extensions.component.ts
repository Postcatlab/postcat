import { Component, OnInit } from '@angular/core';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { SocketService } from 'eo/workbench/browser/src/app/shared/services/socket.service';

@Component({
  selector: 'eo-extensions',
  template: `<span></span>`,
})
export class ExtensionsComponent implements OnInit {
  constructor(public message: MessageService, private socket: SocketService) {}
  async ngOnInit(): Promise<void> {
    // * 通过 socketIO 告知 Node 端，建立 grpc 连接
    await this.socket.socket2Node();
    const self = this;
    window.eo.gRPC = {
      send: (params) =>
        new Promise((resolve) => {
          self.message.get().subscribe(({ type, data }) => {
            if (type === 'msg-grpc-back') {
              // data: [res, err]
              resolve(data);
              return;
            }
          });
          self.message.send({ type: 'msg-grpc', data: params });
        }),
    };
  }
}
