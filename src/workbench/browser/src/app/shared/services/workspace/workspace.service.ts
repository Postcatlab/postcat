import { Injectable } from '@angular/core';
import { StorageUtil } from '../../../utils/storage/Storage';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  currentWorkspace: API.Workspace;
  workspaceList: API.Workspace[] = [];

  constructor() {}

  setWorkspaceList(data: API.Workspace[]) {
    this.workspaceList = data;
  }

  setCurrentWorkspace(workspace: API.Workspace) {
    this.currentWorkspace = workspace;
    StorageUtil.set('currentWorkspace', workspace);
  }
}
