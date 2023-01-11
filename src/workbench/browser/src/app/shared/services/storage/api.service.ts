import { Injectable } from '@angular/core';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { LocalService } from './local.service';
import { RemoteService } from './remote.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private store: StoreService, private local: LocalService, private remote: RemoteService) {}

  api_apiDataCreate(params) {
    return this.store.isLocal ? this.local.api_apiDataCreate(params) : this.remote.api_apiDataCreate(params);
  }

  api_apiDataUpdate(params) {
    return this.store.isLocal ? this.local.api_apiDataUpdate(params) : this.remote.api_apiDataUpdate(params);
  }

  api_apiDataDelete(params) {
    return this.store.isLocal ? this.local.api_apiDataDelete(params) : this.remote.api_apiDataDelete(params);
  }

  api_apiDataDetail(params) {
    return this.store.isLocal ? this.local.api_apiDataDetail(params) : this.remote.api_apiDataDetail(params);
  }

  api_apiDataList(params) {
    return this.store.isLocal ? this.local.api_apiDataList(params) : this.remote.api_apiDataList(params);
  }

  api_mockCreate(params) {
    return this.store.isLocal ? this.local.api_mockCreate(params) : this.remote.api_mockCreate(params);
  }

  api_mockUpdate(params) {
    return this.store.isLocal ? this.local.api_mockUpdate(params) : this.remote.api_mockUpdate(params);
  }

  api_mockList(params) {
    return this.store.isLocal ? this.local.api_mockList(params) : this.remote.api_mockList(params);
  }

  api_mockDetail(params) {
    return this.store.isLocal ? this.local.api_mockDetail(params) : this.remote.api_mockDetail(params);
  }

  api_mockDelete(params) {
    return this.store.isLocal ? this.local.api_mockDelete(params) : this.remote.api_mockDelete(params);
  }

  api_groupCreate(params) {
    return this.store.isLocal ? this.local.api_groupCreate(params) : this.remote.api_groupCreate(params);
  }

  api_groupUpdate(params) {
    return this.store.isLocal ? this.local.api_groupUpdate(params) : this.remote.api_groupUpdate(params);
  }

  api_groupDelete(params) {
    return this.store.isLocal ? this.local.api_groupDelete(params) : this.remote.api_groupDelete(params);
  }

  api_groupDetail(params) {
    return this.store.isLocal ? this.local.api_groupDetail(params) : this.remote.api_groupDetail(params);
  }

  api_groupList(params) {
    return this.store.isLocal ? this.local.api_groupList(params) : this.remote.api_groupList(params);
  }

  api_apiTestHistoryCreate(params) {
    return this.store.isLocal ? this.local.api_apiTestHistoryCreate(params) : this.remote.api_apiTestHistoryCreate(params);
  }

  api_apiTestHistoryList(params) {
    return this.store.isLocal ? this.local.api_apiTestHistoryList(params) : this.remote.api_apiTestHistoryList(params);
  }

  api_apiTestHistoryDetail(params) {
    return this.store.isLocal ? this.local.api_apiTestHistoryDetail(params) : this.remote.api_apiTestHistoryDetail(params);
  }

  api_apiTestHistoryDelete(params) {
    return this.store.isLocal ? this.local.api_apiTestHistoryDelete(params) : this.remote.api_apiTestHistoryDelete(params);
  }

  api_environmentCreate(params) {
    return this.store.isLocal ? this.local.api_environmentCreate(params) : this.remote.api_environmentCreate(params);
  }

  api_environmentUpdate(params) {
    return this.store.isLocal ? this.local.api_environmentUpdate(params) : this.remote.api_environmentUpdate(params);
  }

  api_environmentDelete(params) {
    return this.store.isLocal ? this.local.api_environmentDelete(params) : this.remote.api_environmentDelete(params);
  }

  api_environmentDetail(params) {
    return this.store.isLocal ? this.local.api_environmentDetail(params) : this.remote.api_environmentDetail(params);
  }

  api_environmentList(params) {
    return this.store.isLocal ? this.local.api_environmentList(params) : this.remote.api_environmentList(params);
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

  api_workspaceCreate(params) {
    return this.store.isLocal ? this.local.api_workspaceCreate(params) : this.remote.api_workspaceCreate(params);
  }

  api_workspaceUpdate(params) {
    return this.store.isLocal ? this.local.api_workspaceUpdate(params) : this.remote.api_workspaceUpdate(params);
  }

  api_workspaceDelete(params) {
    return this.store.isLocal ? this.local.api_workspaceDelete(params) : this.remote.api_workspaceDelete(params);
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

  api_workspaceAddMemberRole(params) {
    this.remote.api_workspaceAddMemberRole(params);
  }

  api_workspaceSearchMember(params) {
    this.remote.api_workspaceSearchMember(params);
  }

  api_workspaceList(params) {
    return this.store.isLocal ? this.local.api_workspaceList(params) : this.remote.api_workspaceList(params);
  }

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
}
