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
}
