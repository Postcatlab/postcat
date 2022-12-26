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

  api_projectCreate(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.post(`${prefix}/project`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c project - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_projectUpdate({ uuid, ...items }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: project - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.put(`${prefix}/project/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c project - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_projectDelete({ uuid }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: project - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.delete(`${prefix}/project/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c project - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_projectExport(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.get(`${prefix}/project/export`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project - export 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c project - export 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_projectAddMember({ projectID, userIDs }, prefix = '') {
    if (!projectID) {
      console.log(
        '%c Error: project - addMember 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!userIDs) {
      console.log(
        '%c Error: project - addMember 接口 缺失参数 userIDs %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .post(`${prefix}/project/${projectID}/member/add`, { userIDs })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c project - addMember 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c project - addMember 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_projectDelMember({ projectID, userIDs }, prefix = '') {
    if (!projectID) {
      console.log(
        '%c Error: project - delMember 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!userIDs) {
      console.log(
        '%c Error: project - delMember 接口 缺失参数 userIDs %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .delete(`${prefix}/project/${projectID}/member/remove`, {
          body: { userIDs },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c project - delMember 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c project - delMember 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_projectMember({ projectID }, prefix = '') {
    if (!projectID) {
      console.log(
        '%c Error: project - member 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/project/${projectID}/member/list`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c project - member 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c project - member 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_projectMemberQuit({ projectID }, prefix = '') {
    if (!projectID) {
      console.log(
        '%c Error: project - memberQuit 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .post(`${prefix}/project/${projectID}/member/leave`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c project - memberQuit 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c project - memberQuit 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_projectSetRole({ projectID, roleID, memberID }, prefix = '') {
    if (!projectID) {
      console.log(
        '%c Error: project - setRole 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!roleID) {
      console.log(
        '%c Error: project - setRole 接口 缺失参数 roleID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!memberID) {
      console.log(
        '%c Error: project - setRole 接口 缺失参数 memberID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .post(`${prefix}/project/${projectID}/member/setRole`, {
          roleID,
          memberID,
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c project - setRole 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c project - setRole 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_projectRoleList({ projectID }, prefix = '') {
    if (!projectID) {
      console.log(
        '%c Error: project - roleList 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.get(`${prefix}/project/${projectID}/roles`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project - roleList 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c project - roleList 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_projectPermission({ projectID }, prefix = '') {
    if (!projectID) {
      console.log(
        '%c Error: project - permission 接口 缺失参数 projectID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/project/${projectID}/rolePermission`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c project - permission 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c project - permission 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_workspaceCreate({ title }, prefix = '') {
    if (!title) {
      console.log(
        '%c Error: workspace - create 接口 缺失参数 title %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.post(`${prefix}/workspace`, { title }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c workspace - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceList({ ...items }, prefix = '') {
    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/workspace/list`, {
          params: { ...items },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c workspace - list 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c workspace - list 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_workspaceUpload(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.post(`${prefix}/workspace/upload`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace - upload 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c workspace - upload 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceEdit({ workspaceID, title }, prefix = '') {
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
      this.http.put(`${prefix}/workspace/${workspaceID}`, { title }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace - edit 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c workspace - edit 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceDelete({ workspaceID }, prefix = '') {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - delete 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.delete(`${prefix}/workspace/${workspaceID}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c workspace - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceGetInfo({ workspaceID }, prefix = '') {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - getInfo 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.get(`${prefix}/workspace/${workspaceID}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log(
            '%c workspace - getInfo 接口请求成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c workspace - getInfo 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspaceMember({ workspaceID }, prefix = '') {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - member 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/workspace/${workspaceID}/member/list`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c workspace - member 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c workspace - member 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_workspaceSearchMember({ workspaceID, username }, prefix = '') {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - searchMember 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!username) {
      console.log(
        '%c Error: workspace - searchMember 接口 缺失参数 username %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/workspace/${workspaceID}/member/list/${username}`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c workspace - searchMember 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c workspace - searchMember 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_workspaceAddMember({ workspaceID, userIDs }, prefix = '') {
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
        .post(`${prefix}/workspace/${workspaceID}/member/add`, { userIDs })
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
            resolve([null, { status, ...data }])
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

  api_workspaceRemoveMember({ workspaceID, userIDs }, prefix = '') {
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
        .delete(`${prefix}/workspace/${workspaceID}/member/remove`, {
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
            resolve([null, { status, ...data }])
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

  api_workspaceMemberQuit({ workspaceID }, prefix = '') {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - memberQuit 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .post(`${prefix}/workspace/${workspaceID}/member/leave`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c workspace - memberQuit 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c workspace - memberQuit 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_workspaceSetRole({ workspaceID, roleID, memberID }, prefix = '') {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - setRole 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!roleID) {
      console.log(
        '%c Error: workspace - setRole 接口 缺失参数 roleID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!memberID) {
      console.log(
        '%c Error: workspace - setRole 接口 缺失参数 memberID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .post(`${prefix}/workspace/${workspaceID}/member/setRole`, {
          roleID,
          memberID,
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c workspace - setRole 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c workspace - setRole 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_workspaceRoleList({ workspaceID }, prefix = '') {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - roleList 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.get(`${prefix}/workspace/${workspaceID}/roles`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log(
            '%c workspace - roleList 接口请求成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c workspace - roleList 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_workspacePermission({ workspaceID }, prefix = '') {
    if (!workspaceID) {
      console.log(
        '%c Error: workspace - permission 接口 缺失参数 workspaceID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/workspace/${workspaceID}/rolePermission`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c workspace - permission 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c workspace - permission 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_shareCreateShare(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.post(`${prefix}/shared`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log(
            '%c share - createShare 接口请求成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c share - createShare 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_shareGetShareList(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.get(`${prefix}/shared`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log(
            '%c share - getShareList 接口请求成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c share - getShareList 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_shareDeleteShare(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.delete(`${prefix}/shared`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log(
            '%c share - deleteShare 接口请求成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c share - deleteShare 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_shareDocGetAllApi({ uniqueID }, prefix = '') {
    if (!uniqueID) {
      console.log(
        '%c Error: shareDoc - getAllAPI 接口 缺失参数 uniqueID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/shared-docs/${uniqueID}/collections`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c shareDoc - getAllAPI 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c shareDoc - getAllAPI 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_shareDocGetApiDetail({ uniqueID, apiDataUUID }, prefix = '') {
    if (!uniqueID) {
      console.log(
        '%c Error: shareDoc - getApiDetail 接口 缺失参数 uniqueID %c',
        ErrorStyle,
        ''
      )
      return
    }
    if (!apiDataUUID) {
      console.log(
        '%c Error: shareDoc - getApiDetail 接口 缺失参数 apiDataUUID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/shared-docs/${uniqueID}/api/${apiDataUUID}`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c shareDoc - getApiDetail 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log(
              '%c shareDoc - getApiDetail 接口请求失败 %c',
              ErrorStyle,
              ''
            )
            resolve([null, error])
          },
        })
    })
  }

  api_shareDocGetEnv({ uniqueID }, prefix = '') {
    if (!uniqueID) {
      console.log(
        '%c Error: shareDoc - getEnv 接口 缺失参数 uniqueID %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/shared-docs/${uniqueID}/environments`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log(
              '%c shareDoc - getEnv 接口请求成功 %c',
              SuccessStyle,
              ''
            )
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c shareDoc - getEnv 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_userUpdateUserProfile(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.put(`${prefix}/user/profile`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log(
            '%c user - updateUserProfile 接口请求成功 %c',
            SuccessStyle,
            ''
          )
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
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

  api_userReadProfile({ ...items }, prefix = '') {
    return new Promise((resolve) => {
      this.http
        .get(`${prefix}/user/profile`, {
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
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c user - readProfile 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_userUpdatePsd({ newPassword }, prefix = '') {
    if (!newPassword) {
      console.log(
        '%c Error: user - updatePsd 接口 缺失参数 newPassword %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.put(`${prefix}/user/password`, { newPassword }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c user - updatePsd 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c user - updatePsd 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_userSearch({ username }, prefix = '') {
    if (!username) {
      console.log(
        '%c Error: user - search 接口 缺失参数 username %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.get(`${prefix}/user/${username}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c user - search 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c user - search 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_authLogin({ username, password }, prefix = '') {
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
      this.http.post(`${prefix}/auth/login`, { username, password }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c auth - login 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c auth - login 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_authRefresh(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.put(`${prefix}/auth/refresh`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c auth - refresh 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c auth - refresh 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_authLogout({ refreshToken }, prefix = '') {
    if (!refreshToken) {
      console.log(
        '%c Error: auth - logout 接口 缺失参数 refreshToken %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.post(`${prefix}/auth/logout`, { refreshToken }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c auth - logout 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c auth - logout 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_envCreate(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.post(`${prefix}/environment`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c env - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c env - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_envUpdate({ uuid, ...items }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: env - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.put(`${prefix}/environment/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c env - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c env - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_envDelete({ uuid }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: env - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.delete(`${prefix}/environment/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c env - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c env - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_envLoad({ uuid }, prefix = '') {
    if (!uuid) {
      console.log('%c Error: env - load 接口 缺失参数 uuid %c', ErrorStyle, '')
      return
    }

    return new Promise((resolve) => {
      this.http.get(`${prefix}/environment/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c env - load 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c env - load 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_envSearch({ projectID }, prefix = '') {
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
        .get(`${prefix}/environment`, {
          params: { projectID },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c env - search 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c env - search 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_groupCreate(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.post(`${prefix}/group`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c group - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_groupUpdate({ uuid, ...items }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: group - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.put(`${prefix}/group/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c group - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_groupBulkUpdate(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.put(`${prefix}/group/batch`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group - bulkUpdate 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c group - bulkUpdate 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_groupDelete({ uuid }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: group - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.delete(`${prefix}/group?uuids=[${uuid}]`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c group - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_groupLoadAll({ projectID }, prefix = '') {
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
        .get(`${prefix}/group`, {
          params: { projectID },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c group - loadAll 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c group - loadAll 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_apiCreate(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.post(`${prefix}/api_data`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c api - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_apiUpdate({ uuid, ...items }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: api - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.put(`${prefix}/api_data/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c api - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_apiBulkUpdate(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.put(`${prefix}/api_data/batch`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - bulkUpdate 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c api - bulkUpdate 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_apiDelete({ uuid }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: api - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.delete(`${prefix}/api_data?uuids=[${uuid}]`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c api - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_apiLoadApi({ uuid }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: api - loadApi 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.get(`${prefix}/api_data/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api - loadApi 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c api - loadApi 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_apiLoadAllByProjectId({ projectID }, prefix = '') {
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
        .get(`${prefix}/api_data`, {
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
            resolve([null, { status, ...data }])
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

  api_testCreate(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.post(`${prefix}/api_test_history`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c test - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c test - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_testDelete({ uuid }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: test - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http
        .delete(`${prefix}/api_test_history?uuids=[${uuid}]`, {})
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c test - delete 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c test - delete 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_testLoadAll({ apiDataID }, prefix = '') {
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
        .get(`${prefix}/api_test_history`, {
          params: { apiDataID },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c test - LoadAll 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c test - LoadAll 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_mockCreate(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.post(`${prefix}/mock`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock - create 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c mock - create 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_mockLoad({ uuid }, prefix = '') {
    if (!uuid) {
      console.log('%c Error: mock - load 接口 缺失参数 uuid %c', ErrorStyle, '')
      return
    }

    return new Promise((resolve) => {
      this.http.get(`${prefix}/mock/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock - load 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c mock - load 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_mockDelete({ uuid }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: mock - delete 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.delete(`${prefix}/mock/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock - delete 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c mock - delete 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_mockUpdate({ uuid, ...items }, prefix = '') {
    if (!uuid) {
      console.log(
        '%c Error: mock - update 接口 缺失参数 uuid %c',
        ErrorStyle,
        ''
      )
      return
    }

    return new Promise((resolve) => {
      this.http.put(`${prefix}/mock/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock - update 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c mock - update 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }

  api_mockLoadAll({ apiDataID }, prefix = '') {
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
        .get(`${prefix}/mock`, {
          params: { apiDataID },
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c mock - loadAll 接口请求成功 %c', SuccessStyle, '')
            if (status === 200) {
              return resolve([data, null])
            }
            resolve([null, { status, ...data }])
          },
          error: (error) => {
            console.log('%c mock - loadAll 接口请求失败 %c', ErrorStyle, '')
            resolve([null, error])
          },
        })
    })
  }

  api_systemStatus(params, prefix = '') {
    return new Promise((resolve) => {
      this.http.get(`${prefix}/system/status`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c system - status 接口请求成功 %c', SuccessStyle, '')
          if (status === 200) {
            return resolve([data, null])
          }
          resolve([null, { status, ...data }])
        },
        error: (error) => {
          console.log('%c system - status 接口请求失败 %c', ErrorStyle, '')
          resolve([null, error])
        },
      })
    })
  }
}
