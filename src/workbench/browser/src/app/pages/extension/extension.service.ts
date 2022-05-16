import { Injectable } from '@angular/core';
import { ModuleInfo } from '../../utils/module-loader';
@Injectable()
export class ExtensionService {
  ignoreList = ['default'];
  pluginNames: Array<string> = [];
  localModules: Map<string, ModuleInfo>;
  constructor() {
    this.localModules = window.eo.getModules();
    this.pluginNames = Array.from(this.localModules.keys())
      .filter((it) => it)
      .filter((it) => !this.ignoreList.includes(it));
  }
}
