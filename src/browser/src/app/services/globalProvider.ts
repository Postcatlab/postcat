import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SettingService } from 'pc/browser/src/app/components/system-setting/settings.service';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { parseAndCheckCollections } from 'pc/browser/src/app/services/storage/db/validate/validate';
import { StoreService } from 'pc/browser/src/app/store/state.service';

import { MessageService } from './message';
import { ApiService } from './storage/api.service';
import { convertApiData } from './storage/db/dataSource/convert';

/**
 * Provide global methods for the extension
 */
@Injectable({ providedIn: 'root' })
export class GlobalProvider {
  modalMaskEl: HTMLDivElement;
  constructor(
    private modalService: ModalService,
    private router: Router,
    private setting: SettingService,
    private store: StoreService,
    private api: ApiService,
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
    window.pc.getProjectSettings = async name => {
      const [data] = await this.api.api_projectGetSyncSettingList({});
      const target = data.find(n => n.pluginId === name);
      try {
        return JSON.parse(target.pluginSettingJson);
      } catch (error) {
        return target;
      }
    };
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
    window.pc.updateAPIData = (collections = []) => {
      return this.api.api_projectSyncBatchUpdate({ collections: parseAndCheckCollections(collections) });
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
    return this.store.getCurrentProjectID;
  };

  list2tree = (data = [], parentID = 0) => {
    return data.filter(n => n.parentID === parentID).map(({ uuid, name }) => ({ id: uuid, name, children: this.list2tree(data, uuid) }));
  };

  getGroup = async (projectID = this.getCurrentProjectID()) => {
    const [data, err] = await this.api.api_groupList({});
    const deep = inData => {
      inData.forEach(val => {
        val.uuid = val.id;
        if (inData.children?.length) {
          inData.childList = deep(inData.children);
          delete inData.children;
        }
      });
      return inData;
    };
    const result = {
      status: 0,
      data: deep(data.at(0).children)
    };
    return result;
  };
  importProject = async (params = {}) => {
    const currentProjectID = this.getCurrentProjectID();
    let { projectID, groupID, ...rest } = {
      projectID: currentProjectID, //没有传 projectID 默认获取当前项目
      groupID: 0, //没传 groupID 默认加入根分组
      collections: [], //分组、API 数据
      environments: [], //环境数据
      ...params
    };
    // console.log('projectID, rest, groupID', projectID, rest, groupID);
    if (groupID === 0) {
      const [groupList, err] = await this.api.api_groupList({});
      const rootGroup = groupList.at(0);
      groupID = rootGroup.id;
    }
    const [groups] = await this.api.api_groupCreate(
      rest.collections.map(n => ({
        type: 1,
        name: n.name,
        parentId: groupID,
        projectUuid: this.getCurrentProjectID(),
        workSpaceUuid: this.store.getCurrentWorkspaceUuid
      }))
    );
    console.log('groups', groups);

    const apiCreatePromises = rest.collections.map(async (item, index) => {
      const group = groups[index];
      const apiList = item.children.map(n => ({ ...convertApiData(n), groupId: group.id }));
      return await this.api.api_apiDataCreate({ apiList });
    });

    const [[data]] = await Promise.all(apiCreatePromises);

    const result = this.serializationData({
      status: 200,
      data: {
        successes: {
          apiData: data
        }
      }
    });
    // console.log('importProject result', result);
    return result;
  };
}
