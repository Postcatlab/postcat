import http from 'axios';
import { isNotEmpty } from 'eo/shared/common/common';
import { HOME_DIR, MODULE_DIR as baseDir } from 'eo/shared/electron-main/constant';
import {
  ModuleHandlerResult,
  ModuleInfo,
  ModuleManagerInfo,
  SidebarView,
  FeatureInfo
} from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { createServer } from 'http-server/lib/http-server';
import portfinder from 'portfinder';

import { ELETRON_APP_CONFIG } from '../../../../environment';
import { ModuleHandler } from './handler';

import { promises, readFileSync } from 'fs';
import { lstat } from 'fs/promises';
import path from 'node:path';

const extServerMap = new Map<string, SidebarView>();

// * npm pkg name
const defaultExtension = [{ name: 'postcat-export-openapi' }, { name: 'postcat-import-openapi' }];
const isExists = async filePath =>
  await promises
    .access(filePath)
    .then(() => true)
    .catch(_ => false);
export class ModuleManager {
  /**
   * 模块管理器
   */
  private readonly moduleHandler: ModuleHandler;

  /**
   * extension list
   */
  private installExtension: ModuleManagerInfo[] = [];

  /**
   * 模块集合
   */
  private readonly modules: Map<string, ModuleInfo>;

  /**
   * 功能点集合
   */
  private readonly features: Map<string, Map<string, FeatureInfo>>;

  constructor() {
    this.moduleHandler = new ModuleHandler({ baseDir: baseDir });
    this.modules = new Map();
    this.features = new Map();
    this.init();
    this.updateAll();
  }

  async getRemoteExtension() {
    const { data } = await http.get(`${ELETRON_APP_CONFIG.EXTENSION_URL}/list`);
    return data.data.map(({ name, version }) => ({ name, version }));
  }

  async installExt({ name }) {
    const remoteExtension = await this.getRemoteExtension();
    return await this.install(remoteExtension.find(it => it.name === name));
  }

  /**
   * 安装模块，调用npm install | link
   *
   * @param module
   */
  async install(module: ModuleManagerInfo): Promise<ModuleHandlerResult> {
    const result = await this.moduleHandler.install([module], module?.isLocal || false);
    if (result.code === 0) {
      const moduleInfo: ModuleInfo = this.moduleHandler.info(module.name);
      this.set(moduleInfo);
    }
    return result;
  }

  /**
   * 删除模块，调用npm uninstall | unlink
   *
   * @param module
   */
  async uninstall(module: ModuleManagerInfo): Promise<ModuleHandlerResult> {
    const moduleInfo: ModuleInfo = this.moduleHandler.info(module.name);
    const result = await this.moduleHandler.uninstall([{ name: module.name }], module.isLocal || false);
    if (result.code === 0) {
      this.delete(moduleInfo);
      extServerMap.forEach(item => {
        if (item.extensionID === module.name) {
          extServerMap.delete(item.key);
        }
      });
    }
    return result;
  }

  async updateAll() {
    // * ModuleManager will be new only one while app run start, so it should be here upgrade & install extension
    // * Upgrade
    const list = Array.from(this.getModules().values()).map(val => ({ name: val.name, version: val.version }));
    // * get version in remote
    const remoteExtension = await this.getRemoteExtension();
    const isOK = await isExists(`${HOME_DIR}/debugger.json`);
    let debugExtension = [];
    if (isOK) {
      const debuggerExtension = readFileSync(`${HOME_DIR}/debugger.json`, 'utf-8');
      const { extensions } = JSON.parse(debuggerExtension);
      debugExtension = extensions;
    }
    const localExtensionName = [...new Set(list.map(it => it.name).concat(defaultExtension.map(it => it.name)))];
    this.installExtension = remoteExtension
      .filter(it => localExtensionName.includes(it.name))
      .filter(it => !debugExtension.includes(it.name));
    this.moduleHandler.update(this.installExtension);
    this.installExtension.forEach(it => {
      this.install(it);
    });
  }

  /**
   * 读取本地package.json更新模块信息
   *
   * @param module
   */
  refresh(module: ModuleManagerInfo): void {
    const moduleInfo: ModuleInfo = this.moduleHandler.info(module.name);
    this.set(moduleInfo);
  }
  /**
   * 读取本地package.json更新模块信息
   *
   * @param module
   */
  refreshAll(): void {
    const list = Array.from(this.getModules().values());
    list.forEach(module => {
      this.refresh(module);
    });
  }

  /**
   * 获取所有模块列表
   * belongs为true，返回关联子模块集合
   *
   * @param belongs
   */
  getModules(): Map<string, ModuleInfo> {
    return this.modules;
  }
  /**
   * Call extension method
   *
   * @param featureInfo
   * @param args
   * @returns
   */
  getExtensionPackage(featureInfo, args): Promise<any> {
    return new Promise(resolve => {
      const extension = this.modules.get(featureInfo.name);
      try {
        args = JSON.parse(args);
      } catch (e) {}
      const extensionPackage: any = require(extension.baseDir);
      resolve(JSON.stringify(extensionPackage[featureInfo.action](args)));
      return;
    });
  }
  /**
   * 获取某个模块信息
   * belongs为true，返回关联子模块集合
   *
   * @param belongs
   */
  getModule(id: string): ModuleInfo {
    return this.modules.get(id);
  }

