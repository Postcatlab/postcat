import { Injectable } from '@angular/core';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StorageUtil } from '../../../utils/storage/Storage';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  localWorkspace = {
    title: $localize`Local workspace`,
    id: -1,
  } as API.Workspace;
  currentWorkspaceID: number;
  currentProjectID: number;
  get currentWorkspace() {
    const target = this.workspaceList.find((n) => n.id === this.currentWorkspaceID);
    const result = target || StorageUtil.get('currentWorkspace', this.localWorkspace);
    this.currentWorkspaceID = result.id;
    return result;
  }
  workspaceList: API.Workspace[] = [this.localWorkspace];

  constructor(
    private messageService: MessageService,
    private dataSource: DataSourceService,
    private apiService: ApiService,
    private storage: StorageService
  ) {
    setTimeout(async () => {
      console.log('exportProjectData', await this.exportProjectData());
    }, 2000);
  }

  setWorkspaceList(data: API.Workspace[]) {
    this.workspaceList = [
      ...data.map((item) => ({
        ...item,
        type: 'online',
      })),
      this.localWorkspace,
    ];
  }

  async setCurrentWorkspaceID(id: number) {
    this.currentWorkspaceID = id;
    const [result] = await this.getWorkspaceInfo(id);
    console.log('getWorkspaceInfo result', result);
    this.currentProjectID = result.uuid;
  }

  async setCurrentWorkspace(workspace: API.Workspace) {
    this.currentWorkspaceID = workspace.id;
    console.log('workspace', workspace);
    StorageUtil.set('currentWorkspace', workspace);
    //Change data storage
    await this.dataSource.switchDataSource(workspace.id === -1 ? 'local' : 'http');
    this.messageService.send({ type: 'workspaceChange', data: true });
  }

  getWorkspaceList() {
    return this.workspaceList;
  }

  getWorkspaceInfo(workspaceID: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.storage.run('getWorkspaceInfo', [workspaceID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        }
      });
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

  async exportProjectData(projectID = 1) {
    const apiGroup = await this.getGroups(projectID);
    const result: StorageRes = await this.apiService.getAll(projectID);
    const { success, empty } = StorageResStatus;
    if ([success, empty].includes(result.status)) {
      return {
        collections: this.exportCollects(apiGroup, result.data),
        enviroments: [],
      };
    }
    return {
      collections: [],
      enviroments: [],
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
