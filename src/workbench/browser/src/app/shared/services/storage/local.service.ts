import { Injectable } from '@angular/core';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { db } from './db';

const ErrorStyle = 'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

const SuccessStyle = 'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  constructor(private store: StoreService) {}

  api_apiDataCreate<T = any>({
    apiList,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid
  }) {
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
      db.apiData
        .bulkCreate({ apiList, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiData - create 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c apiData - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiDataUpdate<T = any>({ api, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
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
      db.apiData
        .update({ api, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiData - update 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c apiData - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiDataDelete<T = any>({
    apiUuids,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid
  }) {
    if (apiUuids == null) {
      console.log('%c Error: apiData - delete 接口 缺失参数 apiUuids %c', ErrorStyle, '');
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
      db.apiData
        .bulkDelete({ apiUuids, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiData - delete 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c apiData - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiDataDetail<T = any>({
    apiUuids,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid,
    ...items
  }) {
    if (apiUuids == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 apiUuids %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.apiData
        .bulkReadDetail({ apiUuids, projectUuid, workSpaceUuid, ...items })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiData - detail 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c apiData - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiDataList<T = any>({ projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid, ...items }) {
    if (projectUuid == null) {
      console.log('%c Error: apiData - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.apiData
        .page({ projectUuid, workSpaceUuid, ...items })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiData - list 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c apiData - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockCreate<T = any>({
    name,
    apiUuid,
    createWay,
    response,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid,
    ...items
  }) {
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
      db.mock
        .create({
          name,
          apiUuid,
          createWay,
          response,
          projectUuid,
          workSpaceUuid,
          ...items
        })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c mock - create 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c mock - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockUpdate<T = any>({
    id,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid,
    ...items
  }) {
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
      db.mock
        .update({ id, projectUuid, workSpaceUuid, ...items })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c mock - update 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c mock - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockList<T = any>({
    apiUuid,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid,
    page,
    pageSize
  }) {
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
      db.mock
        .page({ apiUuid, projectUuid, workSpaceUuid, page, pageSize })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c mock - list 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c mock - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockDetail<T = any>({ id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
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
      db.mock
        .read({ id, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c mock - detail 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c mock - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockDelete<T = any>({ id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
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
      db.mock
        .delete({ id, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c mock - delete 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c mock - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupCreate<T = any>(params) {
    if (params == null) {
      console.log('%c Error: group - create 接口 缺失参数  %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.group
        .bulkCreate(params)
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c group - create 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c group - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupUpdate<T = any>({
    id,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid,
    ...items
  }) {
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
      db.group
        .update({ id, projectUuid, workSpaceUuid, ...items })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c group - update 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c group - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupDelete<T = any>({ id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
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
      db.group
        .delete({ id, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c group - delete 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c group - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupDetail<T = any>({ id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
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
      db.group
        .read({ id, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c group - detail 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c group - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupList<T = any>({
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid,
    withItem = true
  }) {
    if (projectUuid == null) {
      console.log('%c Error: group - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }
    if (withItem == null) {
      console.log('%c Error: group - list 接口 缺失参数 withItem %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.group
        .bulkRead({ projectUuid, workSpaceUuid, withItem })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c group - list 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c group - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiTestHistoryCreate<T = any>({
    apiUuid,
    general,
    request,
    response,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid
  }) {
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
      db.apiTestHistory
        .create({
          apiUuid,
          general,
          request,
          response,
          projectUuid,
          workSpaceUuid
        })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiTestHistory - create 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c apiTestHistory - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiTestHistoryList<T = any>({
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid,
    page,
    pageSize
  }) {
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
      db.apiTestHistory
        .page({ projectUuid, workSpaceUuid, page, pageSize })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiTestHistory - list 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c apiTestHistory - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiTestHistoryDetail<T = any>({
    id,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid
  }) {
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
      db.apiTestHistory
        .read({ id, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiTestHistory - detail 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c apiTestHistory - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiTestHistoryDelete<T = any>({
    ids,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid
  }) {
    if (ids == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 ids %c', ErrorStyle, '');
      return;
    }
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.apiTestHistory
        .bulkDelete({ ids, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c apiTestHistory - delete 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c apiTestHistory - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentCreate<T = any>({
    name,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid,
    ...items
  }) {
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
      db.environment
        .create({ name, projectUuid, workSpaceUuid, ...items })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c environment - create 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c environment - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentUpdate<T = any>({
    id,
    name,
    projectUuid = this.store.getCurrentProjectID,
    workSpaceUuid = this.store.getCurrentWorkspaceUuid,
    ...items
  }) {
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
      db.environment
        .update({ id, name, projectUuid, workSpaceUuid, ...items })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c environment - update 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c environment - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentDelete<T = any>({ id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
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
      db.environment
        .delete({ id, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c environment - delete 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c environment - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentDetail<T = any>({ id, projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
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
      db.environment
        .read({ id, projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c environment - detail 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c environment - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentList<T = any>({ projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
    if (projectUuid == null) {
      console.log('%c Error: environment - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.environment
        .bulkRead({ projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c environment - list 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c environment - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceCreate<T = any>({ titles }) {
    if (titles == null) {
      console.log('%c Error: workspace - create 接口 缺失参数 titles %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.workspace
        .create({ titles })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c workspace - create 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c workspace - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceUpdate<T = any>({ title, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
    if (title == null) {
      console.log('%c Error: workspace - update 接口 缺失参数 title %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.workspace
        .update({ title, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c workspace - update 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c workspace - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceDelete<T = any>({ workSpaceUuids }) {
    if (workSpaceUuids == null) {
      console.log('%c Error: workspace - delete 接口 缺失参数 workSpaceUuids %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.workspace
        .delete({ workSpaceUuids })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c workspace - delete 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c workspace - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectExportProject<T = any>({ projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
    if (projectUuid == null) {
      console.log('%c Error: project - exportProject 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - exportProject 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.project
        .exports({ projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project - exportProject 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c project - exportProject 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectCreate<T = any>({ projectMsgs, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
    if (projectMsgs == null) {
      console.log('%c Error: project - create 接口 缺失参数 projectMsgs %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - create 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.project
        .bulkCreate({ projectMsgs, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project - create 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c project - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectDetail<T = any>({ projectUuids, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
    if (projectUuids == null) {
      console.log('%c Error: project - detail 接口 缺失参数 projectUuids %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: project - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.project
        .page({ projectUuids, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project - detail 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c project - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectUpdate<T = any>({ projectUuid = this.store.getCurrentProjectID, name, description }) {
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
      db.project
        .update({ projectUuid, name, description })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project - update 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c project - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectDelete<T = any>({ projectUuids }) {
    if (projectUuids == null) {
      console.log('%c Error: project - delete 接口 缺失参数 projectUuids %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.project
        .bulkDelete({ projectUuids })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project - delete 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c project - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectImport<T = any>(params) {
    return new Promise<[T, null] | [null, any]>(resolve => {
      db.project
        .import(params)
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c project - import 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c project - import 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareProjectDetail<T = any>({ sharedUuid }) {
    if (sharedUuid == null) {
      console.log('%c Error: share - projectDetail 接口 缺失参数 sharedUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.share
        .page({ sharedUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c share - projectDetail 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c share - projectDetail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareGroupList<T = any>({ sharedUuid, withItem = true }) {
    if (sharedUuid == null) {
      console.log('%c Error: share - groupList 接口 缺失参数 sharedUuid %c', ErrorStyle, '');
      return;
    }
    if (withItem == null) {
      console.log('%c Error: share - groupList 接口 缺失参数 withItem %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.share
        .bulkRead({ sharedUuid, withItem })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c share - groupList 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c share - groupList 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareApiDataDetail<T = any>({ apiUuids, sharedUuid, ...items }) {
    if (apiUuids == null) {
      console.log('%c Error: share - apiDataDetail 接口 缺失参数 apiUuids %c', ErrorStyle, '');
      return;
    }
    if (sharedUuid == null) {
      console.log('%c Error: share - apiDataDetail 接口 缺失参数 sharedUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.share
        .bulkReadDetail({ apiUuids, sharedUuid, ...items })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c share - apiDataDetail 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c share - apiDataDetail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareEnvironmentList<T = any>({ projectUuid = this.store.getCurrentProjectID, workSpaceUuid = this.store.getCurrentWorkspaceUuid }) {
    if (projectUuid == null) {
      console.log('%c Error: share - environmentList 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: share - environmentList 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise<[T, null] | [null, any]>(resolve => {
      db.share
        .bulkRead({ projectUuid, workSpaceUuid })
        .then(({ code, data }: any) => {
          if (code === 0) {
            console.log('%c share - environmentList 接口调用成功 %c', SuccessStyle, '');
            return resolve([data, null]);
          }
          return resolve([null, { code, data }]);
        })
        .catch(error => {
          console.log('%c share - environmentList 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }
}
