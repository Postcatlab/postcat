import { Injectable } from '@angular/core';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StorageUtil } from '../../../utils/storage/Storage';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';

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
    private dataSourceService: DataSourceService,
    private storage: StorageService,
    private projectService: ProjectService,
    private userService: UserService
  ) {
    if (this.currentWorkspaceID === -1 && this.dataSourceService.isRemote) {
      this.setCurrentWorkspace(this.localWorkspace);
    } else if (this.currentWorkspaceID !== -1 && !this.dataSourceService.isRemote) {
      this.setCurrentWorkspace(this.currentWorkspace);
    }
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
    await this.dataSourceService.switchDataSource(workspace.id === -1 ? 'local' : 'http');
    this.updateProjectID(this.currentWorkspaceID);
    this.messageService.send({ type: 'workspaceChange', data: true });
  }

  getWorkspaceList() {
    return this.workspaceList;
  }

  async updateProjectID(workspaceID: number) {
    if (workspaceID !== -1 && this.dataSourceService.isRemote) {
      const { projects, creatorID } = await this.getWorkspaceInfo(workspaceID);
      this.projectService.setCurrentProjectID(projects.at(0).uuid);
      this.authEnum.canEdit = creatorID === this.userService.userProfile.id;
    }
    if (workspaceID === -1) {
      this.projectService.setCurrentProjectID(1);
    }
  }
}
