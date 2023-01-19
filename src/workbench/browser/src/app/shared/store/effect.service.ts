import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { autorun, toJS } from 'mobx';

import { JSONParse } from '../../utils/index.utils';
import { db } from '../services/storage/db';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  constructor(
    private indexedDBStorage: IndexedDBStorage,
    private store: StoreService,
    private api: ApiService,
    private router: Router,
    private lang: LanguageService,
    private web: WebService,
    private route: ActivatedRoute
  ) {
    // * update title
    document.title = this.store.getCurrentWorkspace?.title ? `Postcat - ${this.store.getCurrentWorkspace?.title}` : 'Postcat';
    if (this.store.isShare) return;
    this.init();
  }
  async init() {
    const result = await db.workspace.read();
    this.store.setLocalWorkspace(result.data as API.Workspace);
    const isUserFirstUse = !this.store.getCurrentWorkspaceUuid;

    //User first use postcat,select localwork space
    if (isUserFirstUse) {
      this.switchWorkspace(this.store.getLocalWorkspace.workSpaceUuid);
    }
    //Init workspace
    autorun(async () => {
      if (this.store.isLogin) {
        //* Get workspace list
        await this.updateWorkspaceList();
        this.fixedID();
        return;
      }
      if (this.store.isLocal) {
        this.store.setWorkspaceList([]);
        this.fixedID();
        return;
      }
      this.switchWorkspace(this.store.getLocalWorkspace.workSpaceUuid);
    });
    // * Init project
    this.updateProjects(this.store.getCurrentWorkspaceUuid).then(() => {
      // Use first user postcat,auto into Default project
      if (isUserFirstUse) {
        this.switchProject(this.store.getProjectList[0].projectUuid);
        return;
      }
      if (this.store.getProjectList.length === 0) {
        this.router.navigate(['/home/workspace/overview']);
      }
      // * Fixed projectID
      const { pid } = this.route.snapshot.queryParams;
      if (this.store.getCurrentProjectID !== pid && pid) {
        this.switchProject(pid);
        return;
      }
    });

    // * Fetch role list
    const workspaceRoleList = await this.getRoleList(1);
    this.store.setRoleList(workspaceRoleList, 'workspace');
    const projectRoleList = await this.getRoleList(2);
    this.store.setRoleList(projectRoleList, 'project');
  }
  /**
   * Fixed workspaceID and projectID
   * Jump to the exist workspace and project
   */
  private fixedID() {
    const { pid, wid } = this.route.snapshot.queryParams;
    const isWorkspaceExist = this.store.getWorkspaceList.some(it => it.workSpaceUuid === wid);

    if (this.store.getCurrentWorkspaceUuid === wid && isWorkspaceExist) return;

    this.switchWorkspace(wid);
    this.store.setCurrentProjectID(pid);
  }
  async getRoleList(type) {
    const [data, err] = await this.api.api_roleList({ roleModule: type });
    if (err) {
      return;
    }
    return data;
  }

  async deleteEnv(id) {
    const [, err] = await this.api.api_environmentDelete({ id });
    if (err) {
      return;
    }
    const envList = this.store.getEnvList.filter(it => it.id !== id);
    this.store.setEnvList(envList);
  }
  async exportLocalProjectData(projectID = 1) {
    return new Promise(resolve => {
      this.indexedDBStorage.projectExport(projectID).subscribe((result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          resolve(false);
        }
      });
    });
  }

  exportCollects(apiGroup: any[], apiData: any[], parentID = 0) {
    const apiGroupFilters = apiGroup.filter(child => child.parentID === parentID);
    const apiDataFilters = apiData.filter(child => child.groupID === parentID);
    return apiGroupFilters
      .map(item => ({
        name: item.name,
        children: this.exportCollects(apiGroup, apiData, item.uuid)
      }))
      .concat(apiDataFilters);
  }
  async switchWorkspace(workspaceID: string) {
    const workspace = this.store.getWorkspaceList.find(it => it.workSpaceUuid === workspaceID) || this.store.getLocalWorkspace;
    this.store.setCurrentWorkspace(workspace);

    // * real set workspace
    await this.router.navigate(['**']);

    this.router.navigate(['/home/workspace/overview']);
    // * update title
    document.title = this.store.getCurrentWorkspace?.title ? `Postcat - ${this.store.getCurrentWorkspace?.title}` : 'Postcat';

    // * update workspace role
    const { roles, permissions } = await this.getWorkspacePermission();
    this.store.setPermission(permissions, 'workspace');
    this.store.setRole(roles, 'workspace');
  }
  async getWorkspacePermission() {
    // * local workspace no need to set permission
    if (this.store.isLocal) {
      return;
    }
    // * update workspace auth
    const [data, err]: any = await this.api.api_workspaceRoles({});
    if (err) {
      return;
    }
    return data;
  }
  async getProjectPermission() {
    // * localworkspace no need to set permission
    if (this.store.isLocal) {
      return;
    }
    // * update project auth
    const [data, err]: any = await this.api.api_projectGetRole({});
    if (err) {
      return;
    }
    return data.at(0);
  }

  async switchProject(pid) {
    if (!pid) {
      this.router.navigate(['/home/workspace/overview']);
      return;
    }
    this.store.setCurrentProjectID(pid);
    await this.router.navigate(['**']);
    this.router.navigate(['/home/workspace/project/api'], { queryParams: { pid: this.store.getCurrentProjectID } });
    // * update project role
    const { permissions, roles } = await this.getProjectPermission();
    this.store.setPermission(permissions, 'project');
    this.store.setRole(roles, 'project');
  }
  async updateWorkspaceList() {
    const [list, wErr]: any = await this.api.api_workspaceList({});
    if (wErr) {
      // * Switch store to local workspace
      this.store.setWorkspaceList([]);
      this.updateProjects(this.store.getCurrentWorkspaceUuid);
      return;
    }
    this.store.setWorkspaceList(list);
  }
  async updateProjects(workSpaceUuid) {
    const [data] = await this.api.api_projectDetail({ projectUuids: [], workSpaceUuid });
    if (data) {
      this.store.setProjectList(data.items);
      return [data.items, null];
    } else {
      return [null, data];
    }
  }
  async createProject(msg) {
    const [, err] = await this.api.api_projectCreate({
      projectMsgs: [msg]
    });
    if (err) {
      return;
    }
  }
  async updateProject(data) {
    const [project, err] = await this.api.api_projectUpdate({ ...data, description: 'description' });
    if (err) {
      return;
    }
    const projects = this.store.getProjectList;
    projects.some(val => {
      if (val.projectUuid === project.projectUuid) {
        Object.assign(val, project);
        return true;
      }
    });
    this.store.setProjectList(projects);
    this.store.setCurrentProjectID(project.projectUuid);
  }

  async updateShareLink() {
    // * update share link
    const [data, err]: any = await this.api.api_shareCreateShare({});
    if (err) {
      return 'Error ... ';
    }
    const host = (this.store.remoteUrl || window.location.host)
      .replace(/:\/{2,}/g, ':::')
      .replace(/\/{2,}/g, '/')
      .replace(/:{3}/g, '://')
      .replace(/(\/$)/, '');
    const lang = !APP_CONFIG.production && this.web.isWeb ? '' : this.lang.langHash;
    return `${host}/${lang ? `${lang}/` : ''}home/share/http/test?shareId=${data.sharedUuid}`;
  }

  async updateEnvList() {
    if (this.store.isShare) {
      const [data, err] = await this.api.api_shareDocGetEnv({
        sharedUuid: this.store.getShareID
      });
      if (err) {
        return [];
      }
      this.store.setEnvList(data || []);
      return data || [];
    }
    const [envList, err] = await this.api.api_environmentList({});
    if (err) {
      return;
    }
    this.store.setEnvList(envList || []);
    return envList;
  }

  // *** Data engine

  async deleteHistory() {
    const [, err] = await this.api.api_apiTestHistoryDelete({
      ids: this.store.getTestHistory.map(it => it.id)
    });
    if (err) {
      return;
    }
    this.store.setHistory([]);
  }
  // * delete group and api
  async deleteGroup(group) {
    // * delete group
    await this.api.api_groupDelete(group);
    this.getGroupList();
    // * call deleteAPI()
  }
  async deleteMock(id) {
    // * delete mock
    const [, err] = await this.api.api_mockDelete({
      id: id
    });
    if (err) {
      return;
    }
    // * update API
  }

  async createApiTestHistory(params) {
    const [data] = await this.api.api_apiTestHistoryCreate(params);
    this.store.setHistory([...this.store.getTestHistory, data]);
    return data;
  }

  createMock() {
    // * update API
  }

  async getHistory(id) {
    const [res, err] = await this.api.api_apiTestHistoryDetail({ id: Number(id) });
    if (err) {
      return;
    }
    res.request = JSONParse(res.request);
    res.response = JSONParse(res.response);
    return res;
  }

  async getHistoryList() {
    const [res, err] = await this.api.api_apiTestHistoryList({ page: 1, pageSize: 200 });
    if (err) {
      return;
    }
    this.store.setHistory(res?.items);
  }

  async getGroupList(params = {}) {
    // * get group list data
    const [groupList = [], gErr] = await (this.store.isShare ? this.api.api_groupList({}) : this.api.api_groupList({}));
    if (gErr) {
      return;
    }
    const rootGroup = groupList.at(0);
    this.store.setRootGroup(rootGroup);

    // console.log('Group 数据', structuredClone(groupList));
    // * get api list data
    const [apiListRes, aErr] = await (this.store.isShare
      ? this.api.api_apiDataList({ ...params, statuses: 0 })
      : this.api.api_apiDataList({ ...params, statuses: 0, order: 'order_num', sort: 'DESC' }));
    if (aErr) {
      return;
    }
    const { items, paginator } = apiListRes;
    // console.log('API 数据', items);
    // * set api & group list
    this.store.setGroupList(rootGroup.children);
    Reflect.deleteProperty(rootGroup, 'children');
    this.store.setApiList(items);
  }
  updateMock() {
    // * update mock
  }
  async createGroup(groups: any[] = []) {
    // * update group
    await this.api.api_groupCreate(
      groups.map(n => ({
        ...n,
        projectUuid: this.store.getCurrentProjectID,
        workSpaceUuid: this.store.getCurrentWorkspaceUuid
      }))
    );
    this.getGroupList();
  }
  async updateGroup(group) {
    // * update group
    // * update api list
    await this.api.api_groupUpdate(group);
    this.getGroupList();
  }
  updateHistory() {}

  projectImport() {}

  async projectExport() {
    const data = await db.project.exports({
      projectUuid: this.store.getCurrentProjectID,
      workSpaceUuid: this.store.getCurrentWorkspaceUuid
    });
    console.log('data', data);
  }
}
