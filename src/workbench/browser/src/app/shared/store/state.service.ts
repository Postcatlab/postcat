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

  // ? router
  @observable private url = '';

  // ? env
  @observable private envList = [];
  @observable private envUuid = StorageUtil.get('env:selected') || null;

  // ? share
  @observable private shareId = StorageUtil.get('shareId') || '';

  // ? workspace
  @observable private currentWorkspaceID = -1;
  //  Local workspace always keep in last
  @observable private workspaceList: API.Workspace[] = [
    {
      title: $localize`Local workspace`,
      id: -1,
    } as API.Workspace,
  ];

  // ? project
  @observable private currentProjectID = StorageUtil.get('currentProjectID', 1);

  // ? user && auth
  @observable private userProfile = StorageUtil.get('userProfile') || null;
  @observable.shallow private authEnum = {
    canEdit: false,
    canDelete: false,
    canCreate: false,
  };
  @observable.shallow private loginInfo = {
    accessToken: StorageUtil.get('accessToken') || null,
    refreshToken: StorageUtil.get('refreshToken') || null,
  };

  // ? UI
  @observable private rightBarStatus = false;

  // * computed data

  // ? env
  @computed get getCurrentEnv() {
    const [data] = this.envList.filter((it) => it.uuid === this.envUuid);
    return (
      data || {
        hostUri: '',
        parameters: [],
        frontURI: '',
        uuid: null,
      }
    );
  }
  @computed get getEnvList() {
    return this.envList;
  }
  @computed get getEnvUuid() {
    return this.envUuid;
  }

  // ? share
  @computed get isShare() {
    return this.url.includes('/home/share');
  }
  @computed get isLocal() {
    return !this.isShare && this.currentWorkspaceID === -1;
  }
  @computed get isRemote() {
    return this.isShare || this.setting.settings['eoapi-common.dataStorage'] === 'http';
  }
  @computed get getShareId() {
    return this.shareId;
  }

  // ? workspace
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

  // ? project
  @computed get getCurrentProjectID() {
    return this.currentProjectID;
  }

  // ? user && auth
  @computed get isLogin() {
    return !!this.userProfile?.username;
  }
  @computed get getUserProfile() {
    return this.userProfile;
  }
  @computed get getLoginInfo() {
    return this.loginInfo;
  }

  @computed get canEdit() {
    return this.authEnum.canEdit;
  }

  // ? UI
  @computed get isOpenRightBar() {
    return this.rightBarStatus;
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
  // ? router
  @action private routeListener = (event: NavigationEnd) => {
    this.url = event.urlAfterRedirects;
  };

  // ? env

  @action setEnvUuid(data) {
    this.envUuid = data;
    StorageUtil.set('env:selected', data);
  }

  @action setEnvList(data = []) {
    this.envList = data;
    const isHere = data.find((it) => it.uuid === this.envUuid);
    if (!isHere) {
      this.envUuid = null;
      //  for delete env
      StorageUtil.set('env:selected', null);
    }
  }

  // ? share
  @action setShareId(data = '') {
    this.shareId = data;
    StorageUtil.set('shareId', data);
  }

  // ? workspace
  @action setWorkspaceList(data: API.Workspace[] = []) {
    const local = this.workspaceList.at(-1);
    this.workspaceList = [...data.filter((it) => it.id !== -1).map((it) => ({ ...it, type: 'online' })), local];
    if (this.workspaceList.length === -1) {
      this.setCurrentWorkspace(local);
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

  // ? project
  @action setCurrentProjectID(projectID: number) {
    this.currentProjectID = projectID;
    StorageUtil.set('currentProjectID', projectID);
  }

  // ? user && auth
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

  @action setAuthEnum(data) {
    this.authEnum = Object.assign(this.authEnum, data);
  }

  // ? UI
  @action toggleRightBar(data = false) {
    this.rightBarStatus = data;
  }

  @action setDataSource() {
    if (!this.isLocal) {
      this.storage.toggleDataSource({ dataSourceType: 'http' });
      StorageUtil.set(IS_SHOW_DATA_SOURCE_TIP, 'false');
    } else {
      this.storage.toggleDataSource({ dataSourceType: 'local' });
      StorageUtil.set(IS_SHOW_DATA_SOURCE_TIP, 'true');
    }
  }
}
