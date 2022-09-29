import { Injectable } from '@angular/core'
import localStorage from './local.db'
import { Table } from 'dexie'
import {
  Project,
  Environment,
  Group,
  ApiData,
  ApiTestHistory,
  ApiMockEntity,
  StorageInterface,
  StorageItem,
  StorageResStatus,
} from './index.model'
import { sampleApiData } from './IndexedDB/sample'

const ErrorStyle =
  'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;'

const SuccessStyle =
  'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;'

@Injectable({
  providedIn: 'root',
})
export default class LocalService extends localStorage {
  project!: Table<Project, number | string>
  group!: Table<Group, number | string>
  environment!: Table<Environment, number | string>
  apiData!: Table<ApiData, number | string>
  apiTestHistory!: Table<ApiTestHistory, number | string>
  mock!: Table<ApiMockEntity, number | string>
  constructor() {
    super('eoapi_core')
    this.version(2).stores({
      project: '++uuid, name',
      environment: '++uuid, name, projectID',
      group: '++uuid, name, projectID, parentID',
      apiData: '++uuid, name, projectID, groupID',
      apiTestHistory: '++uuid, projectID, apiDataID',
      mock: '++uuid, name, apiDataID, projectID, createWay',
    })
    this.open()
    this.on('populate', () => this.populate())
  }
  async populate() {
    await this.project.add({ uuid: 1, name: 'Default' })
    await this.apiData.bulkAdd(sampleApiData)
  }
  projectExports(): Promise<any> {
    const result = ['environment', 'group', 'project', 'apiData'].reduce(
      async (total, it) => ({
        [it]: await this[it].toArray(),
        ...total,
      }),
      {}
    )
    return Promise.resolve(result)
  }

