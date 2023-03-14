import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from 'pc/browser/src/app/store/state.service';

const ErrorStyle = 'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

const SuccessStyle = 'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

@Injectable({
  providedIn: 'root'
})
export class RemoteService {
  constructor(private http: HttpClient, private store: StoreService) {}

  api_apiDataCreate<T = any>(
    { apiList, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (apiList == null) {
      console.log('%c Error: apiData - create 接口 缺失参数 apiList %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 apiList' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: apiData - create 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/api`, { apiList, projectUuid, workSpaceUuid }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c apiData:create - api_apiDataCreate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c apiData:create - api_apiDataCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_apiDataUpdate<T = any>(
    { api, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (api == null) {
      console.log('%c Error: apiData - update 接口 缺失参数 api %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 api' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: apiData - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/api/api`, { api, projectUuid, workSpaceUuid }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c apiData:update - api_apiDataUpdate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c apiData:update - api_apiDataUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_apiDataDelete<T = any>(
    { apiUuids, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (apiUuids == null) {
      console.log('%c Error: apiData - delete 接口 缺失参数 apiUuids %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 apiUuids' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: apiData - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/api/remove`, {
          apiUuids,
          projectUuid,
          workSpaceUuid
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c apiData:delete - api_apiDataDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c apiData:delete - api_apiDataDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiDataDetail<T = any>(
    { apiUuids, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items },
    prefix = ''
  ) {
    if (apiUuids == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 apiUuids %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 apiUuids' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/api`, {
          params: { apiUuids, projectUuid, workSpaceUuid, ...items }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c apiData:detail - api_apiDataDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c apiData:detail - api_apiDataDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiDataList<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: apiData - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/api/list`, {
          params: { projectUuid, workSpaceUuid, ...items }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c apiData:list - api_apiDataList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c apiData:list - api_apiDataList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiDataGetGroup<T = any>({ projectUuid = this.store.getCurrentProjectID }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: apiData - getGroup 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'getGroup 接口 缺失参数 projectUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/projects/collections`, { projectUuid }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c apiData:getGroup - api_apiDataGetGroup 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c apiData:getGroup - api_apiDataGetGroup 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_mockCreate<T = any>(
    {
      name,
      apiUuid,
      createWay,
      response,
      projectUuid = this.store.getCurrentProjectID,
      workSpaceUuid = this.store.getCurrentWorkspaceUuid,
      ...items
    },
    prefix = ''
  ) {
    if (name == null) {
      console.log('%c Error: mock - create 接口 缺失参数 name %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 name' }];
    }
    if (apiUuid == null) {
      console.log('%c Error: mock - create 接口 缺失参数 apiUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 apiUuid' }];
    }
    if (createWay == null) {
      console.log('%c Error: mock - create 接口 缺失参数 createWay %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 createWay' }];
    }
    if (response == null) {
      console.log('%c Error: mock - create 接口 缺失参数 response %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 response' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - create 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/mock`, {
          name,
          apiUuid,
          createWay,
          response,
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c mock:create - api_mockCreate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c mock:create - api_mockCreate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_mockUpdate<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: mock - update 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/api/mock`, { id, projectUuid, workSpaceUuid, ...items }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c mock:update - api_mockUpdate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c mock:update - api_mockUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_mockList<T = any>(
    { apiUuid, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, page, pageSize },
    prefix = ''
  ) {
    if (apiUuid == null) {
      console.log('%c Error: mock - list 接口 缺失参数 apiUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 apiUuid' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 workSpaceUuid' }];
    }
    if (page == null) {
      console.log('%c Error: mock - list 接口 缺失参数 page %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 page' }];
    }
    if (pageSize == null) {
      console.log('%c Error: mock - list 接口 缺失参数 pageSize %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 pageSize' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/mock/list`, {
          params: { apiUuid, projectUuid, workSpaceUuid, page, pageSize }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c mock:list - api_mockList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c mock:list - api_mockList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_mockDetail<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: mock - detail 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/mock`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c mock:detail - api_mockDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c mock:detail - api_mockDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_mockDelete<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: mock - delete 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: mock - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: mock - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/mock`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c mock:delete - api_mockDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c mock:delete - api_mockDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_groupCreate<T = any>(params, prefix = '') {
    if (params == null) {
      console.log('%c Error: group - create 接口 缺失参数  %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 ' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/group`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c group:create - api_groupCreate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c group:create - api_groupCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_groupUpdate<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: group - update 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: group - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .put(`${prefix}/api/group`, {
          id,
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c group:update - api_groupUpdate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c group:update - api_groupUpdate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_groupDelete<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: group - delete 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: group - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/group`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c group:delete - api_groupDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c group:delete - api_groupDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_groupDetail<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: group - detail 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: group - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/group`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c group:detail - api_groupDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c group:detail - api_groupDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_groupList<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, withItem = true },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: group - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 workSpaceUuid' }];
    }
    if (withItem == null) {
      console.log('%c Error: group - list 接口 缺失参数 withItem %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 withItem' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/group/list`, {
          params: { projectUuid, workSpaceUuid, withItem }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c group:list - api_groupList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c group:list - api_groupList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiTestHistoryCreate<T = any>(
    {
      apiUuid,
      general,
      request,
      response,
      projectUuid = this.store.getCurrentProjectID,
      workSpaceUuid = this.store.getCurrentWorkspaceUuid
    },
    prefix = ''
  ) {
    if (apiUuid == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 apiUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 apiUuid' }];
    }
    if (general == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 general %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 general' }];
    }
    if (request == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 request %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 request' }];
    }
    if (response == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 response %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 response' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/api/history`, {
          apiUuid,
          general,
          request,
          response,
          projectUuid,
          workSpaceUuid
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c apiTestHistory:create - api_apiTestHistoryCreate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c apiTestHistory:create - api_apiTestHistoryCreate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiTestHistoryList<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, page, pageSize },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 workSpaceUuid' }];
    }
    if (page == null) {
      console.log('%c Error: apiTestHistory - list 接口 缺失参数 page %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 page' }];
    }
    if (pageSize == null) {
      console.log('%c Error: apiTestHistory - list 接口 缺失参数 pageSize %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 pageSize' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/api/history/list`, {
          params: { projectUuid, workSpaceUuid, page, pageSize }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c apiTestHistory:list - api_apiTestHistoryList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c apiTestHistory:list - api_apiTestHistoryList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiTestHistoryDetail<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: apiTestHistory - detail 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/api/history`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c apiTestHistory:detail - api_apiTestHistoryDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c apiTestHistory:detail - api_apiTestHistoryDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_apiTestHistoryDelete<T = any>(
    { ids, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (ids == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 ids %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 ids' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/api/history/batch-delete`, {
          ids,
          projectUuid,
          workSpaceUuid
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c apiTestHistory:delete - api_apiTestHistoryDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c apiTestHistory:delete - api_apiTestHistoryDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentCreate<T = any>(
    { name, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items },
    prefix = ''
  ) {
    if (name == null) {
      console.log('%c Error: environment - create 接口 缺失参数 name %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 name' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: environment - create 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/environment`, {
          name,
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c environment:create - api_environmentCreate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c environment:create - api_environmentCreate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentUpdate<T = any>(
    { id, name, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: environment - update 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 id' }];
    }
    if (name == null) {
      console.log('%c Error: environment - update 接口 缺失参数 name %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 name' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: environment - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .put(`${prefix}/api/environment`, {
          id,
          name,
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c environment:update - api_environmentUpdate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c environment:update - api_environmentUpdate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentDelete<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: environment - delete 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: environment - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'delete 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/environment`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c environment:delete - api_environmentDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c environment:delete - api_environmentDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentDetail<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: environment - detail 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: environment - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'detail 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/environment`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c environment:detail - api_environmentDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c environment:detail - api_environmentDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_environmentList<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: environment - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/environment/list`, {
          params: { projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c environment:list - api_environmentList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
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
      this.http.post(`${prefix}/usercenter/common/user/info`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c user:readInfo - api_userReadInfo 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
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
      this.http.post(`${prefix}/usercenter/common/user/update-userinfo`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c user:updateInfo - api_userUpdateInfo 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c user:updateInfo - api_userUpdateInfo 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userUpdatePassword<T = any>({ password }, prefix = '') {
    if (password == null) {
      console.log('%c Error: user - updatePassword 接口 缺失参数 password %c', ErrorStyle, '');
      return [null, { message: 'updatePassword 接口 缺失参数 password' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/api/user/password`, { password }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c user:updatePassword - api_userUpdatePassword 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
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
      return [null, { message: 'login 接口 缺失参数 username' }];
    }
    if (password == null) {
      console.log('%c Error: user - login 接口 缺失参数 password %c', ErrorStyle, '');
      return [null, { message: 'login 接口 缺失参数 password' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/user/login`, { username, password }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c user:login - api_userLogin 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
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
      this.http.post(`${prefix}/usercenter/common/sso/refresh`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c user:refreshToken - api_userRefreshToken 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
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
      this.http.post(`${prefix}/usercenter/common/sso/logout`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c user:logout - api_userLogout 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
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
      return [null, { message: 'search 接口 缺失参数 username' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/user`, {
          params: { username }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c user:search - api_userSearch 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c user:search - api_userSearch 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_userThirdLogin<T = any>({ type, client, redirectUri, appType, ...items }, prefix = '') {
    if (type == null) {
      console.log('%c Error: user - thirdLogin 接口 缺失参数 type %c', ErrorStyle, '');
      return [null, { message: 'thirdLogin 接口 缺失参数 type' }];
    }
    if (client == null) {
      console.log('%c Error: user - thirdLogin 接口 缺失参数 client %c', ErrorStyle, '');
      return [null, { message: 'thirdLogin 接口 缺失参数 client' }];
    }
    if (redirectUri == null) {
      console.log('%c Error: user - thirdLogin 接口 缺失参数 redirectUri %c', ErrorStyle, '');
      return [null, { message: 'thirdLogin 接口 缺失参数 redirectUri' }];
    }
    if (appType == null) {
      console.log('%c Error: user - thirdLogin 接口 缺失参数 appType %c', ErrorStyle, '');
      return [null, { message: 'thirdLogin 接口 缺失参数 appType' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/usercenter/common/third-party/uri`, {
          type,
          client,
          redirectUri,
          appType,
          ...items
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c user:thirdLogin - api_userThirdLogin 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c user:thirdLogin - api_userThirdLogin 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_userThirdLoginResult<T = any>({ code }, prefix = '') {
    if (code == null) {
      console.log('%c Error: user - thirdLoginResult 接口 缺失参数 code %c', ErrorStyle, '');
      return [null, { message: 'thirdLoginResult 接口 缺失参数 code' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/usercenter/common/third-party/login-check`, { code }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c user:thirdLoginResult - api_userThirdLoginResult 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c user:thirdLoginResult - api_userThirdLoginResult 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userGetToken<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.get(`${prefix}/api/user/access-token`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c user:getToken - api_userGetToken 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c user:getToken - api_userGetToken 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userResetToken<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/user/access-token/reset`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c user:resetToken - api_userResetToken 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c user:resetToken - api_userResetToken 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceCreate<T = any>({ titles }, prefix = '') {
    if (titles == null) {
      console.log('%c Error: workspace - create 接口 缺失参数 titles %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 titles' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/workspaces`, { titles }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c workspace:create - api_workspaceCreate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c workspace:create - api_workspaceCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceUpdate<T = any>({ title, workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (title == null) {
      console.log('%c Error: workspace - update 接口 缺失参数 title %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 title' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/api/workspaces`, { title, workSpaceUuid }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c workspace:update - api_workspaceUpdate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
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
      return [null, { message: 'delete 接口 缺失参数 workSpaceUuids' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/workspaces`, {
          params: { workSpaceUuids }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c workspace:delete - api_workspaceDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c workspace:delete - api_workspaceDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceSearchMember<T = any>({ username, page, pageSize, workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (username == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 username %c', ErrorStyle, '');
      return [null, { message: 'searchMember 接口 缺失参数 username' }];
    }
    if (page == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 page %c', ErrorStyle, '');
      return [null, { message: 'searchMember 接口 缺失参数 page' }];
    }
    if (pageSize == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 pageSize %c', ErrorStyle, '');
      return [null, { message: 'searchMember 接口 缺失参数 pageSize' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'searchMember 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/workspaces/users`, {
          params: { username, page, pageSize, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c workspace:searchMember - api_workspaceSearchMember 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c workspace:searchMember - api_workspaceSearchMember 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceAddMember<T = any>({ userIds, workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (userIds == null) {
      console.log('%c Error: workspace - addMember 接口 缺失参数 userIds %c', ErrorStyle, '');
      return [null, { message: 'addMember 接口 缺失参数 userIds' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - addMember 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'addMember 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/workspaces/users`, { userIds, workSpaceUuid }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c workspace:addMember - api_workspaceAddMember 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c workspace:addMember - api_workspaceAddMember 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceRemoveMember<T = any>({ userIds, workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (userIds == null) {
      console.log('%c Error: workspace - removeMember 接口 缺失参数 userIds %c', ErrorStyle, '');
      return [null, { message: 'removeMember 接口 缺失参数 userIds' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - removeMember 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'removeMember 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/workspaces/users`, {
          params: { userIds, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c workspace:removeMember - api_workspaceRemoveMember 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c workspace:removeMember - api_workspaceRemoveMember 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceMemberQuit<T = any>({ workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - memberQuit 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'memberQuit 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/workspaces/users/quit`, {
          params: { workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c workspace:memberQuit - api_workspaceMemberQuit 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c workspace:memberQuit - api_workspaceMemberQuit 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceAddMemberRole<T = any>({ userRole, workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (userRole == null) {
      console.log('%c Error: workspace - addMemberRole 接口 缺失参数 userRole %c', ErrorStyle, '');
      return [null, { message: 'addMemberRole 接口 缺失参数 userRole' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - addMemberRole 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'addMemberRole 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/workspaces/users/roles`, {
          userRole,
          workSpaceUuid
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c workspace:addMemberRole - api_workspaceAddMemberRole 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c workspace:addMemberRole - api_workspaceAddMemberRole 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceGetMemberPermiss<T = any>({ workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - getMemberPermiss 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'getMemberPermiss 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/workspaces/users/roles`, {
          params: { workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c workspace:getMemberPermiss - api_workspaceGetMemberPermiss 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
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
      this.http.get(`${prefix}/api/workspaces`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c workspace:list - api_workspaceList 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c workspace:list - api_workspaceList 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceRoles<T = any>({ workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - roles 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'roles 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/workspaces/users/roles`, {
          params: { workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c workspace:roles - api_workspaceRoles 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c workspace:roles - api_workspaceRoles 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceSetRole<T = any>({ userRole, workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (userRole == null) {
      console.log('%c Error: workspace - setRole 接口 缺失参数 userRole %c', ErrorStyle, '');
      return [null, { message: 'setRole 接口 缺失参数 userRole' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - setRole 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'setRole 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/workspaces/users/roles`, {
          userRole,
          workSpaceUuid
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c workspace:setRole - api_workspaceSetRole 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c workspace:setRole - api_workspaceSetRole 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectExportProject<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: project - exportProject 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'exportProject 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - exportProject 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'exportProject 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/projects/exports`, {
          params: { projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:exportProject - api_projectExportProject 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:exportProject - api_projectExportProject 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectMemberList<T = any>({ username, projectUuid = this.store.getCurrentProjectID }, prefix = '') {
    if (username == null) {
      console.log('%c Error: project - memberList 接口 缺失参数 username %c', ErrorStyle, '');
      return [null, { message: 'memberList 接口 缺失参数 username' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: project - memberList 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'memberList 接口 缺失参数 projectUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/projects/users`, {
          params: { username, projectUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:memberList - api_projectMemberList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:memberList - api_projectMemberList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectAddMember<T = any>({ userIds, projectUuid = this.store.getCurrentProjectID }, prefix = '') {
    if (userIds == null) {
      console.log('%c Error: project - addMember 接口 缺失参数 userIds %c', ErrorStyle, '');
      return [null, { message: 'addMember 接口 缺失参数 userIds' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: project - addMember 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'addMember 接口 缺失参数 projectUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/projects/users`, { userIds, projectUuid }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c project:addMember - api_projectAddMember 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c project:addMember - api_projectAddMember 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectDelMember<T = any>({ userIds, projectUuid = this.store.getCurrentProjectID }, prefix = '') {
    if (userIds == null) {
      console.log('%c Error: project - delMember 接口 缺失参数 userIds %c', ErrorStyle, '');
      return [null, { message: 'delMember 接口 缺失参数 userIds' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: project - delMember 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'delMember 接口 缺失参数 projectUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/projects/users`, {
          params: { userIds, projectUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:delMember - api_projectDelMember 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:delMember - api_projectDelMember 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectMemberQuit<T = any>({ userId, projectUuid = this.store.getCurrentProjectID }, prefix = '') {
    if (userId == null) {
      console.log('%c Error: project - memberQuit 接口 缺失参数 userId %c', ErrorStyle, '');
      return [null, { message: 'memberQuit 接口 缺失参数 userId' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: project - memberQuit 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'memberQuit 接口 缺失参数 projectUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/projects/users/quit`, {
          params: { userId, projectUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:memberQuit - api_projectMemberQuit 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:memberQuit - api_projectMemberQuit 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectSetRole<T = any>({ projectUuid = this.store.getCurrentProjectID, userRole }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - setRole 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'setRole 接口 缺失参数 projectUuid' }];
    }
    if (userRole == null) {
      console.log('%c Error: project - setRole 接口 缺失参数 userRole %c', ErrorStyle, '');
      return [null, { message: 'setRole 接口 缺失参数 userRole' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/projects/users/roles`, { projectUuid, userRole }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c project:setRole - api_projectSetRole 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c project:setRole - api_projectSetRole 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectGetRole<T = any>({ projectUuid = this.store.getCurrentProjectID }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - getRole 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'getRole 接口 缺失参数 projectUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/projects/users/roles/own`, {
          params: { projectUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:getRole - api_projectGetRole 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:getRole - api_projectGetRole 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectUserPermission<T = any>({ projectUuid = this.store.getCurrentProjectID }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - userPermission 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'userPermission 接口 缺失参数 projectUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/projects/users/roles`, {
          params: { projectUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:userPermission - api_projectUserPermission 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:userPermission - api_projectUserPermission 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectCreate<T = any>({ projectMsgs, workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (projectMsgs == null) {
      console.log('%c Error: project - create 接口 缺失参数 projectMsgs %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 projectMsgs' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'create 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/projects`, { projectMsgs, workSpaceUuid }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c project:create - api_projectCreate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c project:create - api_projectCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectList<T = any>({ projectUuids, workSpaceUuid = this.store.getCurrentWorkspaceUuid }, prefix = '') {
    if (projectUuids == null) {
      console.log('%c Error: project - list 接口 缺失参数 projectUuids %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 projectUuids' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'list 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/projects`, {
          params: { projectUuids, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:list - api_projectList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:list - api_projectList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectUpdate<T = any>({ projectUuid = this.store.getCurrentProjectID, name, description }, prefix = '') {
    if (projectUuid == null) {
      console.log('%c Error: project - update 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 projectUuid' }];
    }
    if (name == null) {
      console.log('%c Error: project - update 接口 缺失参数 name %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 name' }];
    }
    if (description == null) {
      console.log('%c Error: project - update 接口 缺失参数 description %c', ErrorStyle, '');
      return [null, { message: 'update 接口 缺失参数 description' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.put(`${prefix}/api/projects`, { projectUuid, name, description }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c project:update - api_projectUpdate 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
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
      return [null, { message: 'delete 接口 缺失参数 projectUuids' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/projects`, {
          params: { projectUuids }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:delete - api_projectDelete 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:delete - api_projectDelete 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectImport<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/projects/import`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c project:import - api_projectImport 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c project:import - api_projectImport 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectCreateSyncSetting<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: project - createSyncSetting 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'createSyncSetting 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - createSyncSetting 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'createSyncSetting 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/project/sync-setting`, {
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:createSyncSetting - api_projectCreateSyncSetting 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:createSyncSetting - api_projectCreateSyncSetting 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectUpdateSyncSetting<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: project - updateSyncSetting 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'updateSyncSetting 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - updateSyncSetting 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'updateSyncSetting 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .put(`${prefix}/api/project/sync-setting`, {
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:updateSyncSetting - api_projectUpdateSyncSetting 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:updateSyncSetting - api_projectUpdateSyncSetting 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectDelSyncSetting<T = any>(
    { id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (id == null) {
      console.log('%c Error: project - delSyncSetting 接口 缺失参数 id %c', ErrorStyle, '');
      return [null, { message: 'delSyncSetting 接口 缺失参数 id' }];
    }
    if (projectUuid == null) {
      console.log('%c Error: project - delSyncSetting 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'delSyncSetting 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - delSyncSetting 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'delSyncSetting 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/project/sync-setting`, {
          params: { id, projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:delSyncSetting - api_projectDelSyncSetting 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:delSyncSetting - api_projectDelSyncSetting 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectGetSyncSettingList<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: project - getSyncSettingList 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'getSyncSettingList 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - getSyncSettingList 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'getSyncSettingList 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/project/sync-setting/list`, {
          params: { projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:getSyncSettingList - api_projectGetSyncSettingList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:getSyncSettingList - api_projectGetSyncSettingList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectSyncBatchUpdate<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: project - syncBatchUpdate 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'syncBatchUpdate 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - syncBatchUpdate 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'syncBatchUpdate 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .post(`${prefix}/api/api/batch-update`, {
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c project:syncBatchUpdate - api_projectSyncBatchUpdate 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c project:syncBatchUpdate - api_projectSyncBatchUpdate 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_roleList<T = any>(params, prefix = '') {
    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.get(`${prefix}/api/roles`, params).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c role:list - api_roleList 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c role:list - api_roleList 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectShareCreateShare<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: projectShare - createShare 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'createShare 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: projectShare - createShare 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'createShare 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http.post(`${prefix}/api/project-shared`, { projectUuid, workSpaceUuid }).subscribe({
        next: ({ code, data, message }: any) => {
          if (code === 0) {
            console.log('%c projectShare:createShare - api_projectShareCreateShare 接口请求成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          console.log('Error: ', message);
          resolve([null, { code, message, data }]);
        },
        error: error => {
          console.log('%c projectShare:createShare - api_projectShareCreateShare 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectShareGetShareLink<T = any>(
    { projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid },
    prefix = ''
  ) {
    if (projectUuid == null) {
      console.log('%c Error: projectShare - getShareLink 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return [null, { message: 'getShareLink 接口 缺失参数 projectUuid' }];
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: projectShare - getShareLink 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return [null, { message: 'getShareLink 接口 缺失参数 workSpaceUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api//project-shared`, {
          params: { projectUuid, workSpaceUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c projectShare:getShareLink - api_projectShareGetShareLink 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c projectShare:getShareLink - api_projectShareGetShareLink 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectShareDeleteShare<T = any>({ sharedUuid }, prefix = '') {
    if (sharedUuid == null) {
      console.log('%c Error: projectShare - deleteShare 接口 缺失参数 sharedUuid %c', ErrorStyle, '');
      return [null, { message: 'deleteShare 接口 缺失参数 sharedUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .delete(`${prefix}/api/project-shared`, {
          params: { sharedUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c projectShare:deleteShare - api_projectShareDeleteShare 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c projectShare:deleteShare - api_projectShareDeleteShare 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_shareProjectDetail<T = any>({ sharedUuid }, prefix = '') {
    if (sharedUuid == null) {
      console.log('%c Error: share - projectDetail 接口 缺失参数 sharedUuid %c', ErrorStyle, '');
      return [null, { message: 'projectDetail 接口 缺失参数 sharedUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/project-shared/project`, {
          params: { sharedUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c share:projectDetail - api_shareProjectDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c share:projectDetail - api_shareProjectDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_shareGroupList<T = any>({ sharedUuid, withItem = true }, prefix = '') {
    if (sharedUuid == null) {
      console.log('%c Error: share - groupList 接口 缺失参数 sharedUuid %c', ErrorStyle, '');
      return [null, { message: 'groupList 接口 缺失参数 sharedUuid' }];
    }
    if (withItem == null) {
      console.log('%c Error: share - groupList 接口 缺失参数 withItem %c', ErrorStyle, '');
      return [null, { message: 'groupList 接口 缺失参数 withItem' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/project-shared/group/list`, {
          params: { sharedUuid, withItem }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c share:groupList - api_shareGroupList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c share:groupList - api_shareGroupList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_shareApiDataDetail<T = any>({ apiUuids, sharedUuid, ...items }, prefix = '') {
    if (apiUuids == null) {
      console.log('%c Error: share - apiDataDetail 接口 缺失参数 apiUuids %c', ErrorStyle, '');
      return [null, { message: 'apiDataDetail 接口 缺失参数 apiUuids' }];
    }
    if (sharedUuid == null) {
      console.log('%c Error: share - apiDataDetail 接口 缺失参数 sharedUuid %c', ErrorStyle, '');
      return [null, { message: 'apiDataDetail 接口 缺失参数 sharedUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/project-shared/api/list`, {
          params: { apiUuids, sharedUuid, ...items }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c share:apiDataDetail - api_shareApiDataDetail 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c share:apiDataDetail - api_shareApiDataDetail 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_shareEnvironmentList<T = any>({ sharedUuid }, prefix = '') {
    if (sharedUuid == null) {
      console.log('%c Error: share - environmentList 接口 缺失参数 sharedUuid %c', ErrorStyle, '');
      return [null, { message: 'environmentList 接口 缺失参数 sharedUuid' }];
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      this.http
        .get(`${prefix}/api/project-shared/env/list`, {
          params: { sharedUuid }
        })
        .subscribe({
          next: ({ code, data, message }: any) => {
            if (code === 0) {
              console.log('%c share:environmentList - api_shareEnvironmentList 接口请求成功 %c', SuccessStyle, '');
              return resolve([data, null]);
            }
            console.log('Error: ', message);
            resolve([null, { code, message, data }]);
          },
          error: error => {
            console.log('%c share:environmentList - api_shareEnvironmentList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }
}
