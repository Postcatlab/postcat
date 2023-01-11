import { Injectable } from '@angular/core';

import { db } from './db';

const ErrorStyle = 'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

const SuccessStyle = 'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  constructor() {}

  api_apiDataCreate({ apiList, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.apiData
        .create({ apiList, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c apiData - create 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c apiData - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiDataUpdate({ api, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.apiData
        .update({ api, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c apiData - update 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c apiData - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiDataDelete({ apiUuid, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.apiData
        .delete({ apiUuid, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c apiData - delete 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c apiData - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiDataDetail({ projectUuid, workSpaceUuid }) {
    if (projectUuid == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiData - detail 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      db.apiData
        .read({ projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c apiData - detail 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c apiData - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiDataList({ api, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.apiData
        .bulkRead({ api, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c apiData - list 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c apiData - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockCreate({ name, apiUuid, createWay, response, projectUuid, workSpaceUuid, ...items }) {
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

    return new Promise(resolve => {
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
        .then(({ status, data }: any) => {
          console.log('%c mock - create 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c mock - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockUpdate({ id, projectUuid, workSpaceUuid, ...items }) {
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

    return new Promise(resolve => {
      db.mock
        .update({ id, projectUuid, workSpaceUuid, ...items })
        .then(({ status, data }: any) => {
          console.log('%c mock - update 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c mock - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockList({ apiUuid, projectUuid, workSpaceUuid, page, pageSize }) {
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

    return new Promise(resolve => {
      db.mock
        .bulkRead({ apiUuid, projectUuid, workSpaceUuid, page, pageSize })
        .then(({ status, data }: any) => {
          console.log('%c mock - list 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c mock - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockDetail({ id, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.mock
        .read({ id, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c mock - detail 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c mock - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockDelete({ id, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.mock
        .delete({ id, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c mock - delete 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c mock - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupCreate({ module, type, name, projectUuid, workSpaceUuid, ...items }) {
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

    return new Promise(resolve => {
      db.group
        .create({ module, type, name, projectUuid, workSpaceUuid, ...items })
        .then(({ status, data }: any) => {
          console.log('%c group - create 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c group - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupUpdate({ id, projectUuid, workSpaceUuid, ...items }) {
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

    return new Promise(resolve => {
      db.group
        .update({ id, projectUuid, workSpaceUuid, ...items })
        .then(({ status, data }: any) => {
          console.log('%c group - update 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c group - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupDelete({ id, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.group
        .delete({ id, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c group - delete 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c group - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupDetail({ id, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.group
        .read({ id, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c group - detail 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c group - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupList({ projectUuid, workSpaceUuid }) {
    if (projectUuid == null) {
      console.log('%c Error: group - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: group - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      db.group
        .bulkRead({ projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c group - list 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c group - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiTestHistoryCreate({ apiUuid, general, request, response, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.apiTestHistory
        .create({
          apiUuid,
          general,
          request,
          response,
          projectUuid,
          workSpaceUuid
        })
        .then(({ status, data }: any) => {
          console.log('%c apiTestHistory - create 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c apiTestHistory - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiTestHistoryList({ apiUuid, projectUuid, workSpaceUuid, page, pageSize }) {
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

    return new Promise(resolve => {
      db.apiTestHistory
        .bulkRead({ apiUuid, projectUuid, workSpaceUuid, page, pageSize })
        .then(({ status, data }: any) => {
          console.log('%c apiTestHistory - list 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c apiTestHistory - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiTestHistoryDetail({ id, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.apiTestHistory
        .read({ id, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c apiTestHistory - detail 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c apiTestHistory - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiTestHistoryDelete({ projectUuid, workSpaceUuid }) {
    if (projectUuid == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: apiTestHistory - delete 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      db.apiTestHistory
        .bulkDelete({ projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c apiTestHistory - delete 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c apiTestHistory - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentCreate({ name, projectUuid, workSpaceUuid, ...items }) {
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

    return new Promise(resolve => {
      db.environment
        .create({ name, projectUuid, workSpaceUuid, ...items })
        .then(({ status, data }: any) => {
          console.log('%c environment - create 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c environment - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentUpdate({ id, name, projectUuid, workSpaceUuid, ...items }) {
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

    return new Promise(resolve => {
      db.environment
        .update({ id, name, projectUuid, workSpaceUuid, ...items })
        .then(({ status, data }: any) => {
          console.log('%c environment - update 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c environment - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentDelete({ id, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.environment
        .delete({ id, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c environment - delete 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c environment - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentDetail({ id, projectUuid, workSpaceUuid }) {
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

    return new Promise(resolve => {
      db.environment
        .read({ id, projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c environment - detail 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c environment - detail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_environmentList({ projectUuid, workSpaceUuid }) {
    if (projectUuid == null) {
      console.log('%c Error: environment - list 接口 缺失参数 projectUuid %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: environment - list 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      db.environment
        .bulkRead({ projectUuid, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c environment - list 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c environment - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceCreate({ titles }) {
    if (titles == null) {
      console.log('%c Error: workspace - create 接口 缺失参数 titles %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      db.workspace
        .create({ titles })
        .then(({ status, data }: any) => {
          console.log('%c workspace - create 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c workspace - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceUpdate({ title, workSpaceUuid }) {
    if (title == null) {
      console.log('%c Error: workspace - update 接口 缺失参数 title %c', ErrorStyle, '');
      return;
    }
    if (workSpaceUuid == null) {
      console.log('%c Error: workspace - update 接口 缺失参数 workSpaceUuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      db.workspace
        .update({ title, workSpaceUuid })
        .then(({ status, data }: any) => {
          console.log('%c workspace - update 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c workspace - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceDelete({ workSpaceUuids }) {
    if (workSpaceUuids == null) {
      console.log('%c Error: workspace - delete 接口 缺失参数 workSpaceUuids %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      db.workspace
        .delete({ workSpaceUuids })
        .then(({ status, data }: any) => {
          console.log('%c workspace - delete 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c workspace - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceList(params) {
    return new Promise(resolve => {
      db.workspace
        .bulkRead(params)
        .then(({ status, data }: any) => {
          console.log('%c workspace - list 接口调用成功 %c', SuccessStyle, '');
          return resolve([data, null]);
        })
        .catch(error => {
          console.log('%c workspace - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }
}
