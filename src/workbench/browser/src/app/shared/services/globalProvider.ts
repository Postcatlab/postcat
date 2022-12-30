import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { MessageService } from './message';

@Injectable({ providedIn: 'root' })
export class GlobalProvider {
  modalMaskEl: HTMLDivElement;
  constructor(
    private modalService: ModalService,
    private router: Router,
    private storage: StorageService,
    private state: StoreService,
    private setting: SettingService,
    private message: MessageService
  ) {
    //TODO compatible with old version
    window.__POWERED_BY_EOAPI__ = true;
    window.__POWERED_BY_POSTCAT__ = true;
  }

  injectGlobalData() {
    window.pc = {};
    window.pc.modalService = this.modalService;
    window.pc.getExtensionSettings = this.setting.getConfiguration;
    /** prload 里面同时有的方法 end */
    window.pc.navigate = (commands: any[], extras?: NavigationExtras) => {
      if (commands[0] === 'home/extension/detail') {
        return;
      }
      const eoChangeRoute = {
        'home/api': 'home/workspace/project/api'
      };
      Object.keys(eoChangeRoute).forEach(pre => {
        const after = eoChangeRoute[pre];
        commands[0] = commands[0].replace(pre, after);
      });
      console.log(commands[0]);
      this.router.navigate(commands, extras);
    };
    window.pc.getGroups = window.pc.getGroup = this.getGroup;
    window.pc.importProject = this.importProject;

    window.pc.showModalMask = this.showModalMask;
    window.pc.hideModalMask = this.hideModalMask;
    window.pc.gRPC = {
      send: params =>
        new Promise(resolve => {
          const subscription = this.message.get().subscribe(({ type, data }) => {
            if (type === 'msg-grpc-back') {
              // data: [res, err]
              subscription.unsubscribe();
              resolve(data);
              return;
            }
          });
          this.message.send({ type: 'msg-grpc', data: params });
        })
    };
    window.eo = window.pc;
  }
  showModalMask = (style = {}) => {
    this.modalMaskEl?.remove();
    this.modalMaskEl = document.createElement('div');
    this.modalMaskEl.classList.add('ant-modal-mask', 'cdk-overlay-backdrop-showing');
    document.body.appendChild(this.modalMaskEl);
    this.modalMaskEl.classList.add('cdk-overlay-backdrop');
    const iframeWrapper = document.querySelector<HTMLDivElement>('.extension-app');
    if (iframeWrapper) {
      iframeWrapper.style.zIndex = '10000';
    }
    // this.modalMaskEl.onclick = () => {
    //   this.hideModalMask();
    // };
    Object.entries(style).forEach(([key, value]) => {
      this.modalMaskEl.style[key] = value;
    });
  };

  hideModalMask = () => {
    this.modalMaskEl.style.display = 'none';
    this.modalMaskEl.classList.remove('cdk-overlay-backdrop');
    this.modalMaskEl.remove();
    const iframeWrapper = document.querySelector<HTMLDivElement>('.extension-app');
    if (iframeWrapper) {
      iframeWrapper.style.zIndex = 'unset';
    }
  };

  serializationData = data => {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      return error;
    }
  };

  getCurrentProjectID = () => {
    return this.state.getCurrentProjectID;
  };

  list2tree = (data = [], parentID = 0) => {
    return data.filter(n => n.parentID === parentID).map(({ uuid, name }) => ({ id: uuid, name, children: this.list2tree(data, uuid) }));
  };

  getGroup = (projectID = this.getCurrentProjectID()) => {
    return new Promise(resolve => {
      this.storage.run('groupLoadAllByProjectID', [projectID], (result: StorageRes) => {
        console.log('result', result);
        if (result.status === StorageResStatus.success) {
          const res = {
            status: 0,
            data: this.list2tree(result.data, 0)
          };
          resolve(res);
        } else {
          const res = {
            status: -1,
            data: null,
            error: result
          };
          resolve(res);
        }
      });
    });
  };
  importProject = (params = {}) => {
    const currentProjectID = this.getCurrentProjectID();
    const { projectID, groupID, ...rest } = {
      projectID: currentProjectID, //没有传 projectID 默认获取当前项目
      groupID: 0, //没传 groupID 默认加入根分组
      collections: [], //分组、API 数据
      environments: [], //环境数据
      ...params
    };
    console.log('projectID, rest, groupID', projectID, rest, groupID);
    return new Promise(resolve => {
      // 只能导入到当前 项目 所以 currentProjectID写死。。。
      this.storage.run('projectImport', [currentProjectID, rest, groupID], (result: StorageRes) => {
        console.log('result', result);
        if (result.status === StorageResStatus.success) {
          resolve(
            this.serializationData({
              status: 0,
              ...result
            })
          );
        } else {
          resolve(
            this.serializationData({
              status: -1,
              data: null,
              error: result
            })
          );
        }
        console.log('projectImport result', result);
      });
    });
  };
}
