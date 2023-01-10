import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const ErrorStyle = 'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

const SuccessStyle = 'background-color: #316745; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;';

@Injectable({
  providedIn: 'root'
})
export class RemoteService {
  constructor(private http: HttpClient) {}

  api_projectCreate(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/project`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project:create - api_projectCreate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c project:create - api_projectCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectUpdate({ uuid, ...items }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: project - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.put(`${prefix}/project/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project:update - api_projectUpdate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c project:update - api_projectUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectDelete({ uuid }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: project - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.delete(`${prefix}/project/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project:delete - api_projectDelete 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c project:delete - api_projectDelete 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectExport(params, prefix = '') {
    return new Promise(resolve => {
      this.http.get(`${prefix}/project/export`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project:export - api_projectExport 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c project:export - api_projectExport 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectAddMember({ projectID, userIDs }, prefix = '') {
    if (projectID == null) {
      console.log('%c Error: project - addMember 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }
    if (userIDs == null) {
      console.log('%c Error: project - addMember 接口 缺失参数 userIDs %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.post(`${prefix}/project/${projectID}/member/add`, { userIDs }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project:addMember - api_projectAddMember 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c project:addMember - api_projectAddMember 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectDelMember({ projectID, userIDs }, prefix = '') {
    if (projectID == null) {
      console.log('%c Error: project - delMember 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }
    if (userIDs == null) {
      console.log('%c Error: project - delMember 接口 缺失参数 userIDs %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http
        .delete(`${prefix}/project/${projectID}/member/remove`, {
          body: { userIDs }
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c project:delMember - api_projectDelMember 接口请求成功 %c', SuccessStyle, '');
            if ([200, 201].includes(status)) {
              return resolve([data, null]);
            }
            resolve([null, { status, ...data }]);
          },
          error: error => {
            console.log('%c project:delMember - api_projectDelMember 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectMember({ projectID }, prefix = '') {
    if (projectID == null) {
      console.log('%c Error: project - member 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/project/${projectID}/member/list`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project:member - api_projectMember 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c project:member - api_projectMember 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectMemberQuit({ projectID }, prefix = '') {
    if (projectID == null) {
      console.log('%c Error: project - memberQuit 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.post(`${prefix}/project/${projectID}/member/leave`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project:memberQuit - api_projectMemberQuit 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c project:memberQuit - api_projectMemberQuit 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectSetRole({ projectID, roleID, memberID }, prefix = '') {
    if (projectID == null) {
      console.log('%c Error: project - setRole 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }
    if (roleID == null) {
      console.log('%c Error: project - setRole 接口 缺失参数 roleID %c', ErrorStyle, '');
      return;
    }
    if (memberID == null) {
      console.log('%c Error: project - setRole 接口 缺失参数 memberID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http
        .post(`${prefix}/project/${projectID}/member/setRole`, {
          roleID,
          memberID
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c project:setRole - api_projectSetRole 接口请求成功 %c', SuccessStyle, '');
            if ([200, 201].includes(status)) {
              return resolve([data, null]);
            }
            resolve([null, { status, ...data }]);
          },
          error: error => {
            console.log('%c project:setRole - api_projectSetRole 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_projectRoleList({ projectID }, prefix = '') {
    if (projectID == null) {
      console.log('%c Error: project - roleList 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/project/${projectID}/roles`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project:roleList - api_projectRoleList 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c project:roleList - api_projectRoleList 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_projectPermission({ projectID }, prefix = '') {
    if (projectID == null) {
      console.log('%c Error: project - permission 接口 缺失参数 projectID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/project/${projectID}/rolePermission`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c project:permission - api_projectPermission 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c project:permission - api_projectPermission 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceCreate({ title }, prefix = '') {
    if (title == null) {
      console.log('%c Error: workspace - create 接口 缺失参数 title %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.post(`${prefix}/workspace`, { title }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace:create - api_workspaceCreate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c workspace:create - api_workspaceCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceList({ ...items }, prefix = '') {
    return new Promise(resolve => {
      this.http
        .get(`${prefix}/workspace/list`, {
          params: { ...items }
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c workspace:list - api_workspaceList 接口请求成功 %c', SuccessStyle, '');
            if ([200, 201].includes(status)) {
              return resolve([data, null]);
            }
            resolve([null, { status, ...data }]);
          },
          error: error => {
            console.log('%c workspace:list - api_workspaceList 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceEdit({ workspaceID, title }, prefix = '') {
    if (workspaceID == null) {
      console.log('%c Error: workspace - edit 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (title == null) {
      console.log('%c Error: workspace - edit 接口 缺失参数 title %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.put(`${prefix}/workspace/${workspaceID}`, { title }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace:edit - api_workspaceEdit 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c workspace:edit - api_workspaceEdit 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceDelete({ workspaceID }, prefix = '') {
    if (workspaceID == null) {
      console.log('%c Error: workspace - delete 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.delete(`${prefix}/workspace/${workspaceID}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace:delete - api_workspaceDelete 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c workspace:delete - api_workspaceDelete 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceMember({ workspaceID }, prefix = '') {
    if (workspaceID == null) {
      console.log('%c Error: workspace - member 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/workspace/${workspaceID}/member/list`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace:member - api_workspaceMember 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c workspace:member - api_workspaceMember 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceSearchMember({ workspaceID, username }, prefix = '') {
    if (workspaceID == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (username == null) {
      console.log('%c Error: workspace - searchMember 接口 缺失参数 username %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/workspace/${workspaceID}/member/list/${username}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace:searchMember - api_workspaceSearchMember 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c workspace:searchMember - api_workspaceSearchMember 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceAddMember({ workspaceID, userIDs }, prefix = '') {
    if (workspaceID == null) {
      console.log('%c Error: workspace - addMember 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (userIDs == null) {
      console.log('%c Error: workspace - addMember 接口 缺失参数 userIDs %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.post(`${prefix}/workspace/${workspaceID}/member/add`, { userIDs }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace:addMember - api_workspaceAddMember 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c workspace:addMember - api_workspaceAddMember 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceRemoveMember({ workspaceID, userIDs }, prefix = '') {
    if (workspaceID == null) {
      console.log('%c Error: workspace - removeMember 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (userIDs == null) {
      console.log('%c Error: workspace - removeMember 接口 缺失参数 userIDs %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http
        .delete(`${prefix}/workspace/${workspaceID}/member/remove`, {
          body: { userIDs }
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c workspace:removeMember - api_workspaceRemoveMember 接口请求成功 %c', SuccessStyle, '');
            if ([200, 201].includes(status)) {
              return resolve([data, null]);
            }
            resolve([null, { status, ...data }]);
          },
          error: error => {
            console.log('%c workspace:removeMember - api_workspaceRemoveMember 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspaceMemberQuit({ workspaceID }, prefix = '') {
    if (workspaceID == null) {
      console.log('%c Error: workspace - memberQuit 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.post(`${prefix}/workspace/${workspaceID}/member/leave`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace:memberQuit - api_workspaceMemberQuit 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c workspace:memberQuit - api_workspaceMemberQuit 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_workspaceSetRole({ workspaceID, roleID, memberID }, prefix = '') {
    if (workspaceID == null) {
      console.log('%c Error: workspace - setRole 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }
    if (roleID == null) {
      console.log('%c Error: workspace - setRole 接口 缺失参数 roleID %c', ErrorStyle, '');
      return;
    }
    if (memberID == null) {
      console.log('%c Error: workspace - setRole 接口 缺失参数 memberID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http
        .post(`${prefix}/workspace/${workspaceID}/member/setRole`, {
          roleID,
          memberID
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c workspace:setRole - api_workspaceSetRole 接口请求成功 %c', SuccessStyle, '');
            if ([200, 201].includes(status)) {
              return resolve([data, null]);
            }
            resolve([null, { status, ...data }]);
          },
          error: error => {
            console.log('%c workspace:setRole - api_workspaceSetRole 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_workspacePermission({ workspaceID }, prefix = '') {
    if (workspaceID == null) {
      console.log('%c Error: workspace - permission 接口 缺失参数 workspaceID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/workspace/${workspaceID}/rolePermission`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c workspace:permission - api_workspacePermission 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c workspace:permission - api_workspacePermission 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareCreateShare(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/shared`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c share:createShare - api_shareCreateShare 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c share:createShare - api_shareCreateShare 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareGetShareList(params, prefix = '') {
    return new Promise(resolve => {
      this.http.get(`${prefix}/shared`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c share:getShareList - api_shareGetShareList 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c share:getShareList - api_shareGetShareList 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareDeleteShare(params, prefix = '') {
    return new Promise(resolve => {
      this.http.delete(`${prefix}/shared`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c share:deleteShare - api_shareDeleteShare 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c share:deleteShare - api_shareDeleteShare 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareDocGetAllApi({ uniqueID }, prefix = '') {
    if (uniqueID == null) {
      console.log('%c Error: shareDoc - getAllAPI 接口 缺失参数 uniqueID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/shared-docs/${uniqueID}/collections`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c shareDoc:getAllAPI - api_shareDocGetAllApi 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c shareDoc:getAllAPI - api_shareDocGetAllApi 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareDocGetApiDetail({ uniqueID, apiDataUUID }, prefix = '') {
    if (uniqueID == null) {
      console.log('%c Error: shareDoc - getApiDetail 接口 缺失参数 uniqueID %c', ErrorStyle, '');
      return;
    }
    if (apiDataUUID == null) {
      console.log('%c Error: shareDoc - getApiDetail 接口 缺失参数 apiDataUUID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/shared-docs/${uniqueID}/api/${apiDataUUID}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c shareDoc:getApiDetail - api_shareDocGetApiDetail 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c shareDoc:getApiDetail - api_shareDocGetApiDetail 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_shareDocGetEnv({ uniqueID }, prefix = '') {
    if (uniqueID == null) {
      console.log('%c Error: shareDoc - getEnv 接口 缺失参数 uniqueID %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/shared-docs/${uniqueID}/environments`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c shareDoc:getEnv - api_shareDocGetEnv 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c shareDoc:getEnv - api_shareDocGetEnv 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userReadInfo(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/common/user/info`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c user:readInfo - api_userReadInfo 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c user:readInfo - api_userReadInfo 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userUpdateInfo(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/common/user/update-userinfo`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c user:updateInfo - api_userUpdateInfo 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c user:updateInfo - api_userUpdateInfo 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userUpdatePassword({ password, ...items }, prefix = '') {
    if (password == null) {
      console.log('%c Error: user - updatePassword 接口 缺失参数 password %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http
        .post(`${prefix}/common/user/change-password`, {
          body: { password, ...items }
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c user:updatePassword - api_userUpdatePassword 接口请求成功 %c', SuccessStyle, '');
            if ([200, 201].includes(status)) {
              return resolve([data, null]);
            }
            resolve([null, { status, ...data }]);
          },
          error: error => {
            console.log('%c user:updatePassword - api_userUpdatePassword 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_userLogin({ username, password }, prefix = '') {
    if (username == null) {
      console.log('%c Error: user - login 接口 缺失参数 username %c', ErrorStyle, '');
      return;
    }
    if (password == null) {
      console.log('%c Error: user - login 接口 缺失参数 password %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http
        .post(`${prefix}/common/sso/login`, {
          body: { username, password }
        })
        .subscribe({
          next: ({ status, data }: any) => {
            console.log('%c user:login - api_userLogin 接口请求成功 %c', SuccessStyle, '');
            if ([200, 201].includes(status)) {
              return resolve([data, null]);
            }
            resolve([null, { status, ...data }]);
          },
          error: error => {
            console.log('%c user:login - api_userLogin 接口请求失败 %c', ErrorStyle, '');
            resolve([null, error]);
          }
        });
    });
  }

  api_userRefreshToken(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/common/sso/refresh`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c user:refreshToken - api_userRefreshToken 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c user:refreshToken - api_userRefreshToken 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userLogout(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/common/sso/logout`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c user:logout - api_userLogout 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c user:logout - api_userLogout 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_userSearch(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/search`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c user:search - api_userSearch 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c user:search - api_userSearch 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_environmentCreate(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/environment`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c environment:create - api_environmentCreate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c environment:create - api_environmentCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_environmentUpdate({ uuid, ...items }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: environment - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.put(`${prefix}/environment/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c environment:update - api_environmentUpdate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c environment:update - api_environmentUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_environmentDelete({ uuid }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: environment - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.delete(`${prefix}/environment/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c environment:delete - api_environmentDelete 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c environment:delete - api_environmentDelete 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_groupCreate(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/group`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group:create - api_groupCreate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c group:create - api_groupCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_groupUpdate({ uuid, ...items }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: group - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.put(`${prefix}/group/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group:update - api_groupUpdate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c group:update - api_groupUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_groupDelete({ uuid }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: group - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.delete(`${prefix}/group?uuids=[${uuid}]`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c group:delete - api_groupDelete 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c group:delete - api_groupDelete 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_apiCreate(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/api_data`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api:create - api_apiCreate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c api:create - api_apiCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_apiUpdate({ uuid, ...items }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: api - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.put(`${prefix}/api_data/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api:update - api_apiUpdate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c api:update - api_apiUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_apiDelete({ uuid }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: api - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.delete(`${prefix}/api_data?uuids=[${uuid}]`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api:delete - api_apiDelete 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c api:delete - api_apiDelete 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_apiLoadApi({ uuid }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: api - loadApi 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/api_data/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c api:loadApi - api_apiLoadApi 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c api:loadApi - api_apiLoadApi 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_testCreate(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/api_test_history`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c test:create - api_testCreate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c test:create - api_testCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_testDelete({ uuid }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: test - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.delete(`${prefix}/api_test_history?uuids=[${uuid}]`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c test:delete - api_testDelete 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c test:delete - api_testDelete 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_mockCreate(params, prefix = '') {
    return new Promise(resolve => {
      this.http.post(`${prefix}/mock`, params).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock:create - api_mockCreate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c mock:create - api_mockCreate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_mockLoad({ uuid }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: mock - load 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.get(`${prefix}/mock/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock:load - api_mockLoad 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c mock:load - api_mockLoad 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_mockDelete({ uuid }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: mock - delete 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.delete(`${prefix}/mock/${uuid}`, {}).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock:delete - api_mockDelete 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c mock:delete - api_mockDelete 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }

  api_mockUpdate({ uuid, ...items }, prefix = '') {
    if (uuid == null) {
      console.log('%c Error: mock - update 接口 缺失参数 uuid %c', ErrorStyle, '');
      return;
    }

    return new Promise(resolve => {
      this.http.put(`${prefix}/mock/${uuid}`, { ...items }).subscribe({
        next: ({ status, data }: any) => {
          console.log('%c mock:update - api_mockUpdate 接口请求成功 %c', SuccessStyle, '');
          if ([200, 201].includes(status)) {
            return resolve([data, null]);
          }
          resolve([null, { status, ...data }]);
        },
        error: error => {
          console.log('%c mock:update - api_mockUpdate 接口请求失败 %c', ErrorStyle, '');
          resolve([null, error]);
        }
      });
    });
  }
}
