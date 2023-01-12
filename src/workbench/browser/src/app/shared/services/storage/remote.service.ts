import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const ErrorStyle = 'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

const SuccessStyle = 'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

@Injectable({
  providedIn: 'root'
})
export class RemoteService {
  constructor(private http: HttpClient) {}

  api_apiDataCreate<T = any>({ apiList, projectUuid, workSpaceUuid }, prefix = '') {
    if (apiList == null) {
      console.log('%c Error: apiData - create 接口 缺失参数 apiList %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: apiData - create 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api`, { apiList, projectUuid, workSpaceUuid }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiData:create - api_apiDataCreate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c apiData:create - api_apiDataCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_apiDataUpdate<T = any>({ api, projectUuid, workSpaceUuid }, prefix = '') {
    if (api == null) {
      console.log('%c Error: apiData - update 接口 缺失参数 api %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: apiData - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/api`, { api, projectUuid, workSpaceUuid }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiData:update - api_apiDataUpdate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c apiData:update - api_apiDataUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_apiDataDelete<T = any>({ apiUuid, projectUuid, workSpaceUuid }, prefix = '') {
    if (apiUuid == null) {
      console.log('%c Error: apiData - delete 接口 缺失参数 apiUuid %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: apiData - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/remove`, {
          body: { apiUuid, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c apiData:delete - api_apiDataDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c apiData:delete - api_apiDataDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiDataDetail<T = any>({ projectUuid, workSpaceUuid }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api`, {
          params: { projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c apiData:detail - api_apiDataDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c apiData:detail - api_apiDataDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiDataList<T = any>({ api, projectUuid, workSpaceUuid }, prefix = '') {
    if (api == null) {
      console.log('%c Error: apiData - list 接口 缺失参数 api %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: apiData - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/list`, {
          params: { api, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c apiData:list - api_apiDataList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c apiData:list - api_apiDataList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_mockCreate<T = any>({ name, apiUuid, createWay, response, projectUuid, workSpaceUuid, ...items }, prefix = '') {
    if (name == null) {
      console.log('%c Error: mock - create 接口 缺失参数 name %c', ErrorStyle, '');
      return;
    }
    if (apiUuid == null) {
      console.log('%c Error: mock - create 接口 缺失参数 apiUuid %c', ErrorStyle, '');
      return;
    }
    if (createWay == null) {
      console.log('%c Error: mock - create 接口 缺失参数 createWay %c', ErrorStyle, '');
      return;
    }
    if (response == null) {
      console.log('%c Error: mock - create 接口 缺失参数 response %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - create 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/mock`, {
          name,
          apiUuid,
          createWay,
          response,
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c mock:create - api_mockCreate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c mock:create - api_mockCreate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_mockUpdate<T = any>({ id, projectUuid, workSpaceUuid, ...items }, prefix = '') {
    if (id == null) {
      console.log('%c Error: mock - update 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/mock`, { id, projectUuid, workSpaceUuid, ...items }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c mock:update - api_mockUpdate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c mock:update - api_mockUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_mockList<T = any>({ apiUuid, projectUuid, workSpaceUuid, page, pageSize }, prefix = '') {
    if (apiUuid == null) {
      console.log('%c Error: mock - list 接口 缺失参数 apiUuid %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }
    if (page == null) {
      console.log('%c Error: mock - list 接口 缺失参数 page %c', ErrorStyle, '');
      return;
    }
    if (pageSize == null) {
      console.log('%c Error: mock - list 接口 缺失参数 pageSize %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/mock/list`, {
          params: { apiUuid, projectUuid, workSpaceUuid, page, pageSize }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c mock:list - api_mockList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c mock:list - api_mockList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_mockDetail<T = any>({ id, projectUuid, workSpaceUuid }, prefix = '') {
    if (id == null) {
      console.log('%c Error: mock - detail 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/mock`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c mock:detail - api_mockDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c mock:detail - api_mockDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_mockDelete<T = any>({ id, projectUuid, workSpaceUuid }, prefix = '') {
    if (id == null) {
      console.log('%c Error: mock - delete 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/mock`, {
          body: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c mock:delete - api_mockDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c mock:delete - api_mockDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_groupCreate<T = any>({ module, type, name, projectUuid, workSpaceUuid, ...items }, prefix = '') {
    if (module == null) {
      console.log('%c Error: group - create 接口 缺失参数 module %c', ErrorStyle, '');
      return;
    }
    if (type == null) {
      console.log('%c Error: group - create 接口 缺失参数 type %c', ErrorStyle, '');
      return;
    }
    if (name == null) {
      console.log('%c Error: group - create 接口 缺失参数 name %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: group - create 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/group`, {
          module,
          type,
          name,
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c group:create - api_groupCreate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c group:create - api_groupCreate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_groupUpdate<T = any>({ id, projectUuid, workSpaceUuid, ...items }, prefix = '') {
    if (id == null) {
      console.log('%c Error: group - update 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: group - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/group`, { id, projectUuid, workSpaceUuid, ...items }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c group:update - api_groupUpdate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c group:update - api_groupUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_groupDelete<T = any>({ id, projectUuid, workSpaceUuid }, prefix = '') {
    if (id == null) {
      console.log('%c Error: group - delete 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: group - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/group`, {
          body: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c group:delete - api_groupDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c group:delete - api_groupDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_groupDetail<T = any>({ id, projectUuid, workSpaceUuid }, prefix = '') {
    if (id == null) {
      console.log('%c Error: group - detail 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: group - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/group`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c group:detail - api_groupDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c group:detail - api_groupDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_groupList<T = any>({ projectUuid, workSpaceUuid }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: group - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/group/list`, {
          params: { projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c group:list - api_groupList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c group:list - api_groupList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiTestHistoryCreate<T = any>({ apiUuid, general, request, response, projectUuid, workSpaceUuid }, prefix = '') {
    if (apiUuid == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 apiUuid %c', ErrorStyle, '');
      return;
    }
    if (general == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 general %c', ErrorStyle, '');
      return;
    }
    if (request == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 request %c', ErrorStyle, '');
      return;
    }
    if (response == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 response %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/history`, {
          apiUuid,
          general,
          request,
          response,
          projectUuid,
          workSpaceUuid
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c apiTestHistory:create - api_apiTestHistoryCreate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c apiTestHistory:create - api_apiTestHistoryCreate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiTestHistoryList<T = any>({ apiUuid, projectUuid, workSpaceUuid, page, pageSize }, prefix = '') {
    if (apiUuid == null) {
      console.log('%c Error: apiTestHistory - list 接口 缺失参数 apiUuid %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }
    if (page == null) {
      console.log('%c Error: apiTestHistory - list 接口 缺失参数 page %c', ErrorStyle, '');
      return;
    }
    if (pageSize == null) {
      console.log('%c Error: apiTestHistory - list 接口 缺失参数 pageSize %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/history/list`, {
          params: { apiUuid, projectUuid, workSpaceUuid, page, pageSize }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c apiTestHistory:list - api_apiTestHistoryList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c apiTestHistory:list - api_apiTestHistoryList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiTestHistoryDetail<T = any>({ id, projectUuid, workSpaceUuid }, prefix = '') {
    if (id == null) {
      console.log('%c Error: apiTestHistory - detail 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/history`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c apiTestHistory:detail - api_apiTestHistoryDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c apiTestHistory:detail - api_apiTestHistoryDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiTestHistoryDelete<T = any>({ projectUuid, workSpaceUuid }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/history`, {
          body: { projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c apiTestHistory:delete - api_apiTestHistoryDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c apiTestHistory:delete - api_apiTestHistoryDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentCreate<T = any>({ name, projectUuid, workSpaceUuid, ...items }, prefix = '') {
    if (name == null) {
      console.log('%c Error: environment - create 接口 缺失参数 name %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: environment - create 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/environment`, {
          name,
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c environment:create - api_environmentCreate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c environment:create - api_environmentCreate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentUpdate<T = any>({ id, name, projectUuid, workSpaceUuid, ...items }, prefix = '') {
    if (id == null) {
      console.log('%c Error: environment - update 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (name == null) {
      console.log('%c Error: environment - update 接口 缺失参数 name %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: environment - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .put(`${prefix}/environment`, {
          id,
          name,
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c environment:update - api_environmentUpdate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c environment:update - api_environmentUpdate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentDelete<T = any>({ id, projectUuid, workSpaceUuid }, prefix = '') {
    if (id == null) {
      console.log('%c Error: environment - delete 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: environment - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/environment`, {
          body: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c environment:delete - api_environmentDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c environment:delete - api_environmentDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentDetail<T = any>({ id, projectUuid, workSpaceUuid }, prefix = '') {
    if (id == null) {
      console.log('%c Error: environment - detail 接口 缺失参数 id %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: environment - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/environment`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c environment:detail - api_environmentDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c environment:detail - api_environmentDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentList<T = any>({ projectUuid, workSpaceUuid }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: environment - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/environment/list`, {
          params: { projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c environment:list - api_environmentList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c environment:list - api_environmentList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_userReadInfo<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/common/user/info`, params).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c user:readInfo - api_userReadInfo 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c user:readInfo - api_userReadInfo 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userUpdateInfo<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/common/user/update-userinfo`, params).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c user:updateInfo - api_userUpdateInfo 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c user:updateInfo - api_userUpdateInfo 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userUpdatePassword<T = any>({ password, ...items }, prefix = '') {
    if (password == null) {
      console.log('%c Error: user - updatePassword 接口 缺失参数 password %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/common/user/change-password`, {
          body: { password, ...items }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c user:updatePassword - api_userUpdatePassword 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c user:updatePassword - api_userUpdatePassword 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_userLogin<T = any>({ username, password }, prefix = '') {
    if (username == null) {
      console.log('%c Error: user - login 接口 缺失参数 username %c', ErrorStyle, '');
      return;
    }
    if (password == null) {
      console.log('%c Error: user - login 接口 缺失参数 password %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/user/login`, {
          body: { username, password }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c user:login - api_userLogin 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c user:login - api_userLogin 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_userRefreshToken<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/common/sso/refresh`, params).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c user:refreshToken - api_userRefreshToken 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c user:refreshToken - api_userRefreshToken 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userLogout<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/common/sso/logout`, params).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c user:logout - api_userLogout 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c user:logout - api_userLogout 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userSearch<T = any>({ username }, prefix = '') {
    if (username == null) {
      console.log('%c Error: user - search 接口 缺失参数 username %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/user`, {
          params: { username }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c user:search - api_userSearch 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c user:search - api_userSearch 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceCreate<T = any>({ titles }, prefix = '') {
    if (titles == null) {
      console.log('%c Error: workspace - create 接口 缺失参数 titles %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/workspaces`, { titles }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c workspace:create - api_workspaceCreate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c workspace:create - api_workspaceCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceUpdate<T = any>({ title, workSpaceUuid }, prefix = '') {
    if (title == null) {
      console.log('%c Error: workspace - update 接口 缺失参数 title %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/workspaces`, { title, workSpaceUuid }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c workspace:update - api_workspaceUpdate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c workspace:update - api_workspaceUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceDelete<T = any>({ workSpaceUuids }, prefix = '') {
    if (workSpaceUuids == null) {
      console.log('%c Error: workspace - delete 接口 缺失参数 workSpaceUuids %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/workspaces`, {
          body: { workSpaceUuids }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c workspace:delete - api_workspaceDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c workspace:delete - api_workspaceDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceSearchMember<T = any>({ username, page, pageSize, workSpaceUuid }, prefix = '') {
    if (username == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 username %c', ErrorStyle, '');
      return;
    }
    if (page == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 page %c', ErrorStyle, '');
      return;
    }
    if (pageSize == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 pageSize %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/workspaces/users`, {
          params: { username, page, pageSize, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c workspace:searchMember - api_workspaceSearchMember 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c workspace:searchMember - api_workspaceSearchMember 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceAddMember<T = any>({ userIds, workSpaceUuid }, prefix = '') {
    if (userIds == null) {
      console.log('%c Error: workspace - addMember 接口 缺失参数 userIds %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - addMember 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/workspaces/users`, { userIds, workSpaceUuid }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c workspace:addMember - api_workspaceAddMember 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c workspace:addMember - api_workspaceAddMember 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceRemoveMember<T = any>({ userIds, workSpaceUuid }, prefix = '') {
    if (userIds == null) {
      console.log('%c Error: workspace - removeMember 接口 缺失参数 userIds %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - removeMember 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/workspaces/users`, {
          body: { userIds, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c workspace:removeMember - api_workspaceRemoveMember 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c workspace:removeMember - api_workspaceRemoveMember 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceMemberQuit<T = any>({ workSpaceUuid }, prefix = '') {
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - memberQuit 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/workspaces/users/quit`, {
          body: { workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c workspace:memberQuit - api_workspaceMemberQuit 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c workspace:memberQuit - api_workspaceMemberQuit 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceAddMemberRole<T = any>({ userRole, workSpaceUuid }, prefix = '') {
    if (userRole == null) {
      console.log('%c Error: workspace - addMemberRole 接口 缺失参数 userRole %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - addMemberRole 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/workspaces/users/roles`, { userRole, workSpaceUuid }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c workspace:addMemberRole - api_workspaceAddMemberRole 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c workspace:addMemberRole - api_workspaceAddMemberRole 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceGetMemberPermiss<T = any>({ workSpaceUuid }, prefix = '') {
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - getMemberPermiss 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/workspaces/users/roles`, {
          params: { workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c workspace:getMemberPermiss - api_workspaceGetMemberPermiss 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c workspace:getMemberPermiss - api_workspaceGetMemberPermiss 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceList<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.get(`${prefix}/workspaces`, params).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c workspace:list - api_workspaceList 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c workspace:list - api_workspaceList 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceUnkown<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.get(`${prefix}/workspaces`, params).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c workspace:unkown - api_workspaceUnkown 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c workspace:unkown - api_workspaceUnkown 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectExportProject<T = any>({ projectUuid }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - exportProject 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/project/exports`, {
          params: { projectUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c project:exportProject - api_projectExportProject 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c project:exportProject - api_projectExportProject 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectExportGroup<T = any>({ projectUuid }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - exportGroup 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/projects/collections`, { projectUuid }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project:exportGroup - api_projectExportGroup 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c project:exportGroup - api_projectExportGroup 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectMemberList<T = any>({ username, projectUuid }, prefix = '') {
    if (username == null) {
      console.log('%c Error: project - memberList 接口 缺失参数 username %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: project - memberList 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/projects/users`, {
          params: { username, projectUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c project:memberList - api_projectMemberList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c project:memberList - api_projectMemberList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectAddMember<T = any>({ userIds, projectUuid }, prefix = '') {
    if (userIds == null) {
      console.log('%c Error: project - addMember 接口 缺失参数 userIds %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: project - addMember 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/projects/users`, { userIds, projectUuid }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project:addMember - api_projectAddMember 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c project:addMember - api_projectAddMember 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectDelMember<T = any>({ userIds, projectUuid }, prefix = '') {
    if (userIds == null) {
      console.log('%c Error: project - delMember 接口 缺失参数 userIds %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: project - delMember 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/projects/users`, {
          params: { userIds, projectUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c project:delMember - api_projectDelMember 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c project:delMember - api_projectDelMember 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectMemberQuit<T = any>({ userId, projectUuid }, prefix = '') {
    if (userId == null) {
      console.log('%c Error: project - memberQuit 接口 缺失参数 userId %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: project - memberQuit 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.delete(`${prefix}/projects/users/quit`, { userId, projectUuid }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project:memberQuit - api_projectMemberQuit 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c project:memberQuit - api_projectMemberQuit 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectSetRole<T = any>({ projectUuid, userRole }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - setRole 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (userRole == null) {
      console.log('%c Error: project - setRole 接口 缺失参数 userRole %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/projects/users/roles`, { projectUuid, userRole }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project:setRole - api_projectSetRole 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c project:setRole - api_projectSetRole 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectUserPermission<T = any>({ projectUuid }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - userPermission 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/projects/users/roles`, {
          params: { projectUuid }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c project:userPermission - api_projectUserPermission 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c project:userPermission - api_projectUserPermission 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectCreate<T = any>({ projectMsgs, workSpaceUuid }, prefix = '') {
    if (projectMsgs == null) {
      console.log('%c Error: project - create 接口 缺失参数 projectMsgs %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/projects`, { projectMsgs, workSpaceUuid }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project:create - api_projectCreate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c project:create - api_projectCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectDetail<T = any>({ projectUuid, workSpaceUuid, page, pageSize }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }
    if (page == null) {
      console.log('%c Error: project - detail 接口 缺失参数 page %c', ErrorStyle, '');
      return;
    }
    if (pageSize == null) {
      console.log('%c Error: project - detail 接口 缺失参数 pageSize %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/projects`, {
          params: { projectUuid, workSpaceUuid, page, pageSize }
        })
        .subscribe({
          next: ({ code, data }: any) => {
            if (code === 0) {
              console.log('%c project:detail - api_projectDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            resolve([null, { code, data }]);
          },
          error: error => {
            console.log('%c project:detail - api_projectDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectUpdate<T = any>({ projectUuid, name, description }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (name == null) {
      console.log('%c Error: project - update 接口 缺失参数 name %c', ErrorStyle, '');
      return;
    }
    if (description == null) {
      console.log('%c Error: project - update 接口 缺失参数 description %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/projects`, { projectUuid, name, description }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project:update - api_projectUpdate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c project:update - api_projectUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectDelete<T = any>({ projectUuids }, prefix = '') {
    if (projectUuids == null) {
      console.log('%c Error: project - delete 接口 缺失参数 projectUuids %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.delete(`${prefix}/projects`, { projectUuids }).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project:delete - api_projectDelete 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c project:delete - api_projectDelete 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareCreateShare<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/shared`, params).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c share:createShare - api_shareCreateShare 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c share:createShare - api_shareCreateShare 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareGetShareList<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.get(`${prefix}/shared`, params).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c share:getShareList - api_shareGetShareList 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c share:getShareList - api_shareGetShareList 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareDeleteShare<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.delete(`${prefix}/shared`, params).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c share:deleteShare - api_shareDeleteShare 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c share:deleteShare - api_shareDeleteShare 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareDocGetAllApi<T = any>({ uniqueID }, prefix = '') {
    if (uniqueID == null) {
      console.log('%c Error: shareDoc - getAllAPI 接口 缺失参数 uniqueID %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.get(`${prefix}/shared-docs/${uniqueID}/collections`, {}).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c shareDoc:getAllAPI - api_shareDocGetAllApi 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c shareDoc:getAllAPI - api_shareDocGetAllApi 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareDocGetApiDetail<T = any>({ uniqueID, apiDataUUID }, prefix = '') {
    if (uniqueID == null) {
      console.log('%c Error: shareDoc - getApiDetail 接口 缺失参数 uniqueID %c', ErrorStyle, '');
      return;
    }
    if (apiDataUUID == null) {
      console.log('%c Error: shareDoc - getApiDetail 接口 缺失参数 apiDataUUID %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.get(`${prefix}/shared-docs/${uniqueID}/api/${apiDataUUID}`, {}).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c shareDoc:getApiDetail - api_shareDocGetApiDetail 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c shareDoc:getApiDetail - api_shareDocGetApiDetail 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareDocGetEnv<T = any>({ uniqueID }, prefix = '') {
    if (uniqueID == null) {
      console.log('%c Error: shareDoc - getEnv 接口 缺失参数 uniqueID %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.get(`${prefix}/shared-docs/${uniqueID}/environments`, {}).subscribe({
        next: ({ code, data }: any) => {
          if (code === 0) {
            console.log('%c shareDoc:getEnv - api_shareDocGetEnv 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          resolve([null, { code, data }]);
        },
        error: error => {
          console.log('%c shareDoc:getEnv - api_shareDocGetEnv 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }
}
