import { Injectable } from '@angular/core';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { LocalService } from './local.service';
import { RemoteService } from './remote.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private store: StoreService, private local: LocalService, private remote: RemoteService) {}

  api_projectCreate(params) {
    this.remote.api_projectCreate(params);
  }

  api_projectUpdate(params) {
    this.remote.api_projectUpdate(params);
  }

  api_projectDelete(params) {
    this.remote.api_projectDelete(params);
  }

  api_projectExport(params) {
    this.remote.api_projectExport(params);
  }

  api_projectAddMember(params) {
    this.remote.api_projectAddMember(params);
  }

  api_projectDelMember(params) {
    this.remote.api_projectDelMember(params);
  }

  api_projectMember(params) {
    this.remote.api_projectMember(params);
  }

  api_projectMemberQuit(params) {
    this.remote.api_projectMemberQuit(params);
  }

  api_projectSetRole(params) {
    this.remote.api_projectSetRole(params);
  }

  api_projectRoleList(params) {
    this.remote.api_projectRoleList(params);
  }

  api_projectPermission(params) {
    this.remote.api_projectPermission(params);
  }

  api_workspaceCreate(params) {
    this.remote.api_workspaceCreate(params);
  }

  api_workspaceList(params) {
    this.remote.api_workspaceList(params);
  }

  api_workspaceEdit(params) {
    this.remote.api_workspaceEdit(params);
  }

  api_workspaceDelete(params) {
    this.remote.api_workspaceDelete(params);
  }

  api_workspaceMember(params) {
    this.remote.api_workspaceMember(params);
  }

  api_workspaceSearchMember(params) {
    this.remote.api_workspaceSearchMember(params);
  }

  api_workspaceAddMember(params) {
    this.remote.api_workspaceAddMember(params);
  }

  api_workspaceRemoveMember(params) {
    this.remote.api_workspaceRemoveMember(params);
  }

  api_workspaceMemberQuit(params) {
    this.remote.api_workspaceMemberQuit(params);
  }

  api_workspaceSetRole(params) {
    this.remote.api_workspaceSetRole(params);
  }

  api_workspacePermission(params) {
    this.remote.api_workspacePermission(params);
  }

  api_shareCreateShare(params) {
    this.remote.api_shareCreateShare(params);
  }

  api_shareGetShareList(params) {
    this.remote.api_shareGetShareList(params);
  }

  api_shareDeleteShare(params) {
    this.remote.api_shareDeleteShare(params);
  }

  api_shareDocGetAllApi(params) {
    this.remote.api_shareDocGetAllApi(params);
  }

  api_shareDocGetApiDetail(params) {
    this.remote.api_shareDocGetApiDetail(params);
  }

  api_shareDocGetEnv(params) {
    this.remote.api_shareDocGetEnv(params);
  }

  api_userReadInfo(params) {
    this.remote.api_userReadInfo(params);
  }

  api_userUpdateInfo(params) {
    this.remote.api_userUpdateInfo(params);
  }

  api_userUpdatePassword(params) {
    this.remote.api_userUpdatePassword(params);
  }

  api_userLogin(params) {
    this.remote.api_userLogin(params);
  }

  api_userRefreshToken(params) {
    this.remote.api_userRefreshToken(params);
  }

  api_userLogout(params) {
    this.remote.api_userLogout(params);
  }

  api_userSearch(params) {
    this.remote.api_userSearch(params);
  }

  api_environmentCreate(params) {
    return this.store.isLocal ? this.local.api_environmentCreate(params) : this.remote.api_environmentCreate(params);
  }

  api_environmentUpdate(params) {
    this.remote.api_environmentUpdate(params);
  }

  api_environmentDelete(params) {
    this.remote.api_environmentDelete(params);
  }

  api_groupCreate(params) {
    this.remote.api_groupCreate(params);
  }

  api_groupUpdate(params) {
    this.remote.api_groupUpdate(params);
  }

  api_groupDelete(params) {
    this.remote.api_groupDelete(params);
  }

  api_apiCreate(params) {
    this.remote.api_apiCreate(params);
  }

  api_apiUpdate(params) {
    this.remote.api_apiUpdate(params);
  }

  api_apiDelete(params) {
    this.remote.api_apiDelete(params);
  }

  api_apiLoadApi(params) {
    this.remote.api_apiLoadApi(params);
  }

  api_testCreate(params) {
    this.remote.api_testCreate(params);
  }

  api_testDelete(params) {
    this.remote.api_testDelete(params);
  }

  api_mockCreate(params) {
    this.remote.api_mockCreate(params);
  }

  api_mockLoad(params) {
    this.remote.api_mockLoad(params);
  }

  api_mockDelete(params) {
    this.remote.api_mockDelete(params);
  }

  api_mockUpdate(params) {
    this.remote.api_mockUpdate(params);
  }

  api_systemStatus(params) {
    this.remote.api_systemStatus(params);
  }
}
