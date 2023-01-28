import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { Group, Project } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { StorageUtil } from 'eo/workbench/browser/src/app/utils/storage/storage.utils';
import { genApiGroupTree } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import _ from 'lodash-es';
import { action, computed, makeObservable, observable, toJS } from 'mobx';
import { filter } from 'rxjs/operators';

import { JSONParse } from '../../utils/index.utils';

/** is show switch success tips */
export const IS_SHOW_DATA_SOURCE_TIP = 'IS_SHOW_DATA_SOURCE_TIP';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private localWorkspace: API.Workspace;
  // * observable data
  // ? api & group(includes api) & mock
  @observable.shallow private currentAPI = {};
  @observable.shallow private currentMock = {};
  @observable private apiList = [];

  // ? history
  @observable private testHistory = [];

  // ? router
  @observable private url = '';

  // ? env
  @observable private envList = [];
  @observable private envUuid = StorageUtil.get('env:selected') || null;

  // ? share
  @observable private shareId = StorageUtil.get('shareId') || '';

  // ? group
  @observable private rootGroup: Group;
  @observable private groupList: Group[] = [];

  // ? workspace
  @observable private currentWorkspace: Partial<API.Workspace> = StorageUtil.get('currentWorkspace') || {
    isLocal: true
  };
  //  Local workspace always keep in last
  @observable private workspaceList: API.Workspace[] = [];

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
  @observable private rightBarStatus = false;
  @observable.shallow private role = {
    workspace: [],
    project: []
  };

  // * computed data
  // ? api & group(includes api) & mock
  @computed get getCurrentAPI() {
    return this.currentAPI;
  }
  @computed get getCurrentMock() {
    return this.currentMock;
  }
  @computed get getTestHistory() {
    return toJS(this.testHistory).sort((a, b) => b.createTime - a.createTime);
  }
  @computed get getGroupTree() {
    return genApiGroupTree([this.rootGroup, ...this.groupList], [], this.getRootGroup?.parentId);
  }

  // ? router
  @computed get getUrl() {
    return this.url;
  }

  // ? env
  @computed get getCurrentEnv() {
    const [data] = this.envList.filter(it => it.id === this.envUuid);
    return (
      data || {
        hostUri: '',
        parameters: [],
        frontURI: '',
        id: null
      }
    );
  }
  @computed get getRootGroup() {
    return this.rootGroup;
  }
  @computed get getApiGroupTree() {
    return genApiGroupTree(this.groupList, this.apiList, this.getRootGroup?.id);
  }
  @computed get getApiList() {
    return this.apiList;
  }
  @computed get getEnvList() {
    return this.envList;
  }
  @computed get getEnvUuid() {
    return this.envUuid;
  }
  // ? data source
  @computed get isLocal() {
    return !this.isShare && this.currentWorkspace?.isLocal;
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
    return window.location.href.includes('/home/share');
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

  // ? UI
  @computed get isOpenRightBar() {
    return this.rightBarStatus;
  }

  constructor(private setting: SettingService, private router: Router) {
    makeObservable(this); // don't forget to add this if the class has observable fields
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(this.routeListener);
  }
  // * actions
  // ? history
  @action setHistory(data = []) {
    data.forEach(history => {
      history.request = JSONParse(history.request, {});
      history.response = JSONParse(history.response, {});
    });
    this.testHistory = data;
  }

  @action setLocalWorkspace(data) {
    this.localWorkspace = data;
  }
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
    this.envList = data.map(val => {
      val.parameters = JSONParse(val.parameters, []);
      return val;
    });
    const isHere = data.find(it => it.id === this.envUuid);
    if (!isHere) {
      this.envUuid = null;
      //  for delete env
      StorageUtil.set('env:selected', null);
    }
  }

  // ? group
  @action setRootGroup(group: Group) {
    this.rootGroup = group;
  }

  @action setApiList(list = []) {
    this.apiList = list;
  }

  @action setGroupList(list = []) {
    this.groupList = list;
  }

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
