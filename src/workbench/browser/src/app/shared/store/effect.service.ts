import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { ApiBodyType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { reaction } from 'mobx';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  constructor(
    private storage: StorageService,
    private indexedDBStorage: IndexedDBStorage,
    private store: StoreService,
    private api: ApiService,
    private router: Router,
    private lang: LanguageService,
    private web: WebService
  ) {
    this.init();
  }

  async init() {
    await this.updateWorkspaces();
    // * update title
    document.title = this.store.getCurrentWorkspace?.title ? `Postcat - ${this.store.getCurrentWorkspace?.title}` : 'Postcat';
    this.updateProjects(this.store.getCurrentWorkspaceUuid).then(() => {
      if (this.store.getProjectList.length === 0) {
        this.router.navigate(['/home/workspace/overview']);
      }
      this.getProjectPermission();
      this.getWorkspacePermission();
    });
    reaction(
      () => this.store.isLogin,
      async () => {
        if (this.store.isLogin) {
          await this.updateWorkspaces();
        } else {
          if (this.store.isLocal) {
            this.store.setWorkspaceList([]);
          } else {
            this.changeWorkspace(this.store.getLocalWorkspace.workSpaceUuid);
          }
        }
      }
    );
  }

  getGroups(projectID = 1): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.storage.run('groupLoadAllByProjectID', [projectID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        }
      });
    });
  }

  async deleteEnv(id) {
    const [data, err] = await this.api.api_environmentDelete({ id });
    if (data) {
      const envList = this.store.getEnvList.filter(it => it.id !== id);
      this.store.setEnvList(envList);
    }
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
  async getWorkspacePermission() {
    // TODO localworkspace no need to set permission
    {
      // * update workspace auth
      const [data, err]: any = await this.api.api_workspaceRoles({});
      if (err) {
        return;
      }
      const { roles, permissions } = data;
      console.log('yyy', roles, permissions);
      this.store.setPermission(permissions, 'workspace');
      this.store.setRole(roles, 'workspace');
    }
  }
  async changeWorkspace(workspaceID: string) {
    // * real set workspace
    this.store.setCurrentWorkspaceUuid(workspaceID);
    // * real set workspace
    await this.updateProjects(workspaceID);
    await this.router.navigate(['**']);

    this.router.navigate(['/home/workspace/overview']);

    // * update title
    document.title = this.store.getCurrentWorkspace?.title ? `Postcat - ${this.store.getCurrentWorkspace?.title}` : 'Postcat';

    // * update workspace role
    this.getWorkspacePermission();
    this.getProjectPermission();
  }
  async getProjectPermission() {
    //TODO localworkspace no need to set permission
    // * update project auth
    // const [data, err]: any = await this.api.api_projectUserPermission({ projectID: this.store.getCurrentProjectID });
    // if (err) {
    //   return;
    // }
    // this.store.setPermission(data.permissions, 'project');
    // this.store.setRole(data.role.name, 'project');
  }
  async changeProject(pid) {
    if (!pid) {
      this.router.navigate(['/home/workspace/overview']);
      return;
    }
    this.store.setCurrentProjectID(pid);
    await this.router.navigate(['**']);
    this.router.navigate(['/home/workspace/project/api'], { queryParams: { pid: this.store.getCurrentProjectID } });
    // * update project role
    await this.getProjectPermission();
  }
  async updateWorkspaces() {
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
  async createProject(data) {
    await this.api.api_projectCreate({
      projectMsgs: [data]
    });
  }
  async updateProject(data) {
    const [project] = await this.api.api_projectUpdate(data);
    if (project) {
      const projects = this.store.getProjectList;
      projects.some(val => {
        if (val.uuid === project.uuid) {
          Object.assign(val, project);
          return true;
        }
      });
      this.store.setProjectList(projects);
      this.store.setCurrentProjectID(project.uuid);
    }
  }

  async updateShareLink(): Promise<string> {
    // * update share link
    const [res, err]: any = await this.api.api_shareCreateShare({});
    if (err) {
      return 'Error ... ';
    }
    const host = (this.store.remoteUrl || window.location.host)
      .replace(/:\/{2,}/g, ':::')
      .replace(/\/{2,}/g, '/')
      .replace(/:{3}/g, '://')
      .replace(/(\/$)/, '');
    const lang = !APP_CONFIG.production && this.web.isWeb ? '' : this.lang.langHash;
    return `${host}/${lang ? `${lang}/` : ''}home/share/http/test?shareId=${res.uniqueID}`;
  }

  async updateEnvList() {
    if (this.store.isShare) {
      this.api
        .api_shareDocGetEnv({
          uniqueID: this.store.getShareID
        })
        .then(([data, err]) => {
          if (err) {
            return [];
          }
          this.store.setEnvList(data);
          return data || [];
        });
      return;
    }
    const [envList, err] = await this.api.api_environmentList({});
    this.store.setEnvList(envList || []);
    return envList;
  }

  // *** Data engine

  async deleteHistory() {
    const [, err] = await this.api.api_apiTestHistoryDelete({});
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
    // * update API
  }

  async createApiTestHistory(params) {
    // TODO add history
    const [data] = await this.api.api_apiTestHistoryCreate(params);
    this.store.setHistory([...this.store.getTestHistory, ...data?.items]);
    return data;
  }

  createMock() {
    // * update API
  }

  async getHistory() {
    const [res, err] = await this.api.api_apiTestHistoryList({ page: 1, pageSize: 1 });
    console.log('res', res);
    if (err) {
      return;
    }
    this.store.setHistory(res.data?.items);
  }

  async getGroupList() {
    // * get group list data
    const [groupList = [], gErr] = await this.api.api_groupList({});
    if (gErr) {
      return;
    }
    // console.log('Group 数据', groupList);
    // * get api list data
    const [apiList, aErr] = await this.api.api_apiDataList({});
    if (aErr) {
      return;
    }
    // console.log('API 数据', apiList);
    const rootGroupIndex = groupList.findIndex(n => n.depth === 0);
    this.store.setRootGroup(groupList.splice(rootGroupIndex, 1).at(0));
    // * set api & group list
    this.store.setGroupList(groupList);
    this.store.setApiList(apiList);
  }
  updateMock() {
    // * update mock
  }
  async createGroup(group) {
    // * update group
    await this.api.api_groupCreate(group);
    this.getGroupList();
  }
  async updateGroup(group) {
    // * update group
    // * update api list
    await this.api.api_groupUpdate(group);
    this.getGroupList();
  }
  updateHistory() {}
}
