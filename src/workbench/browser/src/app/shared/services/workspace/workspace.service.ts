import { Injectable } from '@angular/core';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StorageUtil } from '../../../utils/storage/Storage';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  localWorkspace = {
    title: $localize`Local workspace`,
    id: -1,
  } as API.Workspace;
  currentWorkspaceID: number;

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
    private projectService: ProjectService
  ) {}

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
    await this.updateProjectID(this.currentWorkspaceID);
  }

  async setCurrentWorkspace(workspace: API.Workspace) {
    this.currentWorkspaceID = workspace.id;
    this.updateProjectID(this.currentWorkspaceID);
    console.log('workspace', workspace);
    StorageUtil.set('currentWorkspace', workspace);
    //Change data storage
    await this.dataSource.switchDataSource(workspace.id === -1 ? 'local' : 'http');
    this.messageService.send({ type: 'workspaceChange', data: true });
  }

  getWorkspaceList() {
    return this.workspaceList;
  }

  async updateProjectID(workspaceID: number) {
    if (workspaceID !== -1) {
      await this.projectService.getWorkspaceInfo(workspaceID);
    }
  }
}
