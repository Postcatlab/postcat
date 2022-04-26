import { defineStore } from 'pinia';

const ignoreList = ['default'];

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useStore = defineStore({
  // id: 必须，在所有 Store 中唯一
  id: 'globalState',
  // state: 返回对象的函数
  state: () => {
    return {
      ignoreList,
      localModules: window.eo.getModules(),
      pluginList: [],
    };
  },
  // getter 第一个参数是 state，是当前的状态，也可以使用 this 获取状态
  // getter 中也可以访问其他的 getter，或者是其他的 Store
  getters: {
    // 通过 state 获取状态
    getPluginList: (state) => state.pluginList.filter((it) => !ignoreList.includes(it)),
    getLocalModules: (state) => state.localModules,
  },
  actions: {
    updatePluginList(list) {
      // 使用 this 直接修改
      this.pluginList = Array.from(list.keys()).filter((it) => it);
    },
    updateLocalModules(modules) {
      this.localModules = modules;
    },
  },
});
