import { ModuleInfo } from 'eo/platform/node/extension-manager/types';

export enum ExtensionGroupType {
  all = 'all',
  official = 'official',
  installed = 'installed',
}

export interface EoExtensionInfo extends ModuleInfo {
  installed?: boolean;
  changeLog?: string;
  bugs: {
    url: string;
  };
  [key: string]: any;
}
