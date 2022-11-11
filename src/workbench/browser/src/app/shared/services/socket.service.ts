import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket;
  constructor(private message: MessageService) {
    // * 通过 SocketIO 通知后端
    try {
      // const port = await window.eo?.getWebsocketPort();
      this.socket = io(`ws://localhost:13928`, { path: '/socket.io', transports: ['websocket'] });
    } catch (e) {
      console.log('Connect not allow', e);
    }
  }
  socket2Node() {
    if (!this.socket) {
      return;
    }
    this.message.get().subscribe(({ type, data }) => {
      if (type === 'msg-grpc') {
        const {
          params,
          callback: { next },
        } = data;
        const res = JSON.stringify({
          params,
          callback: {
            next: next.toString(),
          },
        });
        console.log('get msg-grpc', res);
        this.socket.on('grpc-client', (response) => {
          console.log('grpc-client', response);
          this.message.send({ type: 'msg-grpc-back', data: JSON.parse(response) });
        });
        this.socket.emit('grpc-server', res);
      }
    });
  }
}
