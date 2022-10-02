import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const ErrorStyle =
  'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;'

const SuccessStyle =
  'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;'

@Injectable({
  providedIn: 'root',
})
export class RemoteService {
  constructor(private http: HttpClient) {}

  api_projectCreate(params) {
    return new Promise((resolve) => {
      this.http.post(`/project`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.put(`/project/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.delete(`/project/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.get(`/project/export`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project - export 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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

  api_workspaceCreate({ title }) {
    if (!title) {
      console.log(
        '%c Error: workspace - create 接口 缺失参数 title %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.post(`/workspace`, { title }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c workspace - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceList({ ...items }) {
    return new Promise((resolve) => {
      this.http
        .get(`/workspace/list`, {
          params: { ...items },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c workspace - list 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, data])
          },
          error: (error) => {
            console.log('%c workspace - list 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_workspaceUpload(params) {
    return new Promise((resolve) => {
      this.http.post(`/workspace/upload`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace - upload 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c workspace - upload 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceEdit({ workspaceID, title }) {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - edit 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!title) {
      console.log(
        '%c Error: workspace - edit 接口 缺失参数 title %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.put(`/workspace/${workspaceID}`, { title }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace - edit 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c workspace - edit 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceDelete({ workspaceID }) {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - delete 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.delete(`/workspace/${workspaceID}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c workspace - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceMember({ workspaceID }) {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - member 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.get(`/workspace/${workspaceID}/member/list`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace - member 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c workspace - member 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceAddMember({ workspaceID, userIDs }) {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - addMember 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!userIDs) {
      console.log(
        '%c Error: workspace - addMember 接口 缺失参数 userIDs %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .post(`/workspace/${workspaceID}/member/add`, { userIDs })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c workspace - addMember 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, data])
          },
          error: (error) => {
            console.log(
              '%c workspace - addMember 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_workspaceRemoveMember({ workspaceID, userIDs }) {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - removeMember 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!userIDs) {
      console.log(
        '%c Error: workspace - removeMember 接口 缺失参数 userIDs %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .delete(`/workspace/${workspaceID}/member/remove`, {
          body: { userIDs },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c workspace - removeMember 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, data])
          },
          error: (error) => {
            console.log(
              '%c workspace - removeMember 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_userUpdateUserProfile(params) {
    return new Promise((resolve) => {
      this.http.put(`/user/profile`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log(
            '%c user - updateUserProfile 接口请求成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log(
            '%c user - updateUserProfile 接口请求失败 %c',
            ErrorStyle,
            ''
          )
          resolve([null, error])
        },
      })
    })
  }

  api_userReadProfile({ ...items }) {
    return new Promise((resolve) => {
      this.http
        .get(`/user/profile`, {
          params: { ...items },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c user - readProfile 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, data])
          },
          error: (error) => {
            console.log('%c user - readProfile 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_userUpdatePsd({ oldPassword, newPassword }) {
    if (!oldPassword) {
      console.log(
        '%c Error: user - updatePsd 接口 缺失参数 oldPassword %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!newPassword) {
      console.log(
        '%c Error: user - updatePsd 接口 缺失参数 newPassword %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.put(`/user/password`, { oldPassword, newPassword }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c user - updatePsd 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c user - updatePsd 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_userSearch({ username }) {
    if (!username) {
      console.log(
        '%c Error: user - search 接口 缺失参数 username %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.get(`/user/${username}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c user - search 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c user - search 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
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
      this.http.post(`/auth/login`, { username, password }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c auth - login 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c auth - login 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_authRefresh(params) {
    return new Promise((resolve) => {
      this.http.put(`/auth/refresh`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c auth - refresh 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c auth - refresh 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_authLogout({ refreshToken }) {
    if (!refreshToken) {
      console.log(
        '%c Error: auth - logout 接口 缺失参数 refreshToken %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.post(`/auth/logout`, { refreshToken }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c auth - logout 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, data])
        },
        error: (error) => {
          console.log('%c auth - logout 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_envCreate(params) {
    return new Promise((resolve) => {
      this.http.post(`/environment`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c env - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.put(`/environment/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c env - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.delete(`/environment/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c env - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.get(`/environment/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c env - load 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
        .get(`/environment`, {
          params: { projectID },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c env - search 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
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
      this.http.post(`/group`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.put(`/group/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.put(`/group/batch`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group - bulkUpdate 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.delete(`/group?uuids=[${uuid}]`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
        .get(`/group`, {
          params: { projectID },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c group - loadAll 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
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
      this.http.post(`/api_data`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.put(`/api_data/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.put(`/api_data/batch`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - bulkUpdate 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.delete(`/api_data?uuids=[${uuid}]`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.get(`/api_data/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - loadApi 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
        .get(`/api_data`, {
          params: { projectID },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c api - LoadAllByProjectID 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
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
      this.http.post(`/api_test_history`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c test - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.delete(`/api_test_history?uuids=[${uuid}]`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c test - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
        .get(`/api_test_history`, {
          params: { apiDataID },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c test - LoadAll 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
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
      this.http.post(`/mock`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.get(`/mock/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock - load 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.delete(`/mock/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
      this.http.put(`/mock/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
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
        .get(`/mock`, {
          params: { apiDataID },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c mock - loadAll 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
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
