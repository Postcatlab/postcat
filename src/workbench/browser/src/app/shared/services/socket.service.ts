import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket;
  constructor(private message: MessageService, private electron: ElectronService) {}
  async connectSocket() {
    // * 通过 SocketIO 通知后端
    try {
      const port = await window.eo?.getWebsocketPort();
      this.socket = io(
        `${
          APP_CONFIG.production && !this.electron.isElectron
            ? APP_CONFIG.REMOTE_SOCKET_URL
            : `ws://localhost:${port || 13928}`
        }`,
        { path: '/socket.io', transports: ['websocket'] }
      );
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
        this.socket.on('grpc-client', (response) => {
          this.message.send({ type: 'msg-grpc-back', data: response });
        });
        this.socket.emit('grpc-server', data);
      }
    });
  }
}
