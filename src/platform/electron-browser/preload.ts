import { I18N } from './i18n';
const { ipcRenderer } = require('electron');
// 正在安装中的插件任务列表
const installTask = new Map();
// 正在卸载中的插件任务列表
const uninstallTask = new Map();

// 异步防止返回处理覆盖
const storageCallback = new Map();
ipcRenderer.on('storageCallback', (event, result) => {
  if (storageCallback.has(result.callback) && typeof storageCallback.get(result.callback) === 'function') {
    try {
      storageCallback.get(result.callback)(result);
      storageCallback.delete(result.callback);
    } catch (e) {
      storageCallback.delete(result.callback);
    }
  }
});
// 已加载feature模块列表
const featureModules = new Map();
// 其他子应用可访问的api队列都集中到.eo上
window.eo = {
  name: 'Eoapi public api',
  version: '1.0.0',
  // 获取模块列表
  getModules() {
    return ipcRenderer.sendSync('eo-sync', { action: 'getModules' });
  },
  getModule (id) {
    return ipcRenderer.sendSync('eo-sync', { action: 'getModule', data: { id: id } });
  },
  getFeatures(){
    return ipcRenderer.sendSync('eo-sync', { action: 'getFeatures' });
  },
  getFeature(featureKey) {
    return ipcRenderer.sendSync('eo-sync', { action: 'getFeature', data: { featureKey: featureKey } });
  },
  loadFeatureModule(id){
    if (!featureModules.has(id)) {
      try {
        const module = window.eo.getModule(id);
        window.eo._currentExtensionID = id;
        const _module = require(module.baseDir);
        featureModules.set(id, _module);
      } catch (e) {
        console.log(e);
      }
    }
    return featureModules.get(id);
  },
};
// 卸载feature模块
window.eo.unloadFeatureModule = (id) => {
  featureModules.delete(id);
};

window.eo.getModules = () => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getModules' });
};
window.eo.installModule = (name, isLocal = false) => {
  installTask.set(name, []);
  const result = ipcRenderer.invoke('eo-sync', { action: 'installModule', data: { name, isLocal } });
  result
    .then(() => {
      const callbackTask = installTask.get(name);
      callbackTask.forEach((callback) =>
        callback({
          extName: name,
          type: 'install',
          status: 'success',
        })
      );
    })
    .catch(() => {
      const callbackTask = installTask.get(name);
      callbackTask.forEach((callback) =>
        callback({
          extName: name,
          type: 'install',
          status: 'error',
        })
      );
    })
    .finally(() => {
      installTask.delete(name);
    });
  return result;
};
window.eo.uninstallModule = (name, isLocal = false) => {
  uninstallTask.set(name, []);
  const result = ipcRenderer.invoke('eo-sync', { action: 'uninstallModule', data: { name, isLocal } });

  result
    .then(() => {
      const callbackTask = uninstallTask.get(name);
      callbackTask.forEach((callback) =>
        callback({
          extName: name,
          type: 'uninstall',
          status: 'success',
        })
      );
    })
    .catch(() => {
      const callbackTask = uninstallTask.get(name);
      callbackTask.forEach((callback) =>
        callback({
          extName: name,
          type: 'uninstall',
          status: 'error',
        })
      );
    })
    .finally(() => {
      uninstallTask.delete(name);
    });
  return result;
};
window.eo.getInstallTask = () => installTask;
window.eo.getUninstallTask = () => uninstallTask;
window.eo.getExtIsInTask = (name, callback) => {
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
};

window.eo.getExtensionPagePathByName = (extName: string) => {
  return ipcRenderer.invoke('eo-sync', { action: 'getExtensionPagePathByName', data: { extName } });
};

window.eo.saveSettings = (settings) => {
  // console.log('window.eo.saveSettings', settings);
  return ipcRenderer.sendSync('eo-sync', { action: 'saveSettings', data: { settings } });
};

window.eo.saveModuleSettings = (moduleID, settings) => {
  return ipcRenderer.sendSync('eo-sync', {
    action: 'saveModuleSettings',
    data: { moduleID: moduleID, settings: settings },
  });
};

window.eo.deleteModuleSettings = (moduleID) => {
  return ipcRenderer.sendSync('eo-sync', { action: 'deleteModuleSettings', data: { moduleID: moduleID } });
};

window.eo.getSettings = () => {
  try {
    return JSON.parse(localStorage.getItem('localSettings') || '{}');
  } catch (error) {
    return {};
  }
};
window.eo.i18n = new I18N();

window.eo.getExtensionSettings = (moduleID) => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getExtensionSettings', data: { moduleID: moduleID } });
};
// 注册单个mock路由
window.eo.registerMockRoute = ({ method, path, data }) => {
  return ipcRenderer.send('eo-sync', { action: 'registerMockRoute', data: { method, path, data } });
};

// 注销mock路由
window.eo.unRegisterMockRoute = ({ method, path }) => {
  return ipcRenderer.send('eo-sync', { action: 'unRegisterMockRoute', data: { method, path } });
};
// 获取mock服务地址
window.eo.getMockUrl = () => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getMockUrl' });
};

// 获取websocket服务端口
window.eo.getWebsocketPort = () => {
  return ipcRenderer.invoke('eo-sync', { action: 'getWebsocketPort' });
};

// 重置并初始化路由
window.eo.resetAndInitRoutes = () => {
  return ipcRenderer.sendSync('eo-sync', { action: 'resetAndInitRoutes' });
};
