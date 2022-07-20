import { ipcMain } from 'electron';
import { UnitWorker } from 'eo/workbench/node/electron/unitWorker';
/**
 * Electron Test use Ipc to communicate
 */
export const UnitWorkerModule = {
  works: {},
  setup(eo: any) {
    ipcMain.removeAllListeners('unitTest');
    ipcMain.on('unitTest', function (event, message) {
      const id = message.id;
      switch (message.action) {
        case 'ajax': {
          UnitWorkerModule.works[id] = new UnitWorker(eo.view);
          UnitWorkerModule.works[id].start(message);
          break;
        }
        case 'abort': {
          UnitWorkerModule.works[id].kill();
          break;
        }
      }
    });
  },
};


