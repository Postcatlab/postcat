/**
 * 配置管理
 */
export interface ConfigurationInterface {
  saveSettings: (settings: ConfigurationValueInterface) => boolean;
  saveModuleSettings: (moduleID: string, settings: ConfigurationValueInterface) => boolean;
  deleteModuleSettings: (moduleID: string) => boolean;
  getSettings: () => ConfigurationValueInterface;
  getModuleSettings: (moduleID: string) => ConfigurationValueInterface;
}

export interface ConfigurationValueInterface {
  [propName: string]: any;
}
