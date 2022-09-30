import { Injectable } from '@angular/core';
import { StorageUtil } from '../../../utils/storage/Storage';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  localWorkspace = {
    title: $localize`Local workspace`,
    id: -1,
  } as API.Workspace;
  currentWorkspace: API.Workspace = StorageUtil.get('currentWorkspace', this.localWorkspace);
  workspaceList: API.Workspace[] = [this.localWorkspace];

  constructor() {}

  setWorkspaceList(data: API.Workspace[]) {
    this.workspaceList = [
      ...data.map((item) => ({
        ...item,
        type: 'online',
      })),
      this.localWorkspace,
    ];
    console.log(this.workspaceList);
  }

  setCurrentWorkspace(workspace: API.Workspace) {
    this.currentWorkspace = workspace;
    console.log('workspace', workspace);
    StorageUtil.set('currentWorkspace', workspace);
  }
}
