import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const ErrorStyle =
  'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;'

const SuccessStyle =
  'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;'

@Injectable({
  providedIn: 'root',
})
export default class RemoteService {
  constructor(private http: HttpClient) {}

  api_projectCreate(params) {
    return new Promise((resolve) => {
      this.http.post('/project', params).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c project - create 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c project - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.put('/project/${uuid}', { ...items }).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c project - update 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c project - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.delete('/project/${uuid}', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c project - delete 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c project - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_projectExport(params) {
    return new Promise((resolve) => {
      this.http.get('/project/export', params).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c project - export 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c project - export 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_envCreate(params) {
    return new Promise((resolve) => {
      this.http.post('/environment', params).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c env - create 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c env - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.put('/environment/${uuid}', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c env - update 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c env - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.delete('/environment/${uuid}', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c env - delete 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c env - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_envLoad({ uuid }) {
    if (!uuid) {
      console.log('%c Error: env - load 接口 缺失参数 uuid %c', ErrorStyle, '')
      return
    }

    return new Promise((resolve) => {
      this.http.get('/environment/${uuid}', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c env - load 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c env - load 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http
        .get('/environment', {
          params: { projectID },
        })
        .subscribe({
          next: ({ statusCode, ...data }: any) => {
            console.log('%c env - search 接口请求成功 %c', SuccessStyle, '')
            if (statusCode === 200) {
              return resolve([data, null])
            }
            resolve([null, data])
          },
          error: (error) => {
            console.log('%c env - search 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_groupCreate(params) {
    return new Promise((resolve) => {
      this.http.post('/group', params).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c group - create 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c group - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.put('/group/${uuid}', { ...items }).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c group - update 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c group - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_groupBulkUpdate(params) {
    return new Promise((resolve) => {
      this.http.put('/group/batch', params).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c group - bulkUpdate 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c group - bulkUpdate 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.delete('/group?uuids=[${uuid}]', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c group - delete 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c group - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http
        .get('/group', {
          params: { projectID },
        })
        .subscribe({
          next: ({ statusCode, ...data }: any) => {
            console.log('%c group - loadAll 接口请求成功 %c', SuccessStyle, '')
            if (statusCode === 200) {
              return resolve([data, null])
            }
            resolve([null, data])
          },
          error: (error) => {
            console.log('%c group - loadAll 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_apiCreate(params) {
    return new Promise((resolve) => {
      this.http.post('/api_data', params).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c api - create 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c api - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.put('/api_data/${uuid}', { ...items }).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c api - update 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c api - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_apiBulkUpdate(params) {
    return new Promise((resolve) => {
      this.http.put('/api_data/batch', params).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c api - bulkUpdate 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c api - bulkUpdate 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.delete('/api_data?uuids=[${uuid}]', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c api - delete 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c api - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.get('/api_data/${uuid}', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c api - loadApi 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c api - loadApi 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http
        .get('/api_data', {
          params: { projectID },
        })
        .subscribe({
          next: ({ statusCode, ...data }: any) => {
            console.log(
              '%c api - LoadAllByProjectID 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (statusCode === 200) {
              return resolve([data, null])
            }
            resolve([null, data])
          },
          error: (error) => {
            console.log(
              '%c api - LoadAllByProjectID 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_testCreate(params) {
    return new Promise((resolve) => {
      this.http.post('/api_test_history', params).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c test - create 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c test - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.delete('/api_test_history?uuids=[${uuid}]', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c test - delete 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c test - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http
        .get('/api_test_history', {
          params: { apiDataID },
        })
        .subscribe({
          next: ({ statusCode, ...data }: any) => {
            console.log('%c test - LoadAll 接口请求成功 %c', SuccessStyle, '')
            if (statusCode === 200) {
              return resolve([data, null])
            }
            resolve([null, data])
          },
          error: (error) => {
            console.log('%c test - LoadAll 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_mockCreate(params) {
    return new Promise((resolve) => {
      this.http.post('/mock', params).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c mock - create 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c mock - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_mockLoad({ uuid }) {
    if (!uuid) {
      console.log('%c Error: mock - load 接口 缺失参数 uuid %c', ErrorStyle, '')
      return
    }

    return new Promise((resolve) => {
      this.http.get('/mock/${uuid}', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c mock - load 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c mock - load 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.delete('/mock/${uuid}', {}).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c mock - delete 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c mock - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.put('/mock/${uuid}', { ...items }).subscribe({
        next: ({ statusCode, ...data }: any) => {
          console.log('%c mock - update 接口请求成功 %c', SuccessStyle, '')
          if (statusCode === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c mock - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http
        .get('/mock', {
          params: { apiDataID },
        })
        .subscribe({
          next: ({ statusCode, ...data }: any) => {
            console.log('%c mock - loadAll 接口请求成功 %c', SuccessStyle, '')
            if (statusCode === 200) {
              return resolve([data, null])
            }
            resolve([null, data])
          },
          error: (error) => {
            console.log('%c mock - loadAll 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }
}
