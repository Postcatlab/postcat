import { Injectable } from '@angular/core';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { NavigationExtras, Router } from '@angular/router';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { SidebarView } from 'eo/platform/node/extension-manager/types';

@Injectable({ providedIn: 'root' })
export class GlobalProvider {
  constructor(
    private modalService: ModalService,
    private router: Router,
    private settingService: SettingService,
    private webExtensionService: WebExtensionService,
    private storage: StorageService,
    private projectService: ProjectService
  ) {
    window.__POWERED_BY_EOAPI__ = true;
  }

  injectGlobalData() {
    window.eo ??= {};
    window.eo.modalService = this.modalService;
    window.eo.getExtensionSettings = this.settingService.getConfiguration;
    /** prload 里面同时有的方法 start */
    window.eo.getSidebarViews ??= this.getSidebarViews;
    window.eo.getSidebarView ??= this.getSidebarView;
    window.eo.loadFeatureModule ??= this.webExtensionService.importModule;
    /** prload 里面同时有的方法 end */
    window.eo.navigate = (commands: any[], extras?: NavigationExtras) => {
      this.router.navigate(commands, extras);
    };
    window.eo.getGroup = this.getGroup;
    window.eo.importProject = this.importProject;
    // window.eo.getConfiguration = this.modalService;
  }
  getSidebarView = (extName) => {
    return this.getSidebarViews()[0];
  };

  getSidebarViews = (): SidebarView[] => {
    const result = [];
    const sidebarView = this.webExtensionService.getFeatures('sidebarView');
    sidebarView?.size && result.push(...sidebarView.values());
    return result;
  };

  serializationData = (data) => {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      return error;
    }
  };

  getCurrentProjectID = () => {
    return this.projectService.currentProjectID;
  };

  list2tree = (data = [], parentID = 0) => {
    return data
      .filter((n) => n.parentID === parentID)
      .map(({ uuid, name }) => ({ id: uuid, name, children: this.list2tree(data, uuid) }));
  };

  getGroup = (projectID = this.getCurrentProjectID()) => {
    return new Promise(async (resolve) => {
      this.storage.run('groupLoadAllByProjectID', [projectID], (result: StorageRes) => {
        console.log('result', result);
        if (result.status === StorageResStatus.success) {
          const res = {
            status: 0,
            data: this.list2tree(result.data, 0),
          };
          resolve(res);
        } else {
          const res = {
            status: -1,
            data: null,
            error: result,
          };
          resolve(res);
        }
      });
    });
  };

  importProject = (params = {}) => {
    const { projectID, groupID, ...rest } = {
      projectID: this.getCurrentProjectID(), //没有传 projectID 默认获取当前项目
      groupID: 0, //没传 groupID 默认加入根分组
      collections: [], //分组、API 数据
      environments: [], //环境数据
      ...params,
    };
    console.log('projectID, rest, groupID', projectID, rest, groupID);
    return new Promise((resolve) => {
      this.storage.run('projectImport', [projectID, rest, groupID], (result: StorageRes) => {
        console.log('result', result);
        if (result.status === StorageResStatus.success) {
          resolve(
            this.serializationData({
              status: 0,
              ...result,
            })
          );
        } else {
          resolve(
            this.serializationData({
              status: -1,
              data: null,
              error: result,
            })
          );
        }
        console.log('projectImport result', result);
      });
    });
  };
}
