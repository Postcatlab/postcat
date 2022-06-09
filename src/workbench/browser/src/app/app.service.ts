import { Injectable } from '@angular/core';
import type { IpcRenderer } from 'electron';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from './shared/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private ipcRenderer: IpcRenderer = window.require?.('electron')?.ipcRenderer;

  constructor(private storageService: StorageService) {
    if (this.ipcRenderer) {
      this.ipcRenderer.on('getMockApiList', (event, message = {}) => {
        // console.log('接收到了哇', event, message);
        const { mockID } = message;
        if (Number.isInteger(Number(mockID))) {
          this.storageService.run('mockLoad', [Number(mockID)], (res: StorageRes) => {
            if (res.status === StorageResStatus.success) {
              event.sender.send('getMockApiList', res.data);
            } else {
              event.sender.send('getMockApiList', res.data);
            }
          });
        }
      });
    }
  }
}
