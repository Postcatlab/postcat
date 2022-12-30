import { Injectable } from '@angular/core';
import { Table } from 'dexie';

import { sampleApiData } from './IndexedDB/sample';
import {
  Project,
  Environment,
  Group,
  ApiData,
  ApiTestHistory,
  ApiMockEntity,
  StorageInterface,
  StorageItem,
  StorageResStatus
} from './index.model';
import localStorage from './local.db';

const ErrorStyle = 'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

const SuccessStyle = 'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

@Injectable({
  providedIn: 'root'
})
export default class LocalService extends localStorage {
  project!: Table<Project, number | string>;
  group!: Table<Group, number | string>;
  environment!: Table<Environment, number | string>;
  apiData!: Table<ApiData, number | string>;
  apiTestHistory!: Table<ApiTestHistory, number | string>;
  mock!: Table<ApiMockEntity, number | string>;
  constructor() {
    super('postcat_core');
    this.version(2).stores({
      project: '++uuid, name',
      environment: '++uuid, name, projectID',
      group: '++uuid, name, projectID, parentID',
      apiData: '++uuid, name, projectID, groupID',
      apiTestHistory: '++uuid, projectID, apiDataID',
      mock: '++uuid, name, apiDataID, projectID, createWay'
    });
    this.open();
    this.on('populate', () => this.populate());
  }
  async populate() {
    await this.project.add({ uuid: 1, name: 'Default' });
    await this.apiData.bulkAdd(sampleApiData);
  }
  projectExports(): Promise<any> {
    const result = ['environment', 'group', 'project', 'apiData'].reduce(
      async (total, it) => ({
        [it]: await this[it].toArray(),
        ...total
      }),
      {}
    );
    return Promise.resolve(result);
  }

