import { Injectable } from '@angular/core';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StorageUtil } from '../../../utils/storage/Storage';
import { DataSourceType } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';
import { Router } from '@angular/router';
/** is show switch success tips */
export const IS_SHOW_DATA_SOURCE_TIP = 'IS_SHOW_DATA_SOURCE_TIP';
@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  localWorkspace = {
    title: $localize`Local workspace`,
    id: -1,
  } as API.Workspace;
  currentWorkspaceID: number = StorageUtil.get('currentWorkspace', this.localWorkspace).id;

  authEnum = {
    canEdit: false,
    canDelete: false,
    canCreate: false,
  };
  get isLocal() {
    return this.currentWorkspaceID === -1;
  }

  get currentWorkspace() {
    const oldWorkspaceID = this.currentWorkspaceID;
    const target = this.workspaceList.find((n) => n.id === this.currentWorkspaceID);
    const result = target || this.localWorkspace;
    if (oldWorkspaceID !== this.currentWorkspaceID) {
      this.setCurrentWorkspace(result);
    }
    return result;
  }
  workspaceList: API.Workspace[] = [this.localWorkspace];
  constructor(
    private messageService: MessageService,
    private storage: StorageService,
    private projectService: ProjectService,
    private userService: UserService,
    private storageService: StorageService,
    private router: Router
  ) {
    // Current storage workspaceID not match remote storage,reset it;
    this.setCurrentWorkspace(this.currentWorkspace);
  }

  getWorkspaceInfo(workspaceID: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.run('getWorkspaceInfo', [workspaceID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          reject();
        }
      });
    });
  }

  setWorkspaceList(data: API.Workspace[]) {
    this.workspaceList = [
      ...data.map((item) => ({
        ...item,
        type: 'online',
      })),
      this.localWorkspace,
    ];
    if (!this.workspaceList.some((n) => n.id === this.currentWorkspaceID)) {
      this.setCurrentWorkspace(this.localWorkspace);
    }
  }

  setLocalSpace() {
    this.setCurrentWorkspace(this.localWorkspace);
  }

  getLocalWorkspaceInfo() {
    return this.localWorkspace;
  }

  async setCurrentWorkspaceID(id: number) {
    this.currentWorkspaceID = id;
    await this.updateProjectID(this.currentWorkspaceID);
  }

  async setCurrentWorkspace(workspace: API.Workspace) {
    this.currentWorkspaceID = workspace.id;
    StorageUtil.set('currentWorkspace', workspace);
    // * Change data storage
    this.messageService.send({
      type: 'changeStorage',
      data: {
        type: workspace.id === -1 ? 'local' : 'http',
      },
    });
    this.switchDataSource(workspace.id === -1 ? 'local' : 'http');
    await this.updateProjectID(this.currentWorkspaceID);
    //refresh componnet
    const { pathname, searchParams } = new URL(this.router.url, 'https://github.com/');
    await this.router.navigate(['**']);
    await this.router.navigate([pathname], { queryParams: Object.fromEntries(searchParams.entries()) });

    this.messageService.send({ type: 'workspaceChange', data: true });
  }
  /**
   * switch data
   */
  private switchDataSource = async (dataSource: DataSourceType) => {
    const isRemote = dataSource === 'http';
    if (isRemote) {
      this.switchToHttp();
      localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'false');
    } else {
      this.switchToLocal();
      localStorage.setItem(IS_SHOW_DATA_SOURCE_TIP, 'true');
    }
  };
  switchToLocal() {
    this.storageService.toggleDataSource({ dataSourceType: 'local' });
  }
  switchToHttp() {
    this.storageService.toggleDataSource({ dataSourceType: 'http' });
  }
  async refreshComponent() {}

  getWorkspaceList() {
    return this.workspaceList;
  }

  async updateProjectID(workspaceID: number) {
    if (workspaceID === -1) {
      this.projectService.setCurrentProjectID(1);
      return;
    }
    const { projects, creatorID } = await this.getWorkspaceInfo(workspaceID);
    console.log(projects);
    this.projectService.setCurrentProjectID(projects.at(0).uuid);
    this.authEnum.canEdit = creatorID === this.userService.userProfile.id;
  }
}
