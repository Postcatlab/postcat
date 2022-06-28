import { DATA_DIR as dataDir } from 'eo/shared/common/constant';
import { ConfigurationInterface, ConfigurationValueInterface } from '../types';
import * as path from 'path';
import { fileExists, readJson, writeJson } from 'eo/shared/node/file';

export class Configuration implements ConfigurationInterface {
  /**
   * 配置文件地址
   */
  private readonly configPath: string;

  constructor() {
    this.configPath = path.join(dataDir, 'config.json');
    this.checkConfig();
  }

  /**
   * 检查配置文件，不存在创建
   */
  private checkConfig() {
    if (!fileExists(this.configPath)) {
      this.saveConfig({ settings: {} });
    }
  }

  /**
   * 读取配置文件
   */
  private loadConfig(): ConfigurationValueInterface {
    const data = readJson(this.configPath) || { settings: {} };
    return data;
  }

  /**
   * 保存配置文件
   */
  private saveConfig(data: ConfigurationValueInterface): boolean {
    return writeJson(this.configPath, data, true);
  }

  /**
   * 保存全局配置
   */
  saveSettings({ settings = {} }): boolean {
    console.log('settings', settings);
    let data = this.loadConfig();
    data.settings = settings;
    return this.saveConfig(data);
  }

  /**
   * 保存模块配置
   * @param moduleID
   * @param settings
   */
  saveModuleSettings(moduleID: string, settings: ConfigurationValueInterface): boolean {
    let data = this.loadConfig();
    data.settings ??= {};
    data.settings[moduleID] = settings;
    return this.saveConfig(data);
  }

  /**
   * 删除模块配置
   * @param moduleID
   * @returns
   */
  deleteModuleSettings(moduleID: string): boolean {
    let data = this.loadConfig();
    if (data.settings && data.settings[moduleID]) {
      delete data.settings[moduleID];
      return this.saveConfig(data);
    }
    return false;
  }

  /**
   * 获取全局配置
   * @returns
   */
  getSettings(): ConfigurationValueInterface {
    const data = this.loadConfig();
    return data;
  }

  /**
   * 获取模块配置, 以小数点分割的属性链，如：common.app.update
   * @param section
   * @returns
   */
  getModuleSettings<T = any>(section?: string): T {
    return this.getConfiguration(section);
  }

  /**
   * 根据key路径获取对应的配置的值
   *
   * @param key
   * @returns
   */
  getConfiguration = (keyPath: string) => {
    const localSettings = this.getSettings()?.settings || {};

    if (Reflect.has(localSettings, keyPath)) {
      return Reflect.get(localSettings, keyPath);
    }

    const keys = Object.keys(localSettings);
    const filterKeys = keys.filter((n) => n.startsWith(keyPath));
    if (filterKeys.length) {
      return filterKeys.reduce((pb, ck) => {
        const keyArr = ck.replace(`${keyPath}.`, '').split('.');
        const targetKey = keyArr.pop();
        const target = keyArr.reduce((p, v) => {
          p[v] ??= {};
          return p[v];
        }, pb);
        target[targetKey] = localSettings[ck];
        return pb;
      }, {});
    }
    return undefined;
  };
}

export default () => new Configuration();