  api_projectCreate(params) {
    return new Promise((resolve) => {
      this.create(this.project, params)
        .then(({ status, ...data }: any) => {
          console.log('%c project - create 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c project - create 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_projectUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log(
        '%c Error: project - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.update(this.project, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c project - update 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c project - update 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_projectDelete({ uuid }) {
    if (!uuid) {
      console.log(
        '%c Error: project - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.remove(this.project, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c project - delete 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c project - delete 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_projectExport(params) {
    return new Promise((resolve) => {
      this.load(this.project, params)
        .then(({ status, ...data }: any) => {
          console.log('%c project - export 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c project - export 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_workspaceCreate(params) {
    return new Promise((resolve) => {
      this.create(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - create 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c workspace - create 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_workspaceList(params) {
    return new Promise((resolve) => {
      this.load(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - list 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c workspace - list 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_workspaceUpload(params) {
    return new Promise((resolve) => {
      this.create(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - upload 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c workspace - upload 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_workspaceEdit({ workspanID }) {
    if (!workspanID) {
      console.log(
        '%c Error: workspace - edit 接口 缺失参数 workspanID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.update(this.undefined, { workspanID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - edit 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c workspace - edit 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_workspaceDelete({ workspanID }) {
    if (!workspanID) {
      console.log(
        '%c Error: workspace - delete 接口 缺失参数 workspanID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.remove(this.undefined, { workspanID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - delete 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c workspace - delete 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_workspaceMember({ workspanID }) {
    if (!workspanID) {
      console.log(
        '%c Error: workspace - member 接口 缺失参数 workspanID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.load(this.undefined, { workspanID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - member 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c workspace - member 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_workspaceAddMember({ workspanID }) {
    if (!workspanID) {
      console.log(
        '%c Error: workspace - addMember 接口 缺失参数 workspanID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.create(this.undefined, { workspanID })
        .then(({ status, ...data }: any) => {
          console.log(
            '%c workspace - addMember 接口调用成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log(
            '%c workspace - addMember 接口调用失败 %c',
            ErrorStyle,
            ''
          )
          resolve([null, error])
        })
    })
  }

  api_workspaceRemoveMember({ workspanID }) {
    if (!workspanID) {
      console.log(
        '%c Error: workspace - removeMember 接口 缺失参数 workspanID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.load(this.undefined, { workspanID })
        .then(({ status, ...data }: any) => {
          console.log(
            '%c workspace - removeMember 接口调用成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log(
            '%c workspace - removeMember 接口调用失败 %c',
            ErrorStyle,
            ''
          )
          resolve([null, error])
        })
    })
  }

  api_userUpdateUserProfile(params) {
    return new Promise((resolve) => {
      this.create(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log(
            '%c user - updateUserProfile 接口调用成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log(
            '%c user - updateUserProfile 接口调用失败 %c',
            ErrorStyle,
            ''
          )
          resolve([null, error])
        })
    })
  }

  api_userReadProfile(params) {
    return new Promise((resolve) => {
      this.load(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c user - readProfile 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c user - readProfile 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_userUpdatePsd(params) {
    return new Promise((resolve) => {
      this.create(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c user - updatePsd 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c user - updatePsd 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_userSearch({ usernme }) {
    if (!usernme) {
      console.log(
        '%c Error: user - search 接口 缺失参数 usernme %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.load(this.undefined, { usernme })
        .then(({ status, ...data }: any) => {
          console.log('%c user - search 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c user - search 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_authLogin({ username, password }) {
    if (!username) {
      console.log(
        '%c Error: auth - login 接口 缺失参数 username %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!password) {
      console.log(
        '%c Error: auth - login 接口 缺失参数 password %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.create(this.undefined, { username, password })
        .then(({ status, ...data }: any) => {
          console.log('%c auth - login 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c auth - login 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_authRefresh(params) {
    return new Promise((resolve) => {
      this.update(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c auth - refresh 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c auth - refresh 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_authLogout({ refreshTokenExpiresAt }) {
    if (!refreshTokenExpiresAt) {
      console.log(
        '%c Error: auth - logout 接口 缺失参数 refreshTokenExpiresAt %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.create(this.undefined, { refreshTokenExpiresAt })
        .then(({ status, ...data }: any) => {
          console.log('%c auth - logout 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c auth - logout 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_envCreate(params) {
    return new Promise((resolve) => {
      this.create(this.environment, params)
        .then(({ status, ...data }: any) => {
          console.log('%c env - create 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c env - create 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_envUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log(
        '%c Error: env - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.update(this.environment, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c env - update 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c env - update 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_envDelete({ uuid }) {
    if (!uuid) {
      console.log(
        '%c Error: env - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.remove(this.environment, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c env - delete 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c env - delete 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_envLoad({ uuid }) {
    if (!uuid) {
      console.log('%c Error: env - load 接口 缺失参数 uuid %c', ErrorStyle, '')
      return
    }

    return new Promise((resolve) => {
      this.load(this.environment, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c env - load 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c env - load 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_envSearch({ projectID }) {
    if (!projectID) {
      console.log(
        '%c Error: env - search 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.search(this.environment, { projectID })
        .then(({ status, ...data }: any) => {
          console.log('%c env - search 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c env - search 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_groupCreate(params) {
    return new Promise((resolve) => {
      this.create(this.group, params)
        .then(({ status, ...data }: any) => {
          console.log('%c group - create 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c group - create 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_groupUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log(
        '%c Error: group - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.update(this.group, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c group - update 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c group - update 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_groupBulkUpdate(params) {
    return new Promise((resolve) => {
      this.update(this.group, params)
        .then(({ status, ...data }: any) => {
          console.log('%c group - bulkUpdate 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c group - bulkUpdate 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_groupDelete({ uuid }) {
    if (!uuid) {
      console.log(
        '%c Error: group - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.remove(this.group, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c group - delete 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c group - delete 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_groupLoadAll({ projectID }) {
    if (!projectID) {
      console.log(
        '%c Error: group - loadAll 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.load(this.group, { projectID })
        .then(({ status, ...data }: any) => {
          console.log('%c group - loadAll 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c group - loadAll 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_apiCreate(params) {
    return new Promise((resolve) => {
      this.create(this.apiData, params)
        .then(({ status, ...data }: any) => {
          console.log('%c api - create 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c api - create 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_apiUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log(
        '%c Error: api - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.update(this.apiData, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c api - update 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c api - update 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_apiBulkUpdate(params) {
    return new Promise((resolve) => {
      this.update(this.apiData, params)
        .then(({ status, ...data }: any) => {
          console.log('%c api - bulkUpdate 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c api - bulkUpdate 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_apiDelete({ uuid }) {
    if (!uuid) {
      console.log(
        '%c Error: api - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.remove(this.apiData, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c api - delete 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c api - delete 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_apiLoadApi({ uuid }) {
    if (!uuid) {
      console.log(
        '%c Error: api - loadApi 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.load(this.apiData, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c api - loadApi 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c api - loadApi 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_apiLoadAllByProjectId({ projectID }) {
    if (!projectID) {
      console.log(
        '%c Error: api - LoadAllByProjectID 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.load(this.apiData, { projectID })
        .then(({ status, ...data }: any) => {
          console.log(
            '%c api - LoadAllByProjectID 接口调用成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log(
            '%c api - LoadAllByProjectID 接口调用失败 %c',
            ErrorStyle,
            ''
          )
          resolve([null, error])
        })
    })
  }

  api_testCreate(params) {
    return new Promise((resolve) => {
      this.create(this.apiTestHistory, params)
        .then(({ status, ...data }: any) => {
          console.log('%c test - create 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c test - create 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_testDelete({ uuid }) {
    if (!uuid) {
      console.log(
        '%c Error: test - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.remove(this.apiTestHistory, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c test - delete 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c test - delete 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_testLoadAll({ apiDataID }) {
    if (!apiDataID) {
      console.log(
        '%c Error: test - LoadAll 接口 缺失参数 apiDataID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.load(this.apiTestHistory, { apiDataID })
        .then(({ status, ...data }: any) => {
          console.log('%c test - LoadAll 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c test - LoadAll 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_mockCreate(params) {
    return new Promise((resolve) => {
      this.create(this.mock, params)
        .then(({ status, ...data }: any) => {
          console.log('%c mock - create 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c mock - create 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_mockLoad({ uuid }) {
    if (!uuid) {
      console.log('%c Error: mock - load 接口 缺失参数 uuid %c', ErrorStyle, '')
      return
    }

    return new Promise((resolve) => {
      this.load(this.mock, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c mock - load 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c mock - load 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_mockDelete({ uuid }) {
    if (!uuid) {
      console.log(
        '%c Error: mock - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.remove(this.mock, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c mock - delete 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c mock - delete 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_mockUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log(
        '%c Error: mock - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.update(this.mock, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c mock - update 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c mock - update 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }

  api_mockLoadAll({ apiDataID }) {
    if (!apiDataID) {
      console.log(
        '%c Error: mock - loadAll 接口 缺失参数 apiDataID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.load(this.mock, { apiDataID })
        .then(({ status, ...data }: any) => {
          console.log('%c mock - loadAll 接口调用成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log('%c mock - loadAll 接口调用失败 %c', ErrorStyle, '')
          resolve([null, error])
        })
    })
  }
}
