import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ModuleInfo } from '../../utils/module-loader';
import { EoExtensionInfo } from './extension.model';
@Injectable()
export class ExtensionService {
  ignoreList = ['default'];
  extensionIDs: Array<string> = [];
  localModules: Map<string, ModuleInfo>;
  constructor(private http: HttpClient) {
    this.getInstalledList();
  }
  getInstalledList() {
    this.localModules = window.eo.getModules();
    this.updateExtensionIDs();
  }
  public async requestList() {
    return await lastValueFrom(this.http.get('http://106.12.149.147:3333/list'));
  }
  async getDetail(id): Promise<any> {
    let result = {};
    if (this.localModules.has(id)) {
      Object.assign(result, this.localModules.get(id), { installed: true });
    }
    let { code, data }: any = await this.requestDetail(id);
    Object.assign(result, data);
    return result;
  }
  /**
   *  install extension by id
   * @param id
   * @returns if install success
   */
  install(id): boolean {
    console.log('Install module:', id);
    const { code, data, modules } = window.eo.installModule(id);
    if (code === 0) {
      this.localModules = modules;
      this.updateExtensionIDs();
      return true;
    }
    console.error(data);
    return false;
  }
  uninstall(id): boolean {
    console.log('Install module:', id);
    const { code, data, modules } = window.eo.uninstallModule(id);
    if (code === 0) {
      this.localModules = modules;
      this.updateExtensionIDs();
      return true;
    }
    console.error(data);
    return false;
  }
  private async requestDetail(id) {
    return await lastValueFrom(this.http.get(`http://106.12.149.147:3333/detail/${id}`));
  }
  private updateExtensionIDs() {
    this.extensionIDs = Array.from(this.localModules.keys())
      .filter((it) => it)
      .filter((it) => !this.ignoreList.includes(it));
  }
}
