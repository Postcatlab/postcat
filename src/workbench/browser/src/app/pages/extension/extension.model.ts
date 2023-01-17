import { ExtensionInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';

export enum ExtensionGroupType {
  all = 'all',
  official = 'official',
  installed = 'installed'
}

export interface EoExtensionInfo extends ExtensionInfo {
  installed?: boolean;
  changeLog?: string;
  bugs: {
    url: string;
  };
  [key: string]: any;
}
