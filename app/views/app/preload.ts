const { ipcRenderer } = require('electron');
console.log('eoapi public api load');
// 可以加上条件判断，根据不同模块id哪些允许放出
const apiAccessRules = ipcRenderer.sendSync('eo-sync', {action: 'getApiAccessRules'}) || [];
// 其他子应用可访问的api队列都集中到.eo上
window.eo = {
  name: 'Eoapi public api',
  version: '1.0.0'
};
// 边栏显示
window.eo.slidePosition = ipcRenderer.sendSync('eo-sync', {action: 'getSlidePosition'}) || 'left';
// 获取模块列表
if (apiAccessRules.includes('getModules')) {
  window.eo.getModules = () => {
    return ipcRenderer.sendSync('eo-sync', {action: 'getModules'});
  };
}
// 获取App应用列表
if (apiAccessRules.includes('getAppModuleList')) {
  window.eo.getAppModuleList = () => {
    return ipcRenderer.sendSync('eo-sync', { action: 'getAppModuleList' });
  };
}
// 获取边栏应用列表
if (apiAccessRules.includes('getSlideModuleList')) {
  window.eo.getSlideModuleList = () => {
    return ipcRenderer.sendSync('eo-sync', { action: 'getSlideModuleList' });
  };
}
// Hook请求返回
if (apiAccessRules.includes('hook')) {
  window.eo.hook = (data) => {
    return ipcRenderer.sendSync('eo-sync', { action: 'hook', data: data });
  };
}
// 临时测试用
window.eo.tempApi = (params) => {
  return ipcRenderer.sendSync('eo-sync', params);
};
