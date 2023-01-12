import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { ProjectApiService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
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
    private apiService: ProjectApiService,
    private storage: StorageService,
    private indexedDBStorage: IndexedDBStorage,
    private store: StoreService,
    private api: ApiService,
    private message: MessageService,
    private router: Router,
    private lang: LanguageService,
    private web: WebService
  ) {
    queueMicrotask(async () => {
      await this.updateWorkspaces();
      // * update title
      document.title = `Postcat - ${this.store.getCurrentWorkspace.title}`;
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
    });
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

  deleteEnv(uuid) {
    this.storage.run('environmentRemove', [uuid], async (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        const envList = this.store.getEnvList.filter(it => it.uuid !== uuid);
        this.store.setEnvList(envList);
      }
    });
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

  async exportProjectData(projectID = 1) {
    const apiGroup = await this.getGroups(projectID);
    const result: StorageRes = await this.apiService.getAll(projectID);
    const { success, empty } = StorageResStatus;
    if ([success, empty].includes(result.status)) {
      return {
        collections: this.exportCollects(apiGroup, result.data),
        environments: []
      };
    }
    return {
      collections: [],
      environments: []
    };
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
      const [data, err]: any = await this.api.api_workspaceUnkown({ workspaceID: this.store.getCurrentWorkspaceUuid });
      if (err) {
        return;
      }
      this.store.setPermission(data.permissions, 'workspace');
      this.store.setRole(data.role.name, 'workspace');
    }
  }
  async changeWorkspace(workspaceID: string) {
    // * real set workspace
    this.store.setCurrentWorkspaceUuid(workspaceID);
    // * real set workspace
    await this.updateProjects(workspaceID);
    await this.router.navigate(['**']);
    // if (this.store.getProjectList.length === 1) {
    this.router.navigate(['/home/workspace/overview']);
    // } else {
    //   // * refresh view
    //   this.router.navigate(['/home/workspace/project/api'], { queryParams: { wid: this.store.getCurrentWorkspaceUuid } });
    // }
    // * update title
    document.title = `Postcat - ${this.store.getCurrentWorkspace.title}`;
    // * update workspace role
    this.getWorkspacePermission();
    this.getProjectPermission();
  }
  async getProjectPermission() {
    //TODO localworkspace no need to set permission
    // * update project auth
    const [data, err]: any = await this.api.api_projectUserPermission({ projectID: this.store.getCurrentProjectID });
    if (err) {
      return;
    }
    this.store.setPermission(data.permissions, 'project');
    this.store.setRole(data.role.name, 'project');
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
  async updateProjects(workspaceID) {
    return new Promise(resolve => {
      // * real set workspace
      this.storage.run('projectBulkLoad', [workspaceID], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          // * select first project automatic
          this.store.setProjectList(result.data);
          resolve([result.data, null]);
          return;
        }
        resolve([null, result.data]);
      });
    });
  }
  updateProject(data) {
    const workspace = this.store.getCurrentWorkspace;
    return new Promise(resolve => {
      this.storage.run('projectUpdate', [workspace.workSpaceUuid, data, data.uuid], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          const project = result.data;
          const projects = this.store.getProjectList;
          projects.some(val => {
            if (val.uuid === project.uuid) {
              Object.assign(val, project);
              return true;
            }
          });
          this.store.setProjectList(projects);
          this.store.setCurrentProjectID(project.uuid);
          resolve(true);
        }
      });
    });
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

  updateEnvList() {
    return new Promise(resolve => {
      if (this.store.isShare) {
        this.api
          .api_shareDocGetEnv({
            uniqueID: this.store.getShareID
          })
          .then(([data, err]) => {
            if (err) {
              return resolve([]);
            }
            this.store.setEnvList(data);
            return resolve(data || []);
          });
        return;
      }
      this.storage.run('environmentLoadAllByProjectID', [this.store.getCurrentProjectID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.store.setEnvList(result.data || []);
          return resolve(result.data || []);
        }
        return resolve([]);
      });
    });
  }

  // *** data engine

  // ? delete
  deleteHistory() {
    // TODO delete history with IO
    this.store.setHistory([]);
  }
  // * delete api
  async deleteAPI() {
    // * delete API
    // * update mock
  }
  // * delete group and api
  async deleteGroup(group) {
    // * delete group
    // * call deleteAPI()
  }
  async deleteMock() {
    // * delete mock
    // * update API
  }

  // ? create
  createHistory() {
    // TODO add history
    this.store.setHistory([]);
  }
  createGroup() {
    // * update group
  }
  createMock() {
    // * update API
  }

  // ? get
  private getHistory() {
    // TODO load history with IO
    this.store.setHistory([]);
  }
  getGroupList() {
    // * get group list data
    // * get api list data
    // * merge data
  }
  getAPI() {
    // * get API data
  }

  // ? update
  updateAPI() {
    // * update api
    // * update api list (for group)
    // * update mock
  }
  updateMock() {
    // * update mock
  }
  updateGroup() {
    // * update group
    // * update api list
  }
}
