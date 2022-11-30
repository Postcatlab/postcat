import { Injectable } from '@angular/core';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { NavigationExtras, Router } from '@angular/router';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage';
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';

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
    window.eo.loadFeatureModule ??= this.webExtensionService.importModule;
    window.eo.navigate = (commands: any[], extras?: NavigationExtras) => {
      this.router.navigate(commands, extras);
    };
    window.eo.getGroup = this.getGroup;
    // window.eo.getConfiguration = this.modalService;
  }

  list2tree = (data = [], parentID = 0) => {
    return data
      .filter((n) => n.parentID === parentID)
      .map(({ uuid, name }) => ({ id: uuid, name, children: this.list2tree(data, uuid) }));
  };

  getGroup = (projectID = this.projectService.currentProjectID) => {
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
}
