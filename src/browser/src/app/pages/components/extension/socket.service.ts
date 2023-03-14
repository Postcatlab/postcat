import { Injectable } from '@angular/core';
import { ElectronService } from 'pc/browser/src/app/core/services';
import { MessageService } from 'pc/browser/src/app/services/message';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  constructor(private message: MessageService, private electron: ElectronService) {}
  async connectSocket() {
    // * 通过 SocketIO 通知后端
    try {
      let url = '';
      if (!APP_CONFIG.production || this.electron.isElectron) {
        const port = this.electron.isElectron ? await window.electron?.getWebsocketPort?.() : 13928;
        url = `ws://localhost:${port}`;
      } else {
        url = APP_CONFIG.REMOTE_SOCKET_URL;
      }
      this.socket = io(url, { path: '/socket.io', transports: ['websocket'], reconnectionAttempts: 2 });
    } catch (e) {
      console.log('Connect not allow', e);
    }
  }
  async socket2Node() {
    await this.connectSocket();
    if (!this.socket) {
      return;
    }
    this.message.get().subscribe(({ type, data }) => {
      if (type === 'msg-grpc') {
        this.socket.on('grpc-client', response => {
          this.message.send({ type: 'msg-grpc-back', data: response });
        });
        this.socket.emit('grpc-server', data);
      }
    });
  }
}
