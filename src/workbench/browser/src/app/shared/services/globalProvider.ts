import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { SidebarView } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { SocketService } from '../../pages/extension/socket.service';
import { MessageService } from './message';

@Injectable({ providedIn: 'root' })
export class GlobalProvider {
  modalMaskEl: HTMLDivElement;
  constructor(
    private modalService: ModalService,
    private router: Router,
    private settingService: SettingService,
    private webExtensionService: WebExtensionService,
    private storage: StorageService,
    private state: StoreService,
    private message: MessageService
  ) {
    window.__POWERED_BY_EOAPI__ = true;
    window.__POWERED_BY_POSTCAT__ = true;
  }

  injectGlobalData() {
    window.eo ??= {};
    window.eo.modalService = this.modalService;
    window.eo.getExtensionSettings = this.settingService.getConfiguration;
    window.eo.getSettings = this.settingService.settings;
    /** prload 里面同时有的方法 start */
    window.eo.getSidebarViews ??= this.getSidebarViews;
    window.eo.getSidebarView ??= this.getSidebarView;
    window.eo.loadFeatureModule ??= this.webExtensionService.importModule;
    /** prload 里面同时有的方法 end */
    window.eo.navigate = (commands: any[], extras?: NavigationExtras) => {
      const eoChangeRoute = {
        'home/api': 'home/workspace/project/api'
      };
      Object.keys(eoChangeRoute).forEach(pre => {
        const after = eoChangeRoute[pre];
        commands[0] = commands[0].replace(pre, after);
      });
      this.router.navigate(commands, extras);
    };
    window.eo.getGroups = window.eo.getGroup = this.getGroup;
    window.eo.importProject = this.importProject;
    // window.eo.getConfiguration = this.modalService;

    window.eo.showModalMask = this.showModalMask;
    window.eo.hideModalMask = this.hideModalMask;
    window.eo.getSystemInfo = this.getSystemInfo;
    window.eo.gRPC = {
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
  }
  getSidebarView = (extName): SidebarView | undefined => {
    return this.getSidebarViews().find(n => n.extensionID === extName);
  };
  getSidebarViews = (): SidebarView[] => {
    const sidebarView = this.webExtensionService.getFeatures<SidebarView>('sidebarView');
    return [...sidebarView.values()];
  };

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
  getSystemInfo() {}
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
