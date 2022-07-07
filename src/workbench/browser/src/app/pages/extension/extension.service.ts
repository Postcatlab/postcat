import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { lastValueFrom } from 'rxjs';
import { ModuleInfo } from '../../utils/module-loader';

@Injectable()
export class ExtensionService {
  ignoreList = ['default'];
  extensionIDs: Array<string> = [];
  HOST = '';
  localExtensions: Map<string, ModuleInfo>;
  constructor(private http: HttpClient, private electron: ElectronService) {
    this.localExtensions = this.getExtensions();
    this.extensionIDs = this.updateExtensionIDs();
    this.HOST = this.electron.isElectron
      ? 'http://106.12.149.147'
      : 'https://mockapi.eolink.com/ztBFKai20ee60c12871881565b5a6ddd718337df0e30979';
  }
  private getExtensions() {
    // Local extension
    return window.eo?.getModules() || new Map();
  }
  getInstalledList() {
    // Local extension exception for ignore list
    return Array.from(this.localExtensions.values()).filter((it) => this.extensionIDs.includes(it.moduleID));
  }
  public async requestList() {
    let result: any = await lastValueFrom(this.http.get(`${this.HOST}/list`));
    console.log(this.getInstalledList());
    result.data = [
      ...result.data,
      //local debug package
      ...this.getInstalledList().filter((val) => result.data.every((childVal) => childVal.name !== val.name)),
    ];
    console.log(result, result.data);
    return result;
  }
  async getDetail(id, name): Promise<any> {
    let result = {};
    if (this.localExtensions.has(id)) {
      Object.assign(result, this.localExtensions.get(id), { installed: true });
    }
    let { code, data }: any = await this.requestDetail(name);
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
      this.localExtensions = modules;
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
      this.localExtensions = modules;
      this.updateExtensionIDs();
      return true;
    }
    console.error(data);
    return false;
  }
  private async requestDetail(id) {
    return await lastValueFrom(this.http.get(`${this.HOST}/detail/${id}`)).catch(err=>[0,err]);
  }
  private updateExtensionIDs() {
    return Array.from(this.localExtensions.keys())
      .filter((it) => it)
      .filter((it) => !this.ignoreList.includes(it));
  }
}