  /**
   * 获取某个功能点的集合
   *
   * @param featureKey
   * @returns
   */
  getFeature(featureKey: string): Map<string, object> {
    return this.features.get(featureKey);
  }

  /**
   * 设置模块信息到模块列表
   *
   * @param moduleInfo
   */
  private set(moduleInfo: ModuleInfo) {
    // 避免重置
    this.modules.set(moduleInfo.name, moduleInfo);
    this.setFeatures(moduleInfo);
  }

  /**
   * 解析模块的功能点加入功能点集合
   *
   * @param moduleInfo
   */
  private setFeatures(moduleInfo: ModuleInfo) {
    if (moduleInfo.features && typeof moduleInfo.features === 'object' && isNotEmpty(moduleInfo.features)) {
      Object.entries(moduleInfo.features).forEach(([key, value]) => {
        if (!this.features.has(key)) {
          this.features.set(key, new Map());
        }
        this.features.get(key).set(moduleInfo.name, { extensionID: moduleInfo.name, ...value });
      });
    }
  }

  /**
   * 清除在模块列表中的信息
   *
   * @param moduleInfo
   */
  private delete(moduleInfo: ModuleInfo) {
    // 避免删除核心
    this.modules.delete(moduleInfo.name);
    this.deleteFeatures(moduleInfo);
  }

  /**
   * 清除功能点集合中的模块功能点
   *
   * @param moduleInfo
   */
  private deleteFeatures(moduleInfo: ModuleInfo) {
    if (moduleInfo.features && typeof moduleInfo.features === 'object' && isNotEmpty(moduleInfo.features)) {
      for (const key in moduleInfo.features) {
        if (this.features.has(key)) {
          this.features.get(key).delete(moduleInfo.name);
        }
      }
    }
  }

  /**
   * 加入模块管理
   *
   * @param moduleInfo
   */
  private setup(moduleInfo: ModuleInfo) {
    if (moduleInfo && isNotEmpty(moduleInfo.name)) {
      this.set(moduleInfo);
    }
  }

  /**
   * 读取本地package.json文件得到本地安装的模块列表，依次获取模块信息加入模块列表
   */
  private init() {
    const names: string[] = this.moduleHandler.list();
    names.forEach((name: string) => {
      // 这里要加上try catch，避免异常
      const moduleInfo: ModuleInfo = this.moduleHandler.info(name);
      this.setup(moduleInfo);
    });
  }

  getExtFeatures(extName: string): ModuleInfo['features'] {
    const extPath = this.moduleHandler.getModuleDir(extName);
    return require(path.join(extPath, 'package.json')).features;
  }

  async getExtPageInfo(extName: string, feature: SidebarView, key: string): Promise<SidebarView> {
    try {
      const extPath = this.moduleHandler.getModuleDir(extName);
      const stats = await lstat(extPath);
      // 是否为软连接，是则为本地开发，需要提供本地开发web服务地址
      if (stats.isSymbolicLink()) {
        // 如果用户传了debugUrl则使用用户自定义服务
        if (feature?.debugUrl) {
          return {
            ...feature,
            url: feature.debugUrl,
            extensionID: extName
          };
        }
      }
      // 生产环境需要提供 html 入口文件地址(features.sidebarView.main)
      if (feature?.url) {
        if (/http(s)?:\/\//.test(feature?.url)) {
          return {
            ...feature,
            key,
            extensionID: extName
          };
        }
        if (extServerMap.has(key)) {
          return extServerMap.get(key);
        }
        const port = await portfinder.getPortPromise();
        const pageDir = path.parse(path.join(extPath, feature?.url)).dir;
        console.log('extension pageDir', pageDir);
        const server = createServer({ root: pageDir });
        server.listen(port);
        const url = `http://127.0.0.1:${port}`;
        extServerMap.set(key, {
          ...feature,
          url,
          key,
          extensionID: extName
        });
        return extServerMap.get(key);
      }
      return Promise.reject('该插件package.json缺少sidebarView字段');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getExtTabs(extName: string): Promise<SidebarView[]> {
    try {
      const features = this.getExtFeatures(extName);
      const list = features.extensionTabView.map(item => {
        return this.getExtPageInfo(extName, item, `${extName}-extensionTabView-${item.name}`);
      });
      const result = await Promise.all(list);
      return result;
    } catch (error) {
      return [];
    }
  }

  async getSidebarView(extName: string): Promise<SidebarView> {
    try {
      const feature = this.getExtFeatures(extName);
      const sidebarView = await this.getExtPageInfo(extName, feature.sidebarView, `${extName}-sidebarView`);
      return sidebarView;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSidebarViews(): Promise<SidebarView[]> {
    const result = [];

    for (const [extName] of this.modules) {
      try {
        const sidebarView = await this.getSidebarView(extName);
        result.push(sidebarView);
      } catch (error) {}
    }
    return result;
  }
}