  api_projectCreate(params) {
    return new Promise(resolve => {
      this.create(this.project, params)
        .then(({ status, ...data }: any) => {
          console.log('%c project - create 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log('%c Error: project - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.update(this.project, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c project - update 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectDelete({ uuid }) {
    if (!uuid) {
      console.log('%c Error: project - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.remove(this.project, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c project - delete 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectExport(params) {
    return new Promise(resolve => {
      this.load(this.project, params)
        .then(({ status, ...data }: any) => {
          console.log('%c project - export 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - export 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectAddMember({ projectID, userIDs }) {
    if (!projectID) {
      console.log('%c Error: project - addMember 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }
    if (!userIDs) {
      console.log('%c Error: project - addMember 接口 缺失参数 userIDs %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.create(this.project, { projectID, userIDs })
        .then(({ status, ...data }: any) => {
          console.log('%c project - addMember 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - addMember 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectDelMember({ projectID, userIDs }) {
    if (!projectID) {
      console.log('%c Error: project - delMember 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }
    if (!userIDs) {
      console.log('%c Error: project - delMember 接口 缺失参数 userIDs %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.remove(this.project, { projectID, userIDs })
        .then(({ status, ...data }: any) => {
          console.log('%c project - delMember 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - delMember 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectMember({ projectID }) {
    if (!projectID) {
      console.log('%c Error: project - member 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.project, { projectID })
        .then(({ status, ...data }: any) => {
          console.log('%c project - member 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - member 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectMemberQuit({ projectID }) {
    if (!projectID) {
      console.log('%c Error: project - memberQuit 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.create(this.project, { projectID })
        .then(({ status, ...data }: any) => {
          console.log('%c project - memberQuit 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - memberQuit 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectSetRole({ projectID, roleID, memberID }) {
    if (!projectID) {
      console.log('%c Error: project - setRole 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }
    if (!roleID) {
      console.log('%c Error: project - setRole 接口 缺失参数 roleID %c', ErrorStyle, '');
      return;
    }
    if (!memberID) {
      console.log('%c Error: project - setRole 接口 缺失参数 memberID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.create(this.project, { projectID, roleID, memberID })
        .then(({ status, ...data }: any) => {
          console.log('%c project - setRole 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - setRole 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectRoleList({ projectID }) {
    if (!projectID) {
      console.log('%c Error: project - roleList 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.project, { projectID })
        .then(({ status, ...data }: any) => {
          console.log('%c project - roleList 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - roleList 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_projectPermission({ projectID }) {
    if (!projectID) {
      console.log('%c Error: project - permission 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.project, { projectID })
        .then(({ status, ...data }: any) => {
          console.log('%c project - permission 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c project - permission 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceCreate({ title }) {
    if (!title) {
      console.log('%c Error: workspace - create 接口 缺失参数 title %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.create(this.undefined, { title })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - create 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceList({ ...items }) {
    return new Promise(resolve => {
      this.load(this.undefined, { ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - list 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - list 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceUpload(params) {
    return new Promise(resolve => {
      this.create(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - upload 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - upload 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceEdit({ workspaceID, title }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - edit 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (!title) {
      console.log('%c Error: workspace - edit 接口 缺失参数 title %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.update(this.undefined, { workspaceID, title })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - edit 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - edit 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceDelete({ workspaceID }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - delete 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.remove(this.undefined, { workspaceID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - delete 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceGetInfo({ workspaceID }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - getInfo 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.undefined, { workspaceID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - getInfo 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - getInfo 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceMember({ workspaceID }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - member 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.undefined, { workspaceID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - member 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - member 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceSearchMember({ workspaceID, username }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (!username) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 username %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.undefined, { workspaceID, username })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - searchMember 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - searchMember 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceAddMember({ workspaceID, userIDs }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - addMember 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (!userIDs) {
      console.log('%c Error: workspace - addMember 接口 缺失参数 userIDs %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.create(this.undefined, { workspaceID, userIDs })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - addMember 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - addMember 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceRemoveMember({ workspaceID, userIDs }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - removeMember 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (!userIDs) {
      console.log('%c Error: workspace - removeMember 接口 缺失参数 userIDs %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.remove(this.undefined, { workspaceID, userIDs })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - removeMember 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - removeMember 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceMemberQuit({ workspaceID }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - memberQuit 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.create(this.undefined, { workspaceID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - memberQuit 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - memberQuit 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceSetRole({ workspaceID, roleID, memberID }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - setRole 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (!roleID) {
      console.log('%c Error: workspace - setRole 接口 缺失参数 roleID %c', ErrorStyle, '');
      return;
    }
    if (!memberID) {
      console.log('%c Error: workspace - setRole 接口 缺失参数 memberID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.create(this.undefined, { workspaceID, roleID, memberID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - setRole 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - setRole 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspaceRoleList({ workspaceID }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - roleList 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.undefined, { workspaceID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - roleList 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - roleList 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_workspacePermission({ workspaceID }) {
    if (!workspaceID) {
      console.log('%c Error: workspace - permission 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.undefined, { workspaceID })
        .then(({ status, ...data }: any) => {
          console.log('%c workspace - permission 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c workspace - permission 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareCreateShare(params) {
    return new Promise(resolve => {
      this.create(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c share - createShare 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c share - createShare 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareGetShareList(params) {
    return new Promise(resolve => {
      this.load(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c share - getShareList 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c share - getShareList 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareDeleteShare(params) {
    return new Promise(resolve => {
      this.remove(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c share - deleteShare 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c share - deleteShare 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareDocGetAllApi({ uniqueID }) {
    if (!uniqueID) {
      console.log('%c Error: shareDoc - getAllAPI 接口 缺失参数 uniqueID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.undefined, { uniqueID })
        .then(({ status, ...data }: any) => {
          console.log('%c shareDoc - getAllAPI 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c shareDoc - getAllAPI 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareDocGetApiDetail({ uniqueID, apiDataUUID }) {
    if (!uniqueID) {
      console.log('%c Error: shareDoc - getApiDetail 接口 缺失参数 uniqueID %c', ErrorStyle, '');
      return;
    }
    if (!apiDataUUID) {
      console.log('%c Error: shareDoc - getApiDetail 接口 缺失参数 apiDataUUID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.undefined, { uniqueID, apiDataUUID })
        .then(({ status, ...data }: any) => {
          console.log('%c shareDoc - getApiDetail 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c shareDoc - getApiDetail 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_shareDocGetEnv({ uniqueID }) {
    if (!uniqueID) {
      console.log('%c Error: shareDoc - getEnv 接口 缺失参数 uniqueID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.undefined, { uniqueID })
        .then(({ status, ...data }: any) => {
          console.log('%c shareDoc - getEnv 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c shareDoc - getEnv 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_userUpdateUserProfile(params) {
    return new Promise(resolve => {
      this.update(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c user - updateUserProfile 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c user - updateUserProfile 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_userReadProfile({ ...items }) {
    return new Promise(resolve => {
      this.load(this.undefined, { ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c user - readProfile 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c user - readProfile 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_userUpdatePsd({ newPassword }) {
    if (!newPassword) {
      console.log('%c Error: user - updatePsd 接口 缺失参数 newPassword %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.update(this.undefined, { newPassword })
        .then(({ status, ...data }: any) => {
          console.log('%c user - updatePsd 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c user - updatePsd 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_userSearch({ username }) {
    if (!username) {
      console.log('%c Error: user - search 接口 缺失参数 username %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.undefined, { username })
        .then(({ status, ...data }: any) => {
          console.log('%c user - search 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c user - search 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_authLogin({ username, password }) {
    if (!username) {
      console.log('%c Error: auth - login 接口 缺失参数 username %c', ErrorStyle, '');
      return;
    }
    if (!password) {
      console.log('%c Error: auth - login 接口 缺失参数 password %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.create(this.undefined, { username, password })
        .then(({ status, ...data }: any) => {
          console.log('%c auth - login 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c auth - login 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_authRefresh(params) {
    return new Promise(resolve => {
      this.update(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c auth - refresh 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c auth - refresh 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_authLogout({ refreshToken }) {
    if (!refreshToken) {
      console.log('%c Error: auth - logout 接口 缺失参数 refreshToken %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.create(this.undefined, { refreshToken })
        .then(({ status, ...data }: any) => {
          console.log('%c auth - logout 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c auth - logout 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_envCreate(params) {
    return new Promise(resolve => {
      this.create(this.environment, params)
        .then(({ status, ...data }: any) => {
          console.log('%c env - create 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c env - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_envUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log('%c Error: env - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.update(this.environment, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c env - update 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c env - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_envDelete({ uuid }) {
    if (!uuid) {
      console.log('%c Error: env - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.remove(this.environment, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c env - delete 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c env - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_envLoad({ uuid }) {
    if (!uuid) {
      console.log('%c Error: env - load 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.environment, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c env - load 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c env - load 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_envSearch({ projectID }) {
    if (!projectID) {
      console.log('%c Error: env - search 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.search(this.environment, { projectID })
        .then(({ status, ...data }: any) => {
          console.log('%c env - search 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c env - search 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupCreate(params) {
    return new Promise(resolve => {
      this.create(this.group, params)
        .then(({ status, ...data }: any) => {
          console.log('%c group - create 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c group - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log('%c Error: group - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.update(this.group, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c group - update 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c group - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupBulkUpdate(params) {
    return new Promise(resolve => {
      this.update(this.group, params)
        .then(({ status, ...data }: any) => {
          console.log('%c group - bulkUpdate 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c group - bulkUpdate 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupDelete({ uuid }) {
    if (!uuid) {
      console.log('%c Error: group - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.remove(this.group, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c group - delete 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c group - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_groupLoadAll({ projectID }) {
    if (!projectID) {
      console.log('%c Error: group - loadAll 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.group, { projectID })
        .then(({ status, ...data }: any) => {
          console.log('%c group - loadAll 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c group - loadAll 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiCreate(params) {
    return new Promise(resolve => {
      this.create(this.apiData, params)
        .then(({ status, ...data }: any) => {
          console.log('%c api - create 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c api - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log('%c Error: api - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.update(this.apiData, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c api - update 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c api - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiBulkUpdate(params) {
    return new Promise(resolve => {
      this.update(this.apiData, params)
        .then(({ status, ...data }: any) => {
          console.log('%c api - bulkUpdate 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c api - bulkUpdate 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiDelete({ uuid }) {
    if (!uuid) {
      console.log('%c Error: api - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.remove(this.apiData, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c api - delete 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c api - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiLoadApi({ uuid }) {
    if (!uuid) {
      console.log('%c Error: api - loadApi 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.apiData, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c api - loadApi 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c api - loadApi 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_apiLoadAllByProjectId({ projectID }) {
    if (!projectID) {
      console.log('%c Error: api - LoadAllByProjectID 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.apiData, { projectID })
        .then(({ status, ...data }: any) => {
          console.log('%c api - LoadAllByProjectID 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c api - LoadAllByProjectID 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_testCreate(params) {
    return new Promise(resolve => {
      this.create(this.apiTestHistory, params)
        .then(({ status, ...data }: any) => {
          console.log('%c test - create 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c test - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_testDelete({ uuid }) {
    if (!uuid) {
      console.log('%c Error: test - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.remove(this.apiTestHistory, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c test - delete 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c test - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_testLoadAll({ apiDataID }) {
    if (!apiDataID) {
      console.log('%c Error: test - LoadAll 接口 缺失参数 apiDataID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.apiTestHistory, { apiDataID })
        .then(({ status, ...data }: any) => {
          console.log('%c test - LoadAll 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c test - LoadAll 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockCreate(params) {
    return new Promise(resolve => {
      this.create(this.mock, params)
        .then(({ status, ...data }: any) => {
          console.log('%c mock - create 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c mock - create 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockLoad({ uuid }) {
    if (!uuid) {
      console.log('%c Error: mock - load 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.mock, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c mock - load 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c mock - load 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockDelete({ uuid }) {
    if (!uuid) {
      console.log('%c Error: mock - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.remove(this.mock, { uuid })
        .then(({ status, ...data }: any) => {
          console.log('%c mock - delete 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c mock - delete 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockUpdate({ uuid, ...items }) {
    if (!uuid) {
      console.log('%c Error: mock - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.update(this.mock, { uuid, ...items })
        .then(({ status, ...data }: any) => {
          console.log('%c mock - update 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c mock - update 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_mockLoadAll({ apiDataID }) {
    if (!apiDataID) {
      console.log('%c Error: mock - loadAll 接口 缺失参数 apiDataID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.load(this.mock, { apiDataID })
        .then(({ status, ...data }: any) => {
          console.log('%c mock - loadAll 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c mock - loadAll 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }

  api_systemStatus(params) {
    return new Promise(resolve => {
      this.load(this.undefined, params)
        .then(({ status, ...data }: any) => {
          console.log('%c system - status 接口调用成功 %c', SuccessStyle, '');
          if (status === 200) {
            return resolve([data, null]);
          }
          resolve([null, data]);
        })
        .catch(error => {
          console.log('%c system - status 接口调用失败 %c', ErrorStyle, '');
          resolve([null, error]);
        });
    });
  }
}
