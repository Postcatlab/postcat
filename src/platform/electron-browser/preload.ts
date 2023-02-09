// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require('electron');
// 正在安装中的插件任务列表
const installTask = new Map();
// 正在卸载中的插件任务列表
const uninstallTask = new Map();

//TODO use contextBridge
//Because we need to access window.pc/window.eo API directly, the contextIsolation need to be set false
// contextBridge.exposeInMainWorld('electron',
window.electron = {
  ipcRenderer: {
    send: (msgID: string, msgObject) => ipcRenderer.send(msgID, msgObject),
    on: (msgID: string, callback) => ipcRenderer.on(msgID, callback),
    removeAllListeners: msgID => ipcRenderer.removeAllListeners(msgID)
  },
  loginWith(data) {
    return ipcRenderer.sendSync('eo-sync', { action: 'loginWith', data });
  },
  getSystemInfo() {
    return ipcRenderer.sendSync('get-system-info');
  },
  getInstalledExtensions() {
    return ipcRenderer.sendSync('eo-sync', { action: 'getModules' });
  },
  getMockUrl() {
    return ipcRenderer.sendSync('eo-sync', { action: 'getMockUrl' });
  },
  getExtensionsByFeature(featureKey) {
    return ipcRenderer.sendSync('eo-sync', { action: 'getFeature', data: { featureKey: featureKey } });
  },
  getWebsocketPort: () => {
    return ipcRenderer.invoke('eo-sync', { action: 'getWebsocketPort' });
  },
  getExtensionPackage(id) {
    //TODO nodeIntegration set false
    try {
      const module = ipcRenderer.sendSync('eo-sync', { action: 'getModule', data: { id } });
      return require(module.baseDir);
    } catch (e) {
      console.log(e);
    }
  },
  getInstallingExtension: (name, callback) => {
    if (installTask.has(name)) {
      const callbackTask = installTask.get(name);
      callback && callbackTask.push(callback);
      installTask.set(name, callbackTask);
      return true;
    }
    if (uninstallTask.has(name)) {
      const callbackTask = uninstallTask.get(name);
      callback && callbackTask.push(callback);
      uninstallTask.set(name, callbackTask);
      return true;
    }
    return false;
  },
  installExtension: (name, isLocal = false) => {
    installTask.set(name, []);
    const result = ipcRenderer.invoke('eo-sync', { action: 'installModule', data: { name, isLocal } });
    result
      .then(() => {
        const callbackTask = installTask.get(name);
        callbackTask.forEach(callback =>
          callback({
            extName: name,
            type: 'install',
            status: 'success'
          })
        );
      })
      .catch(() => {
        const callbackTask = installTask.get(name);
        callbackTask.forEach(callback =>
          callback({
            extName: name,
            type: 'install',
            status: 'error'
          })
        );
      })
      .finally(() => {
        installTask.delete(name);
      });
    return result;
  },
  uninstallExtension: (name, isLocal = false) => {
    uninstallTask.set(name, []);
    const result = ipcRenderer.invoke('eo-sync', { action: 'uninstallModule', data: { name, isLocal } });

    result
      .then(() => {
        const callbackTask = uninstallTask.get(name);
        callbackTask.forEach(callback =>
          callback({
            extName: name,
            type: 'uninstall',
            status: 'success'
          })
        );
      })
      .catch(() => {
        const callbackTask = uninstallTask.get(name);
        callbackTask.forEach(callback =>
          callback({
            extName: name,
            type: 'uninstall',
            status: 'error'
          })
        );
      })
      .finally(() => {
        uninstallTask.delete(name);
      });
    return result;
  },
  getSidebarView: (extName: string) => {
    return ipcRenderer.invoke('eo-sync', { action: 'getSidebarView', data: { extName } });
  },
  getSidebarViews: () => {
    return ipcRenderer.invoke('eo-sync', { action: 'getSidebarViews' });
  }
};
