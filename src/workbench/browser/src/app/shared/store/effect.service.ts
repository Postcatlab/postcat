import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { autorun } from 'mobx';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  constructor(
    private apiService: ApiService,
    private storage: StorageService,
    private indexedDBStorage: IndexedDBStorage,
    private store: StoreService,
    private http: RemoteService,
    private message: MessageService,
    private router: Router,
    private lang: LanguageService,
    private web: WebService
  ) {
    autorun(async () => {
      if (this.store.isLogin) {
        await this.updateWorkspaceList();
      } else {
        this.updateWorkspace(this.store.getLocalWorkspace);
      }
      if (this.store.isLocal || !this.store.isLogin || this.store.isShare) {
        this.store.setShareLink('');
        return;
      }
      this.updateShareLink();
    });
  }

  async updateWorkspaceList() {
    const [list, wErr]: any = await this.http.api_workspaceList({});
    if (wErr) {
      if (wErr.status === 401) {
        this.message.send({ type: 'clear-user', data: {} });
        if (this.store.isLogin) {
          return;
        }
        this.message.send({ type: 'http-401', data: {} });
      }
      return;
    }
    this.store.setWorkspaceList(list);
    this.updateWorkspace(this.store.getCurrentWorkspace);
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
      console.log('yew');
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

  async updateWorkspace(workspace) {
    if (workspace.id !== -1) {
      const [data, err]: any = await this.http.api_workspaceGetInfo({ workspaceID: workspace.id });
      if (err) {
        return;
      }
      workspace = data;
      //?Why
      StorageUtil.remove('server_version');
    }
    // * real set workspace
    this.store.setCurrentWorkspace(workspace);
    this.storage.run('projectBulkLoad', [workspace.id], async (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        // * update project id
        const projects = result.data;
        this.store.setCurrentProject(projects.at(0));
        this.updateShareLink();
        // * refresh view
        await this.router.navigate(['**']);
        await this.router.navigate(['/home'], { queryParams: { spaceID: workspace.id } });
      }
    });
  }

  async updateShareLink() {
    // * update share link
    const [res, err]: any = await this.http.api_shareCreateShare({});
    if (err) {
      this.store.setShareLink('');
      return;
    }
    const host = (this.store.remoteUrl || window.location.host)
      .replace(/:\/{2,}/g, ':::')
      .replace(/\/{2,}/g, '/')
      .replace(/:{3}/g, '://')
      .replace(/(\/$)/, '');
    const lang = !APP_CONFIG.production && this.web.isWeb ? '' : this.lang.langHash;
    const link = `${host}/${lang ? `${lang}/` : ''}home/share/http/test?shareId=${res.uniqueID}`;
    this.store.setShareLink(link);
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
