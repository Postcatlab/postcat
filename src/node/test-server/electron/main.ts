import { ipcMain } from 'electron';
import { UnitWorker } from 'pc/node/test-server/electron/unitWorker';
/**
 * Electron Test use Ipc to communicate
 */
export const UnitWorkerModule = {
  works: {},
  setup(pc: any) {
    ipcMain.removeAllListeners('unitTest');
    ipcMain.on('unitTest', function (event, message) {
      const id = message.id;
      switch (message.action) {
        case 'ajax': {
          UnitWorkerModule.works[id] = new UnitWorker(pc.view);
          UnitWorkerModule.works[id].start(message);
          break;
        }
        case 'abort': {
          if (UnitWorkerModule.works[id]) {
            UnitWorkerModule.works[id].kill();
          }
          break;
        }
      }
    });
  }
};
