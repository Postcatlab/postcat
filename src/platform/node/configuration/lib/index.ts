import { DATA_DIR as dataDir } from '../../../../shared/common/constant';
import { ConfigurationInterface, ConfigurationValueInterface } from '../types';
import * as path from 'path';
import { fileExists, readJson, writeJson } from '../../../../shared/node/file';

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
    return writeJson(this.configPath, data);
  }

  /**
   * 保存全局配置
   */
  saveSettings(settings: ConfigurationValueInterface): boolean {
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
    if (!data.settings) {
      data.settings = {};
    }
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
      delete(data.settings[moduleID]);
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
    return data.settings;
  }

  /**
   * 获取模块配置
   * @param moduleID 
   * @returns 
   */
  getModuleSettings(moduleID: string): ConfigurationValueInterface {
    const settings = this.getSettings();
    return settings[moduleID] || {}; 
  } 
  
}

export default () => new Configuration();
