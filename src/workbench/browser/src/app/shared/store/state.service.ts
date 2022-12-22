import { Injectable } from '@angular/core';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { Project } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageUtil } from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { action, computed, makeObservable, reaction, observable, toJS } from 'mobx';
import { filter } from 'rxjs/operators';

import { eoDeepCopy } from '../../utils/index.utils';
const LOCAL_WORKSPACE = {
  title: $localize`Persional Workspace`,
  id: -1
} as API.Workspace;
/** is show switch success tips */
export const IS_SHOW_DATA_SOURCE_TIP = 'IS_SHOW_DATA_SOURCE_TIP';

@Injectable({
  providedIn: 'root'
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
  @observable private currentWorkspaceID = StorageUtil.get('currentWorkspaceID') || -1;
  @observable private currentWorkspace: API.Workspace = eoDeepCopy(LOCAL_WORKSPACE);
  //  Local workspace always keep in last
  @observable private workspaceList: API.Workspace[] = [eoDeepCopy(LOCAL_WORKSPACE)];

  // ? project
  @observable private projectList: Project[] = [];
  @observable private currentProjectID = StorageUtil.get('currentProjectID', 1);
  @observable private currentProject: Project = { name: '' };

  // ? user && auth
  @observable private userProfile = StorageUtil.get('userProfile') || null;
  @observable.shallow private authEnum = {
    canEdit: false,
    canDelete: false,
    canCreate: false
  };
  @observable.shallow private loginInfo = {
    accessToken: StorageUtil.get('accessToken') || null,
    refreshToken: StorageUtil.get('refreshToken') || null
  };

  // ? UI
  @observable private rightBarStatus = false;

  // * computed data

  // ? env
  @computed get getCurrentEnv() {
    const [data] = this.envList.filter(it => it.uuid === this.envUuid);
    return (
      data || {
        hostUri: '',
        parameters: [],
        frontURI: '',
        uuid: null
      }
    );
  }
  @computed get getEnvList() {
    return this.envList;
  }
  @computed get getEnvUuid() {
    return this.envUuid;
  }
  // ? data source
  @computed get isLocal() {
    return !this.isShare && this.currentWorkspaceID === -1;
  }
  @computed get mockUrl() {
    const mockUrl = window.electron?.getMockUrl?.();
    return this.isLocal ? mockUrl : `${mockUrl}/mock-${this.getCurrentProjectID}`;
  }
  @computed get isRemote() {
    return !this.isLocal;
  }
  // ? share
  @computed get isShare() {
    return this.url.includes('/home/share');
  }
  @computed get getShareID() {
    return this.shareId;
  }

  // ? workspace
  @computed get getWorkspaceList() {
    return this.workspaceList;
  }
  @computed get getCurrentWorkspaceID() {
    return this.currentWorkspaceID;
  }
  @computed get getCurrentWorkspace() {
    return this.currentWorkspace;
  }

  get getLocalWorkspace() {
    return eoDeepCopy(LOCAL_WORKSPACE);
  }

  // ? project
  @computed get getProjectList() {
    return this.projectList;
  }
  @computed get getCurrentProjectID() {
    return this.currentProjectID;
  }
  @computed get getCurrentProject() {
    return this.currentProject;
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

  // ? setting
  @computed get remoteUrl() {
    return this.setting.getConfiguration('backend.url');
  }

  // ? UI
  @computed get isOpenRightBar() {
    return this.rightBarStatus;
  }

  constructor(private setting: SettingService, private router: Router, private route: ActivatedRoute, private message: MessageService) {
    makeObservable(this); // don't forget to add this if the class has observable fields
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(this.routeListener);
    reaction(
      () => this.getCurrentWorkspace,
      ({ creatorID }: any) => {
        if (this.isLocal) {
          return;
        }
        this.authEnum.canEdit = creatorID === this.getUserProfile.id;
      }
    );
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
    const isHere = data.find(it => it.uuid === this.envUuid);
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
    const local = eoDeepCopy(LOCAL_WORKSPACE);
    this.workspaceList = [local, ...data.filter(it => it.id !== -1)];
    const workspace = this.workspaceList.find(val => val.id === this.currentWorkspaceID) || this.getLocalWorkspace;
    this.setCurrentWorkspaceID(workspace.id);
  }
  @action updateWorkspace(workspace) {
    const index = this.workspaceList.findIndex(val => val.id === workspace.id);
    this.workspaceList[index] = workspace;
    if (this.currentWorkspaceID === workspace.id) {
      this.currentWorkspace = workspace;
    }
  }
  @action setCurrentWorkspaceID(id: number) {
    this.currentWorkspaceID = id;
    this.currentWorkspace = this.workspaceList?.find(val => val.id === id);
    StorageUtil.set('currentWorkspaceID', this.currentWorkspaceID);
  }
  // ? project
  @action setProjectList(projects: Project[] = []) {
    this.projectList = projects;
    const uuid = projects.length ? this.projectList.find(val => val.uuid === this.currentProjectID)?.uuid || projects[0].uuid : -1;
    this.setCurrentProjectID(uuid);
  }
  @action setCurrentProjectID(projectID: number) {
    this.currentProjectID = projectID;
    this.currentProject = this.projectList?.find(val => val.uuid === projectID);
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
      StorageUtil.set(IS_SHOW_DATA_SOURCE_TIP, 'false');
    } else {
      StorageUtil.set(IS_SHOW_DATA_SOURCE_TIP, 'true');
    }
  }
}
