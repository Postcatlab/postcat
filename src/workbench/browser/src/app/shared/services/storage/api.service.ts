import { Injectable } from '@angular/core'
import { MessageService } from '../../../shared/services/message'
import {
  getSettings,
  SettingService,
} from 'eo/workbench/browser/src/app/core/services/settings/settings.service'
import RemoteService from './remote.service'
import LocalService from './local.service'

export type DataSourceType = 'local' | 'http'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  dataSourceType: DataSourceType =
    getSettings()['eoapi-common.dataStorage'] || 'local'

  constructor(
    private messageService: MessageService,
    private local: LocalService,
    private remote: RemoteService
  ) {}
  toggleDataSource = (options: any = {}) => {
    const { dataSourceType } = options
    this.dataSourceType =
      dataSourceType ?? (this.dataSourceType === 'http' ? 'local' : 'http')
  }

  api_projectCreate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectCreate(params)
    }
    return this.remote.api_projectCreate(params)
  }

  api_projectUpdate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectUpdate(params)
    }
    return this.remote.api_projectUpdate(params)
  }

  api_projectDelete(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectDelete(params)
    }
    return this.remote.api_projectDelete(params)
  }

  api_projectExport(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectExport(params)
    }
    return this.remote.api_projectExport(params)
  }

  api_projectAddMember(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectAddMember(params)
    }
    return this.remote.api_projectAddMember(params)
  }

  api_projectDelMember(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectDelMember(params)
    }
    return this.remote.api_projectDelMember(params)
  }

  api_projectMember(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectMember(params)
    }
    return this.remote.api_projectMember(params)
  }

  api_projectMemberQuit(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectMemberQuit(params)
    }
    return this.remote.api_projectMemberQuit(params)
  }

  api_projectSetRole(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectSetRole(params)
    }
    return this.remote.api_projectSetRole(params)
  }

  api_projectRoleList(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectRoleList(params)
    }
    return this.remote.api_projectRoleList(params)
  }

  api_projectPermission(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_projectPermission(params)
    }
    return this.remote.api_projectPermission(params)
  }

  api_workspaceCreate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceCreate(params)
    }
    return this.remote.api_workspaceCreate(params)
  }

  api_workspaceList(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceList(params)
    }
    return this.remote.api_workspaceList(params)
  }

  api_workspaceUpload(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceUpload(params)
    }
    return this.remote.api_workspaceUpload(params)
  }

  api_workspaceEdit(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceEdit(params)
    }
    return this.remote.api_workspaceEdit(params)
  }

  api_workspaceDelete(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceDelete(params)
    }
    return this.remote.api_workspaceDelete(params)
  }

  api_workspaceGetInfo(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceGetInfo(params)
    }
    return this.remote.api_workspaceGetInfo(params)
  }

  api_workspaceMember(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceMember(params)
    }
    return this.remote.api_workspaceMember(params)
  }

  api_workspaceSearchMember(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceSearchMember(params)
    }
    return this.remote.api_workspaceSearchMember(params)
  }

  api_workspaceAddMember(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceAddMember(params)
    }
    return this.remote.api_workspaceAddMember(params)
  }

  api_workspaceRemoveMember(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceRemoveMember(params)
    }
    return this.remote.api_workspaceRemoveMember(params)
  }

  api_workspaceMemberQuit(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceMemberQuit(params)
    }
    return this.remote.api_workspaceMemberQuit(params)
  }

  api_workspaceSetRole(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceSetRole(params)
    }
    return this.remote.api_workspaceSetRole(params)
  }

  api_workspaceRoleList(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspaceRoleList(params)
    }
    return this.remote.api_workspaceRoleList(params)
  }

  api_workspacePermission(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_workspacePermission(params)
    }
    return this.remote.api_workspacePermission(params)
  }

  api_shareCreateShare(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_shareCreateShare(params)
    }
    return this.remote.api_shareCreateShare(params)
  }

  api_shareGetShareList(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_shareGetShareList(params)
    }
    return this.remote.api_shareGetShareList(params)
  }

  api_shareDeleteShare(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_shareDeleteShare(params)
    }
    return this.remote.api_shareDeleteShare(params)
  }

  api_shareDocGetAllApi(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_shareDocGetAllApi(params)
    }
    return this.remote.api_shareDocGetAllApi(params)
  }

  api_shareDocGetApiDetail(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_shareDocGetApiDetail(params)
    }
    return this.remote.api_shareDocGetApiDetail(params)
  }

  api_shareDocGetEnv(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_shareDocGetEnv(params)
    }
    return this.remote.api_shareDocGetEnv(params)
  }

  api_userUpdateUserProfile(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_userUpdateUserProfile(params)
    }
    return this.remote.api_userUpdateUserProfile(params)
  }

  api_userReadProfile(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_userReadProfile(params)
    }
    return this.remote.api_userReadProfile(params)
  }

  api_userUpdatePsd(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_userUpdatePsd(params)
    }
    return this.remote.api_userUpdatePsd(params)
  }

  api_userSearch(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_userSearch(params)
    }
    return this.remote.api_userSearch(params)
  }

  api_authLogin(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_authLogin(params)
    }
    return this.remote.api_authLogin(params)
  }

  api_authRefresh(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_authRefresh(params)
    }
    return this.remote.api_authRefresh(params)
  }

  api_authLogout(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_authLogout(params)
    }
    return this.remote.api_authLogout(params)
  }

  api_envCreate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_envCreate(params)
    }
    return this.remote.api_envCreate(params)
  }

  api_envUpdate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_envUpdate(params)
    }
    return this.remote.api_envUpdate(params)
  }

  api_envDelete(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_envDelete(params)
    }
    return this.remote.api_envDelete(params)
  }

  api_envLoad(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_envLoad(params)
    }
    return this.remote.api_envLoad(params)
  }

  api_envSearch(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_envSearch(params)
    }
    return this.remote.api_envSearch(params)
  }

  api_groupCreate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_groupCreate(params)
    }
    return this.remote.api_groupCreate(params)
  }

  api_groupUpdate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_groupUpdate(params)
    }
    return this.remote.api_groupUpdate(params)
  }

  api_groupBulkUpdate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_groupBulkUpdate(params)
    }
    return this.remote.api_groupBulkUpdate(params)
  }

  api_groupDelete(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_groupDelete(params)
    }
    return this.remote.api_groupDelete(params)
  }

  api_groupLoadAll(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_groupLoadAll(params)
    }
    return this.remote.api_groupLoadAll(params)
  }

  api_apiCreate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_apiCreate(params)
    }
    return this.remote.api_apiCreate(params)
  }

  api_apiUpdate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_apiUpdate(params)
    }
    return this.remote.api_apiUpdate(params)
  }

  api_apiBulkUpdate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_apiBulkUpdate(params)
    }
    return this.remote.api_apiBulkUpdate(params)
  }

  api_apiDelete(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_apiDelete(params)
    }
    return this.remote.api_apiDelete(params)
  }

  api_apiLoadApi(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_apiLoadApi(params)
    }
    return this.remote.api_apiLoadApi(params)
  }

  api_apiLoadAllByProjectId(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_apiLoadAllByProjectId(params)
    }
    return this.remote.api_apiLoadAllByProjectId(params)
  }

  api_testCreate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_testCreate(params)
    }
    return this.remote.api_testCreate(params)
  }

  api_testDelete(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_testDelete(params)
    }
    return this.remote.api_testDelete(params)
  }

  api_testLoadAll(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_testLoadAll(params)
    }
    return this.remote.api_testLoadAll(params)
  }

  api_mockCreate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_mockCreate(params)
    }
    return this.remote.api_mockCreate(params)
  }

  api_mockLoad(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_mockLoad(params)
    }
    return this.remote.api_mockLoad(params)
  }

  api_mockDelete(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_mockDelete(params)
    }
    return this.remote.api_mockDelete(params)
  }

  api_mockUpdate(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_mockUpdate(params)
    }
    return this.remote.api_mockUpdate(params)
  }

  api_mockLoadAll(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_mockLoadAll(params)
    }
    return this.remote.api_mockLoadAll(params)
  }

  api_systemStatus(params) {
    if (this.dataSourceType === 'local') {
      return this.local.api_systemStatus(params)
    }
    return this.remote.api_systemStatus(params)
  }
}
