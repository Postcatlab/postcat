import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import _ from 'lodash-es';
import { action, autorun, computed, makeObservable, observable } from 'mobx';
import { SettingService } from 'pc/browser/src/app/components/system-setting/settings.service';
import { Project } from 'pc/browser/src/app/services/storage/db/models';
import { StorageUtil } from 'pc/browser/src/app/shared/utils/storage/storage.utils';
import { filter } from 'rxjs/operators';

import { Role } from '../shared/models/member.model';

/** is show switch success tips */
export const IS_SHOW_DATA_SOURCE_TIP = 'IS_SHOW_DATA_SOURCE_TIP';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private localWorkspace: API.Workspace;
  // * observable data

  //* Has been initialized
  private appHasInitial = StorageUtil.get('appHasInitial') || false;

  // ? router
  @observable private url = '';
  @observable private pageLevel = 'project';
  // ? share
  @observable private shareId = StorageUtil.get('shareId') || '';

  // ? workspace
  @observable private currentWorkspace: Partial<API.Workspace> = StorageUtil.get('currentWorkspace') || {
    isLocal: true
  };
  //  Local workspace always keep in last
  @observable private workspaceList: API.Workspace[] = [];

  @observable private syncSettingList = [];

  // ? project
  @observable private projectList: Project[] = [];
  @observable private currentProjectID = StorageUtil.get('currentProjectID', 1);
  @observable private currentProject: Project = null;
  @observable private roleList = {
    workspace: [],
    project: []
  };

  // ? user && auth
  @observable private userProfile = StorageUtil.get('userProfile') || null;

  @observable.shallow private loginInfo = {
    accessToken: StorageUtil.get('accessToken') || null,
    refreshToken: StorageUtil.get('refreshToken') || null
  };

  @observable.shallow private permissions = {
    workspace: {
      /** workspace */
      UPDATE_WORKSPACE: false,
      DELETE_WORKSPACE: false,
      VIEW_WORKSPACE: false,
      ADD_WORKSPACE_MEMBER: false,
      UPDATE_WORKSPACE_MEMBER: false,
      DELETE_WORKSPACE_MEMBER: false
    },
    project: {
      /** project */
      VIEW_PROJECT_LIST: false,
      VIEW_PROJECT: false,
      UPDATE_PROJECT: false,
      DELETE_PROJECT: false,
      IMPORT_PROJECT: false,
      EXPORT_PROJECT: false,
      ADD_PROJECT_MEMBER: false,
      UPDATE_PROJECT_MEMBER: false,
      DELETE_PROJECT_MEMBER: false
    }
  };

  // ? UI
  @observable.shallow private role: {
    workspace: Role[];
    project: Role[];
  } = {
    workspace: [],
    project: []
  };

  // ? router
  @computed get getUrl() {
    return this.url;
  }

  @computed get getPageLevel() {
    return this.pageLevel;
  }
  @computed get getAppHasInitial() {
    return this.appHasInitial;
  }
  // ? data source
  @computed get isClientFirst() {
    const isClientFist = !this.appHasInitial && !!window.electron;
    return isClientFist;
  }
  @computed get isLocal() {
    return !this.isShare && this.currentWorkspace?.isLocal;
  }
  @computed get mockUrl() {
    return window.electron?.getMockUrl?.();
    // const mockUrl = window.electron?.getMockUrl?.();
    // return this.isLocal ? mockUrl : `${mockUrl}/mock-${this.getCurrentProjectID}`;
  }
  @computed get isRemote() {
    return !this.isLocal;
  }
  // ? share
  @computed get isShare() {
    return window.location.href.includes('/share');
  }
  @computed get getShareID() {
    return this.shareId;
  }

  // ? workspace
  @computed get getWorkspaceList() {
    return this.workspaceList;
  }
  @computed get getCurrentWorkspaceUuid() {
    return this.currentWorkspace?.workSpaceUuid;
  }
  @computed get getCurrentWorkspace() {
    return this.currentWorkspace;
  }
  @computed get getWorkspaceRoleList() {
    return this.roleList.workspace;
  }

  get getLocalWorkspace() {
    return this.localWorkspace;
  }
  // ? project
  @computed get getProjectList() {
    return this.projectList;
  }
  @computed get getSyncSettingList() {
    return this.syncSettingList;
  }
  @computed get getCurrentProjectID() {
    return this.currentProjectID;
  }
  @computed get getCurrentProject() {
    return this.currentProject;
  }
  @computed get getProjectRoleList() {
    return this.roleList.project;
  }

  // ? user && auth
  @computed get isLogin() {
    return this.userProfile?.id;
  }
  @computed get getUserProfile() {
    return this.userProfile;
  }
  @computed get getLoginInfo() {
    return this.loginInfo;
  }

  @computed get getWorkspacePermissions() {
    return this.permissions.workspace;
  }

  @computed get getProjectPermissions() {
    return this.permissions.project;
  }

  @computed get getWorkspaceRole() {
    return this.role.workspace;
  }

  @computed get getProjectRole() {
    return this.role.project;
  }

  // ? setting
  @computed get remoteUrl() {
    return this.setting.getConfiguration('backend.url');
  }

  constructor(private setting: SettingService, private router: Router) {
    makeObservable(this); // don't forget to add this if the class has observable fields
    this.router.events
      .pipe(
        filter(event => {
          if (event instanceof NavigationError) {
            console.error('NavigationError', event);
          }
          return event instanceof NavigationEnd;
        })
      )
      .subscribe(this.routeListener);
    autorun(() => {
      if (this.url) {
        this.setPageLevel();
      }
    });

    window.addEventListener('beforeunload', e => {
      this.setAppHasInitial();
    });
  }

  /**
   * @description Set has been initialized
   */
  @action setAppHasInitial() {
    StorageUtil.set('appHasInitial', true);
  }

  @action setLocalWorkspace(data) {
    this.localWorkspace = data;
  }
  // ? router
  @action private routeListener = (event: NavigationEnd) => {
    this.url = event.urlAfterRedirects;
  };
  // ? share
  @action setShareId(data = '') {
    this.shareId = data;
    StorageUtil.set('shareId', data);
  }
  // ? workspace
  @action setWorkspaceList(data: API.Workspace[] = []) {
    this.workspaceList = [...data];
    if (this.localWorkspace) {
      this.workspaceList.unshift(this.localWorkspace);
    }
  }
  @action updateWorkspace(workspace: API.Workspace) {
    const index = this.workspaceList.findIndex(val => val.workSpaceUuid === workspace.workSpaceUuid);
    this.workspaceList[index] = workspace;
    if (this.getCurrentWorkspaceUuid === workspace.workSpaceUuid) {
      this.setCurrentWorkspace(workspace);
    }
  }
  @action setCurrentWorkspace(workspace) {
    workspace = this.workspaceList?.find(val => val?.workSpaceUuid === workspace?.workSpaceUuid) || this.getLocalWorkspace;
    if (!workspace) {
      pcConsole.error("setCurrentWorkspace: workspace can't not be null");
      return;
    }
    this.currentWorkspace = workspace;
    StorageUtil.set('currentWorkspace', workspace);
  }

  @action setSyncSettingList(data) {
    this.syncSettingList = data;
  }

  // ? project
  @action setProjectList(projects: Project[] = []) {
    this.projectList = projects;
    const uuid = this.projectList.find(val => val.projectUuid === this.currentProjectID)?.projectUuid || projects[0]?.projectUuid;
    uuid && this.setCurrentProjectID(uuid);
  }
  @action setCurrentProjectID(projectUuid: string) {
    this.currentProjectID = projectUuid;
    this.currentProject = this.projectList?.find(val => val?.projectUuid === projectUuid);
    StorageUtil.set('currentProjectID', projectUuid);
  }
  // ? user && auth
  @action setUserProfile(data: API.User = null) {
    this.userProfile = data;
    StorageUtil.set('userProfile', data);
  }

  @action setLoginInfo(data = { jwt: '', rjwt: '' }) {
    this.loginInfo = { accessToken: data.jwt, refreshToken: data.rjwt };
    StorageUtil.set('accessToken', data.jwt);
    StorageUtil.set('refreshToken', data.rjwt);
  }

  @action clearAuth() {
    this.setUserProfile({
      id: 0,
      password: '',
      userName: '',
      userNickName: ''
    });
    this.setLoginInfo();
  }

  @action setRoleList(data, type) {
    this.roleList[type] = data;
  }

  @action setRole(role, type) {
    // if (this.isLocal) {
    //   this.role[type] = { name: 'Workspace Owner' };
    //   return;
    // }
    this.role[type] = role;
  }

  @action setPermission(permissionsList, type) {
    // TODO rename to setPermission
    if (this.isLocal) {
      // * set all false
      Object.keys(this.permissions[type]).forEach(it => {
        this.permissions[type][it] = true;
      });
      return;
    }
    // * set all false
    Object.keys(this.permissions[type]).forEach(it => {
      this.permissions[type][it] = false;
    });
    // console.log('check permission', { ...this.permissions[type] }, permissionsList);
    // * set some true
    permissionsList?.forEach(it => {
      const name = _.upperCase(it).split(' ').join('_');
      // console.log('name', name);
      this.permissions[type][name] = true;
    });
    // console.log(this.permissions[type]);
  }

  @action setDataSource() {
    if (!this.isLocal) {
      StorageUtil.set(IS_SHOW_DATA_SOURCE_TIP, 'false');
    } else {
      StorageUtil.set(IS_SHOW_DATA_SOURCE_TIP, 'true');
    }
  }
  @action setPageLevel() {
    if (['/home/workspace/overview'].some(val => this.router.url.includes(val))) {
      this.pageLevel = 'workspace';
    } else {
      this.pageLevel = 'project';
    }
  }
}
