import { ModuleInfo } from "../../utils/module-loader";

export enum ExtensionGroupType {
  all = 'all',
  official = 'official',
  installed = 'installed',
}

export interface EoExtensionInfo extends ModuleInfo{
  installed?:boolean;
  bugs:{
    url:string
  };
}
