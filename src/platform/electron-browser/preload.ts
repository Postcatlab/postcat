const { ipcRenderer } = require('electron');
console.log('eoapi public api load');
// 可以加上条件判断，根据不同模块id哪些允许放出
const apiAccessRules = ipcRenderer.sendSync('eo-sync', { action: 'getApiAccessRules' }) || [];

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
};
// 边栏显示
// window.eo.sidePosition = ipcRenderer.sendSync('eo-sync', { action: 'getSidePosition' }) || 'left';
// 获取模块列表
window.eo.getModules = () => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getModules' });
};
// 获取某个模块
window.eo.getModule = (moduleID) => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getModule', data: { moduleID: moduleID } });
};
// 获取App应用列表
window.eo.getAppModuleList = () => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getAppModuleList' });
};
// 获取边栏应用列表
window.eo.getSideModuleList = () => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getSideModuleList' });
};
// 获取所有功能点列表
window.eo.getFeatures = () => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getFeatures' });
};
// 获取某个功能点
window.eo.getFeature = (featureKey) => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getFeature', data: { featureKey: featureKey } });
};
// 加载feature模块
window.eo.loadFeatureModule = (moduleID) => {
  if (!featureModules.has(moduleID)) {
    try {
      const module = window.eo.getModule(moduleID);
      const _module = window.require(module.baseDir);
      featureModules.set(moduleID, _module);
    } catch (e) {
      console.log(e);
    }
  }
  return featureModules.get(moduleID);
};
// 卸载feature模块
window.eo.unloadFeatureModule = (moduleID) => {
  featureModules.delete(moduleID);
};
// Hook请求返回
if (apiAccessRules.includes('hook')) {
  window.eo.hook = (data) => {
    return ipcRenderer.sendSync('eo-sync', { action: 'hook', data });
  };
}
// 临时测试用
window.eo.tempApi = (params) => {
  return ipcRenderer.sendSync('eo-sync', params);
};
window.eo.openModal = (background) => {
  background = background || '#00000073';
  return ipcRenderer.sendSync('eo-sync', { action: 'openModal', data: { background: background } });
};
window.eo.closeModal = () => {
  return ipcRenderer.sendSync('eo-sync', { action: 'closeModal' });
};
window.eo.toogleViewZIndex = (visible) => {
  ipcRenderer.send('message', {
    action: 'connect-dropdown',
    data: {
      action: visible ? 'show' : 'hide',
    },
  });
};
window.eo.autoResize = (sideWidth) => {
  ipcRenderer.send('eo-sync', { action: 'autoResize', data: { sideWidth: sideWidth } });
};
window.eo.getModules = () => {
  return ipcRenderer.sendSync('eo-sync', { action: 'getModules' });
};
window.eo.installModule = (name, isLocal = false) => {
  return ipcRenderer.sendSync('eo-sync', { action: 'installModule', data: { name, isLocal } });
};
window.eo.uninstallModule = (name, isLocal = false) => {
  return ipcRenderer.sendSync('eo-sync', { action: 'uninstallModule', data: { name, isLocal } });
};
window.eo.openApp = (inputArg) => {
  return ipcRenderer.sendSync('eo-sync', { action: 'openApp', data: inputArg });
};
window.eo.storage = (args, callback: any) => {
  const key = `${args.action}_${Date.now()}`;
  storageCallback.set(key, callback);
  args.type = 'default';
  args.callback = key;
  ipcRenderer.send('eo-storage', args);
};
window.eo.storageSync = (args) => {
  console.log('run preload storageSync');
  args.type = 'sync';
  return ipcRenderer.sendSync('eo-storage', args);
};
window.eo.storageRemote = (args) => {
  console.log('run preload storageRemote');
  args.type = 'remote';
  const shareObject = window.require('@electron/remote').getGlobal('shareObject');
  shareObject.storageResult = null;
  ipcRenderer.send('eo-storage', args);
  let output: any = shareObject.storageResult;
  let count: number = 0;
  while (output === null) {
    if (count > 1500) {
      output = {
        status: 'error',
        data: 'storage remote load error',
      };
      break;
    }
    output = shareObject.storageResult;
    ++count;
  }
  shareObject.storageResult = null;
  return output;
};
