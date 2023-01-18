import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { autorun, reaction } from 'mobx';

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
    private remote: RemoteService
  ) {
    this.init();
  }

  async init() {
    // * update title
    document.title = this.store.getCurrentWorkspace?.title ? `Postcat - ${this.store.getCurrentWorkspace?.title}` : 'Postcat';
    this.updateProjects(this.store.getCurrentWorkspaceUuid).then(() => {
      if (this.store.getProjectList.length === 0) {
        this.router.navigate(['/home/workspace/overview']);
      }
      this.getProjectPermission();
      this.getWorkspacePermission();
    });
    autorun(async () => {
      if (this.store.isLogin) {
        await this.updateWorkspaces();
        return;
      }
      if (this.store.isLocal) {
        this.store.setWorkspaceList([]);
        return;
      }
      this.switchWorkspace(this.store.getLocalWorkspace.workSpaceUuid);
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
  async switchWorkspace(workspaceID: string) {
    const workspace = this.store.getWorkspaceList.find(it => it.workSpaceUuid === workspaceID);
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
    debugger;
    this.store.setCurrentProjectID(pid);
    await this.router.navigate(['**']);
    this.router.navigate(['/home/workspace/project/api'], { queryParams: { pid: this.store.getCurrentProjectID } });
    // * update project role
    const { permissions, roles } = await this.getProjectPermission();
    this.store.setPermission(permissions, 'project');
    this.store.setRole(roles, 'project');
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
      if (val.uuid === project.uuid) {
        Object.assign(val, project);
        return true;
      }
    });
    this.store.setProjectList(projects);
    this.store.setCurrentProjectID(project.uuid);
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
    if (err) {
      return;
    }
    this.store.setEnvList(envList || []);
    return envList;
  }

  // *** Data engine

  async deleteHistory() {
    const [, err] = await this.api.api_apiTestHistoryDelete({});
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
    // TODO add history
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
    return res;
  }

  async getHistoryList() {
    const [res, err] = await this.api.api_apiTestHistoryList({ page: 1, pageSize: 1000 });
    if (err) {
      return;
    }
    this.store.setHistory(res?.items);
  }

  async getGroupList(params = {}) {
    // * get group list data
    const [groupList = [], gErr] = await this.api.api_groupList({});
    if (gErr) {
      return;
    }
    // console.log('Group 数据', groupList);
    // * get api list data
    const [apiListRes, aErr] = await this.api.api_apiDataList(params);
    if (aErr) {
      return;
    }
    const { items, paginator } = apiListRes;

    items.forEach(item => {
      // TODO 抹平后端字段差异
      item.responseParams ??= item.responseParam;
    });
    // console.log('API 数据', items);
    const rootGroupIndex = groupList.findIndex(n => n.depth === 0);
    this.store.setRootGroup(groupList.splice(rootGroupIndex, 1).at(0));
    // * set api & group list
    this.store.setGroupList(groupList);
    this.store.setApiList(items);
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
