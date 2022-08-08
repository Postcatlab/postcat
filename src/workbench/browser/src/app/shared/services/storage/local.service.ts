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

  api_projectCreate(params) {
    return new Promise((resolve) => {
      this.create(this.project, params)
        .then(({ statusCode, ...data }: any) => {
          console.log('%c project - create 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c project - update 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c project - delete 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c project - export 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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

  api_envCreate(params) {
    return new Promise((resolve) => {
      this.create(this.environment, params)
        .then(({ statusCode, ...data }: any) => {
          console.log('%c env - create 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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

  api_envUpdate({ uuid }) {
    if (!uuid) {
      console.log(
        '%c Error: env - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.update(this.environment, { uuid })
        .then(({ statusCode, ...data }: any) => {
          console.log('%c env - update 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c env - delete 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c env - load 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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

  api_envLoadByProjectId({ projectID }) {
    if (!projectID) {
      console.log(
        '%c Error: env - loadByProjectID 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.load(this.environment, { projectID })
        .then(({ statusCode, ...data }: any) => {
          console.log(
            '%c env - loadByProjectID 接口调用成功 %c',
            SuccessStyle,
            ''
          )
          if (statusCode === 0) {
            return resolve([data, null])
          }
          resolve([null, data])
        })
        .catch((error) => {
          console.log(
            '%c env - loadByProjectID 接口调用失败 %c',
            ErrorStyle,
            ''
          )
          resolve([null, error])
        })
    })
  }

  api_groupCreate(params) {
    return new Promise((resolve) => {
      this.create(this.group, params)
        .then(({ statusCode, ...data }: any) => {
          console.log('%c group - create 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c group - update 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c group - bulkUpdate 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c group - delete 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c group - loadAll 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c api - create 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c api - update 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c api - bulkUpdate 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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

  api_apiDelete({ uuids }) {
    if (!uuids) {
      console.log(
        '%c Error: api - delete 接口 缺失参数 uuids %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.remove(this.apiData, { uuids })
        .then(({ statusCode, ...data }: any) => {
          console.log('%c api - delete 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c api - loadApi 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log(
            '%c api - LoadAllByProjectID 接口调用成功 %c',
            SuccessStyle,
            ''
          )
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c test - create 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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

  api_testDelete({ uuids }) {
    if (!uuids) {
      console.log(
        '%c Error: test - delete 接口 缺失参数 uuids %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.remove(this.apiTestHistory, { uuids })
        .then(({ statusCode, ...data }: any) => {
          console.log('%c test - delete 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c test - LoadAll 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c mock - create 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c mock - load 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c mock - delete 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c mock - update 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
        .then(({ statusCode, ...data }: any) => {
          console.log('%c mock - loadAll 接口调用成功 %c', SuccessStyle, '')
          if (statusCode === 0) {
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
