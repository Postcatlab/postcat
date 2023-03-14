import { Injectable } from '@angular/core';
import { StoreService } from 'pc/browser/src/app/store/state.service';

import { LocalService } from './local.service';
import { RemoteService } from './remote.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private store: StoreService, private local: LocalService, private remote: RemoteService) {}

  api_apiDataCreate<T = any>(params: { apiList: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_apiDataCreate<T>(params) : this.remote.api_apiDataCreate<T>(params);
  }

  api_apiDataUpdate<T = any>(params: { api: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_apiDataUpdate<T>(params) : this.remote.api_apiDataUpdate<T>(params);
  }

  api_apiDataDelete<T = any>(params: { apiUuids: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_apiDataDelete<T>(params) : this.remote.api_apiDataDelete<T>(params);
  }

  api_apiDataDetail<T = any>(params: { apiUuids: any; projectUuid?: any; workSpaceUuid?: any; [key: string]: any }) {
    return this.store.isLocal ? this.local.api_apiDataDetail<T>(params) : this.remote.api_apiDataDetail<T>(params);
  }

  api_apiDataList<T = any>(params: { projectUuid?: any; workSpaceUuid?: any; [key: string]: any }) {
    return this.store.isLocal ? this.local.api_apiDataList<T>(params) : this.remote.api_apiDataList<T>(params);
  }

  api_apiDataGetGroup<T = any>(params: { projectUuid?: any }) {
    return this.remote.api_apiDataGetGroup<T>(params);
  }

  api_mockCreate<T = any>(params: {
    name: any;
    apiUuid: any;
    createWay: any;
    response: any;
    projectUuid?: any;
    workSpaceUuid?: any;
    [key: string]: any;
  }) {
    return this.store.isLocal ? this.local.api_mockCreate<T>(params) : this.remote.api_mockCreate<T>(params);
  }

  api_mockUpdate<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any; [key: string]: any }) {
    return this.store.isLocal ? this.local.api_mockUpdate<T>(params) : this.remote.api_mockUpdate<T>(params);
  }

  api_mockList<T = any>(params: { apiUuid: any; projectUuid?: any; workSpaceUuid?: any; page: any; pageSize: any }) {
    return this.store.isLocal ? this.local.api_mockList<T>(params) : this.remote.api_mockList<T>(params);
  }

  api_mockDetail<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_mockDetail<T>(params) : this.remote.api_mockDetail<T>(params);
  }

  api_mockDelete<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_mockDelete<T>(params) : this.remote.api_mockDelete<T>(params);
  }

  api_groupCreate<T = any>(params: any) {
    return this.store.isLocal ? this.local.api_groupCreate<T>(params) : this.remote.api_groupCreate<T>(params);
  }

  api_groupUpdate<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any; [key: string]: any }) {
    return this.store.isLocal ? this.local.api_groupUpdate<T>(params) : this.remote.api_groupUpdate<T>(params);
  }

  api_groupDelete<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_groupDelete<T>(params) : this.remote.api_groupDelete<T>(params);
  }

  api_groupDetail<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_groupDetail<T>(params) : this.remote.api_groupDetail<T>(params);
  }

  api_groupList<T = any>(params: { projectUuid?: any; workSpaceUuid?: any; withItem?: any }) {
    return this.store.isLocal ? this.local.api_groupList<T>(params) : this.remote.api_groupList<T>(params);
  }

  api_apiTestHistoryCreate<T = any>(params: {
    apiUuid: any;
    general: any;
    request: any;
    response: any;
    projectUuid?: any;
    workSpaceUuid?: any;
  }) {
    return this.store.isLocal ? this.local.api_apiTestHistoryCreate<T>(params) : this.remote.api_apiTestHistoryCreate<T>(params);
  }

  api_apiTestHistoryList<T = any>(params: { projectUuid?: any; workSpaceUuid?: any; page: any; pageSize: any }) {
    return this.store.isLocal ? this.local.api_apiTestHistoryList<T>(params) : this.remote.api_apiTestHistoryList<T>(params);
  }

  api_apiTestHistoryDetail<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_apiTestHistoryDetail<T>(params) : this.remote.api_apiTestHistoryDetail<T>(params);
  }

  api_apiTestHistoryDelete<T = any>(params: { ids: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_apiTestHistoryDelete<T>(params) : this.remote.api_apiTestHistoryDelete<T>(params);
  }

  api_environmentCreate<T = any>(params: { name: any; projectUuid?: any; workSpaceUuid?: any; [key: string]: any }) {
    return this.store.isLocal ? this.local.api_environmentCreate<T>(params) : this.remote.api_environmentCreate<T>(params);
  }

  api_environmentUpdate<T = any>(params: { id: any; name: any; projectUuid?: any; workSpaceUuid?: any; [key: string]: any }) {
    return this.store.isLocal ? this.local.api_environmentUpdate<T>(params) : this.remote.api_environmentUpdate<T>(params);
  }

  api_environmentDelete<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_environmentDelete<T>(params) : this.remote.api_environmentDelete<T>(params);
  }

  api_environmentDetail<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_environmentDetail<T>(params) : this.remote.api_environmentDetail<T>(params);
  }

  api_environmentList<T = any>(params: { projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_environmentList<T>(params) : this.remote.api_environmentList<T>(params);
  }

  api_userReadInfo<T = any>(params: any) {
    return this.remote.api_userReadInfo<T>(params);
  }

  api_userUpdateInfo<T = any>(params: any) {
    return this.remote.api_userUpdateInfo<T>(params);
  }

  api_userUpdatePassword<T = any>(params: { password: any }) {
    return this.remote.api_userUpdatePassword<T>(params);
  }

  api_userLogin<T = any>(params: { username: any; password: any }) {
    return this.remote.api_userLogin<T>(params);
  }

  api_userRefreshToken<T = any>(params: any) {
    return this.remote.api_userRefreshToken<T>(params);
  }

  api_userLogout<T = any>(params: any) {
    return this.remote.api_userLogout<T>(params);
  }

  api_userSearch<T = any>(params: { username: any }) {
    return this.remote.api_userSearch<T>(params);
  }

  api_userThirdLogin<T = any>(params: { type: any; client: any; redirectUri: any; appType: any; [key: string]: any }) {
    return this.remote.api_userThirdLogin<T>(params);
  }

  api_userThirdLoginResult<T = any>(params: { code: any }) {
    return this.remote.api_userThirdLoginResult<T>(params);
  }

  api_userGetToken<T = any>(params: any) {
    return this.remote.api_userGetToken<T>(params);
  }

  api_userResetToken<T = any>(params: any) {
    return this.remote.api_userResetToken<T>(params);
  }

  api_workspaceCreate<T = any>(params: { titles: any }) {
    return this.store.isLocal ? this.local.api_workspaceCreate<T>(params) : this.remote.api_workspaceCreate<T>(params);
  }

  api_workspaceUpdate<T = any>(params: { title: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_workspaceUpdate<T>(params) : this.remote.api_workspaceUpdate<T>(params);
  }

  api_workspaceDelete<T = any>(params: { workSpaceUuids: any }) {
    return this.store.isLocal ? this.local.api_workspaceDelete<T>(params) : this.remote.api_workspaceDelete<T>(params);
  }

  api_workspaceSearchMember<T = any>(params: { username: any; page: any; pageSize: any; workSpaceUuid?: any }) {
    return this.remote.api_workspaceSearchMember<T>(params);
  }

  api_workspaceAddMember<T = any>(params: { userIds: any; workSpaceUuid?: any }) {
    return this.remote.api_workspaceAddMember<T>(params);
  }

  api_workspaceRemoveMember<T = any>(params: { userIds: any; workSpaceUuid?: any }) {
    return this.remote.api_workspaceRemoveMember<T>(params);
  }

  api_workspaceMemberQuit<T = any>(params: { workSpaceUuid?: any }) {
    return this.remote.api_workspaceMemberQuit<T>(params);
  }

  api_workspaceAddMemberRole<T = any>(params: { userRole: any; workSpaceUuid?: any }) {
    return this.remote.api_workspaceAddMemberRole<T>(params);
  }

  api_workspaceGetMemberPermiss<T = any>(params: { workSpaceUuid?: any }) {
    return this.remote.api_workspaceGetMemberPermiss<T>(params);
  }

  api_workspaceList<T = any>(params: any) {
    return this.remote.api_workspaceList<T>(params);
  }

  api_workspaceRoles<T = any>(params: { workSpaceUuid?: any }) {
    return this.remote.api_workspaceRoles<T>(params);
  }

  api_workspaceSetRole<T = any>(params: { userRole: any; workSpaceUuid?: any }) {
    return this.remote.api_workspaceSetRole<T>(params);
  }

  api_projectExportProject<T = any>(params: { projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_projectExportProject<T>(params) : this.remote.api_projectExportProject<T>(params);
  }

  api_projectMemberList<T = any>(params: { username: any; projectUuid?: any }) {
    return this.remote.api_projectMemberList<T>(params);
  }

  api_projectAddMember<T = any>(params: { userIds: any; projectUuid?: any }) {
    return this.remote.api_projectAddMember<T>(params);
  }

  api_projectDelMember<T = any>(params: { userIds: any; projectUuid?: any }) {
    return this.remote.api_projectDelMember<T>(params);
  }

  api_projectMemberQuit<T = any>(params: { userId: any; projectUuid?: any }) {
    return this.remote.api_projectMemberQuit<T>(params);
  }

  api_projectSetRole<T = any>(params: { projectUuid?: any; userRole: any }) {
    return this.remote.api_projectSetRole<T>(params);
  }

  api_projectGetRole<T = any>(params: { projectUuid?: any }) {
    return this.remote.api_projectGetRole<T>(params);
  }

  api_projectUserPermission<T = any>(params: { projectUuid?: any }) {
    return this.remote.api_projectUserPermission<T>(params);
  }

  api_projectCreate<T = any>(params: { projectMsgs: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_projectCreate<T>(params) : this.remote.api_projectCreate<T>(params);
  }

  api_projectList<T = any>(params: { projectUuids: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_projectList<T>(params) : this.remote.api_projectList<T>(params);
  }

  api_projectUpdate<T = any>(params: { projectUuid?: any; name: any; description: any }) {
    return this.store.isLocal ? this.local.api_projectUpdate<T>(params) : this.remote.api_projectUpdate<T>(params);
  }

  api_projectDelete<T = any>(params: { projectUuids: any }) {
    return this.store.isLocal ? this.local.api_projectDelete<T>(params) : this.remote.api_projectDelete<T>(params);
  }

  api_projectImport<T = any>(params: any) {
    return this.store.isLocal ? this.local.api_projectImport<T>(params) : this.remote.api_projectImport<T>(params);
  }

  api_projectCreateSyncSetting<T = any>(params: { projectUuid?: any; workSpaceUuid?: any; [key: string]: any }) {
    return this.store.isLocal ? this.local.api_projectCreateSyncSetting<T>(params) : this.remote.api_projectCreateSyncSetting<T>(params);
  }

  api_projectUpdateSyncSetting<T = any>(params: { projectUuid?: any; workSpaceUuid?: any; [key: string]: any }) {
    return this.store.isLocal ? this.local.api_projectUpdateSyncSetting<T>(params) : this.remote.api_projectUpdateSyncSetting<T>(params);
  }

  api_projectDelSyncSetting<T = any>(params: { id: any; projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_projectDelSyncSetting<T>(params) : this.remote.api_projectDelSyncSetting<T>(params);
  }

  api_projectGetSyncSettingList<T = any>(params: { projectUuid?: any; workSpaceUuid?: any }) {
    return this.store.isLocal ? this.local.api_projectGetSyncSettingList<T>(params) : this.remote.api_projectGetSyncSettingList<T>(params);
  }

  api_projectSyncBatchUpdate<T = any>(params: { projectUuid?: any; workSpaceUuid?: any; [key: string]: any }) {
    return this.store.isLocal ? this.local.api_projectSyncBatchUpdate<T>(params) : this.remote.api_projectSyncBatchUpdate<T>(params);
  }

  api_roleList<T = any>(params: any) {
    return this.remote.api_roleList<T>(params);
  }

  api_projectShareCreateShare<T = any>(params: { projectUuid?: any; workSpaceUuid?: any }) {
    return this.remote.api_projectShareCreateShare<T>(params);
  }

  api_projectShareGetShareLink<T = any>(params: { projectUuid?: any; workSpaceUuid?: any }) {
    return this.remote.api_projectShareGetShareLink<T>(params);
  }

  api_projectShareDeleteShare<T = any>(params: { sharedUuid: any }) {
    return this.remote.api_projectShareDeleteShare<T>(params);
  }

  api_shareProjectDetail<T = any>(params: { sharedUuid: any }) {
    return this.remote.api_shareProjectDetail<T>(params);
  }

  api_shareGroupList<T = any>(params: { sharedUuid: any; withItem?: any }) {
    return this.remote.api_shareGroupList<T>(params);
  }

  api_shareApiDataDetail<T = any>(params: { apiUuids: any; sharedUuid: any; [key: string]: any }) {
    return this.remote.api_shareApiDataDetail<T>(params);
  }

  api_shareEnvironmentList<T = any>(params: { sharedUuid: any }) {
    return this.remote.api_shareEnvironmentList<T>(params);
  }
}
