import { ipcRenderer } from 'electron';
//import { StorageHandleArgs, StorageProcessType } from '../../shared/browser/IndexedDB/types';

ipcRenderer.on('connect-main',(event,msg)=>{
  console.log(event,msg)
})

window['eo'] = {
  toogleViewZIndex(visible) {
    ipcRenderer.send('message', {
      action: 'connect-dropdown',
      data: {
        action: visible ? 'show' : 'hide',
      },
    });
  },
  getModules() {
    return ipcRenderer.sendSync('eo-sync', { action: 'getModules' });
  },
  openApp(inputArg){
    return ipcRenderer.sendSync('eo-sync', { action: 'openApp',data:inputArg });
  },
};
