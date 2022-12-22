import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { ProjectApiService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
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
    private http: RemoteService,
    private message: MessageService,
    private router: Router,
    private lang: LanguageService,
    private web: WebService
  ) {
    this.updateWorkspaces();
    this.updateProjects(this.store.getCurrentWorkspaceID).then(() => {
      if (this.store.getProjectList.length === 0) {
        this.router.navigate(['/home/workspace/project/list']);
      }
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
            this.changeWorkspace(this.store.getLocalWorkspace.id);
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
      const apiGroupObservable = this.indexedDBStorage.groupLoadAllByProjectID(projectID);
      apiGroupObservable.subscribe(({ data: apiGroup }: any) => {
        const apiDataObservable = this.indexedDBStorage.apiDataLoadAllByProjectID(projectID);
        apiDataObservable.subscribe(({ data: apiData }: any) => {
          const envObservable = this.indexedDBStorage.environmentLoadAllByProjectID(projectID);
          envObservable.subscribe(({ data: environments }: any) => {
            resolve({
              collections: this.exportCollects(apiGroup, apiData),
              environments
            });
          });
        });
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
  async changeWorkspace(workspaceID: number = -1) {
    // * real set workspace
    this.store.setCurrentWorkspaceID(workspaceID);
    this.message.send({ type: 'workspaceChange', data: true });
    // * real set workspace
    await this.updateProjects(workspaceID);
    await this.router.navigate(['**']);
    if (this.store.getProjectList.length === 0) {
      this.router.navigate(['/home/workspace/project/list']);
    } else {
      // * refresh view
      this.router.navigate(['/home/workspace/project/api'], { queryParams: { spaceID: this.store.getCurrentWorkspaceID } });
    }
  }
  async updateWorkspaces() {
    const [list, wErr]: any = await this.http.api_workspaceList({});
    if (wErr) {
      if (wErr.status === 401) {
        this.message.send({ type: 'clear-user', data: {} });
        if (this.store.isLogin) {
          return;
        }
        this.message.send({ type: 'http-401', data: {} });
      }
      //* Switch store to local workspace
      this.store.setWorkspaceList([]);
      this.updateProjects(this.store.getCurrentWorkspaceID);
      return;
    }
    this.store.setWorkspaceList(list);
  }
  async updateProjects(workspaceID) {
    return new Promise(resolve => {
      // * real set workspace
      console.log('projectBulkLoad', this.store.isLocal, workspaceID);
      this.storage.run('projectBulkLoad', [workspaceID], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
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
      this.storage.run('projectUpdate', [workspace.id, data, data.uuid], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.store.setCurrentProjectID(result.data.uuid);
          return resolve(true);
        }
        return resolve(false);
      });
    });
  }

  async updateShareLink(): Promise<string> {
    // * update share link
    const [res, err]: any = await this.http.api_shareCreateShare({});
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
        this.http
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
}
