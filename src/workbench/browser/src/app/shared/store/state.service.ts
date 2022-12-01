import { Injectable } from '@angular/core';
import { action, computed, makeObservable, reaction, observable } from 'mobx';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { SettingService } from 'eo/workbench/browser/src/app/modules/setting/settings.service';
import { StorageUtil } from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';

/** is show switch success tips */
export const IS_SHOW_DATA_SOURCE_TIP = 'IS_SHOW_DATA_SOURCE_TIP';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  // * observable data
  @observable url = '';
  @observable shareId = StorageUtil.get('shareId') || '';
  @observable userProfile = StorageUtil.get('userProfile') || null;
  // * Local workspace always keep in last
  @observable currentWorkspaceID = -1;
  @observable workspaceList: API.Workspace[] = [
    {
      title: $localize`Local workspace`,
      id: -1,
    } as API.Workspace,
  ];
  @observable.shallow env = {
    hostUri: '',
    parameters: [],
    frontURI: '',
  };

  @observable.shallow authEnum = {
    canEdit: false,
    canDelete: false,
    canCreate: false,
  };

  @observable.shallow loginInfo = {
    accessToken: StorageUtil.get('accessToken') || null,
    refreshToken: StorageUtil.get('refreshToken') || null,
  };

  // * computed data
  @computed get getEnv() {
    return this.env;
  }

  @computed get isLogin() {
    return !!this.userProfile?.username;
  }

  @computed get isShare() {
    return this.url.includes('/home/share');
  }

  @computed get isRemote() {
    return this.isShare || this.setting.settings['eoapi-common.dataStorage'] === 'http';
  }

  @computed get isLocal() {
    return !this.isShare && this.currentWorkspaceID === -1;
  }

  @computed get getWorkspaceList() {
    return this.workspaceList;
  }

  @computed get getLocalWorkspaceInfo() {
    // * The last data must be local workspace
    return this.workspaceList.at(-1);
  }

  @computed get getCurrentWorkspaceInfo() {
    const [workspace] = this.workspaceList.filter((it) => it.id === this.currentWorkspaceID);
    return workspace;
  }

  @computed get getUserProfile() {
    return this.userProfile;
  }

  @computed get getLoginInfo() {
    return this.loginInfo;
  }

  constructor(
    private setting: SettingService,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private message: MessageService
  ) {
    makeObservable(this); // don't forget to add this if the class has observable fields
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(this.routeListener);
  }

  // * actions
  @action setEnv(data) {
    this.env =
      data == null
        ? {
            hostUri: '',
            parameters: [],
            frontURI: '',
          }
        : data;
  }

  @action setShareId(data = '') {
    this.shareId = data;
    StorageUtil.set('shareId', data);
  }

  @action setUserProfile(data: API.User = null) {
    this.userProfile = data;
    StorageUtil.set('userProfile', data);
  }

  @action setLoginInfo(data = null) {
    this.loginInfo = data;
    StorageUtil.set('accessToken', data.accessToken);
    StorageUtil.set('refreshToken', data.refreshToken);
  }

  @action clearAuth() {
    this.setUserProfile(null);
    this.setLoginInfo({ accessToken: '', refreshToken: '' });
  }

  @action private routeListener = (event: NavigationEnd) => {
    this.url = event.urlAfterRedirects;
  };

  @action setWorkspaceList(data: API.Workspace[] = []) {
    const local = this.workspaceList.at(-1);
    this.workspaceList = [...data.map((it) => ({ ...it, type: 'online' })), local];
    if (this.workspaceList.length === -1) {
      this.setCurrentWorkspace(local);
    }
  }

  @action setAuthEnum(data) {
    this.authEnum = Object.assign(this.authEnum, data);
  }

  @action setDataSource() {
    if (!this.isLocal) {
      this.storage.toggleDataSource({ dataSourceType: 'http' });
      localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'false');
    } else {
      this.storage.toggleDataSource({ dataSourceType: 'local' });
      localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'true');
    }
  }

  @action async setCurrentWorkspace(workspace: API.Workspace) {
    this.currentWorkspaceID = workspace.id;
    StorageUtil.set('currentWorkspace', workspace);
    // refresh component
    await this.router.navigate(['**']);
    await this.router.navigate(['/home'], { queryParams: { spaceID: workspace.id } });

    this.message.send({ type: 'workspaceChange', data: true });
  }
}
