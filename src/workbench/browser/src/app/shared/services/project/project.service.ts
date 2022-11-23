import { Injectable } from '@angular/core';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  currentProjectID = StorageUtil.get('currentProjectID', 1);

  constructor(
    private apiService: ApiService,
    private storage: StorageService,
    private indexedDBStorage: IndexedDBStorage
  ) {
  }

  setCurrentProjectID(projectID: number) {
    this.currentProjectID = projectID;
    StorageUtil.set('currentProjectID', projectID);
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

  async exportLocalProjectData(projectID = 1) {
    return new Promise((resolve) => {
      const apiGroupObservable = this.indexedDBStorage.groupLoadAllByProjectID(projectID);
      apiGroupObservable.subscribe(({ data: apiGroup }: any) => {
        const apiDataObservable = this.indexedDBStorage.apiDataLoadAllByProjectID(projectID);
        apiDataObservable.subscribe(({ data: apiData }: any) => {
          const envObservable = this.indexedDBStorage.environmentLoadAllByProjectID(projectID);
          envObservable.subscribe(({ data: environments }: any) => {
            resolve({
              collections: this.exportCollects(apiGroup, apiData),
              environments,
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
        environments: [],
      };
    }
    return {
      collections: [],
      environments: [],
    };
  }

  exportCollects(apiGroup: any[], apiData: any[], parentID = 0) {
    const apiGroupFilters = apiGroup.filter((child) => child.parentID === parentID);
    const apiDataFilters = apiData.filter((child) => child.groupID === parentID);
    return apiGroupFilters
      .map((item) => ({
        name: item.name,
        children: this.exportCollects(apiGroup, apiData, item.uuid),
      }))
      .concat(apiDataFilters);
  }
}
