import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ExtensionService } from 'eo/workbench/browser/src/app/shared/services/extensions/extension.service';
import { TraceService } from 'eo/workbench/browser/src/app/shared/services/trace.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun, toJS } from 'mobx';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { ExportApiComponent } from '../../../../modules/extension-select/export-api/export-api.component';
import { ImportApiComponent } from '../../../../modules/extension-select/import-api/import-api.component';
import { PushApiComponent } from '../../../../modules/extension-select/push-api/push-api.component';
import { SyncApiComponent } from '../../../../modules/extension-select/sync-api/sync-api.component';
import { ModalService } from '../../../../shared/services/modal.service';
import { ApiService } from '../../../../shared/services/storage/api.service';

const actionComponent = {
  push: PushApiComponent,
  sync: SyncApiComponent,
  import: ImportApiComponent,
  export: ExportApiComponent
};
@Component({
  selector: 'eo-project-setting',
  templateUrl: './project-setting.component.html',
  styleUrls: ['./project-setting.component.scss']
})
export class ProjectSettingComponent implements OnInit {
  isLoading: boolean;
  projectName: string;
  isEdit = false;
  isInit = false;
  syncLoading = false;
  constructor(
    private modalService: ModalService,
    private message: EoNgFeedbackMessageService,
    public store: StoreService,
    private api: ApiService,
    private router: Router,
    private effect: EffectService,
    private extensionService: ExtensionService,
    private trace: TraceService
  ) {
    this.isLoading = false;
  }
  overviewList = [
    {
      title: $localize`Import`,
      icon: 'afferent',
      desc: $localize`Import data from other products`,
      type: 'import',
      traceID: 'click_import_project'
    },
    {
      title: $localize`Sync`,
      icon: 'play-cycle',
      btns: [
        {
          title: $localize`Sync`,
          type: 'sync',
          traceID: 'sync_api_from_url_success',
          loading: () => this.syncLoading,
          show: () => this.store.getSyncSettingList.length,
          onClick: async args => {
            this.syncLoading = true;
            const featureMap = this.extensionService.getValidExtensionsByFature('updateAPI');

            if (!featureMap.size) {
              this.message.info($localize`Please Install extension first`);
            }

            for (const [name, info] of featureMap) {
              const module = await this.extensionService.getExtensionPackage(name);
              await module[info.action]();
            }
            this.syncLoading = false;
            this.message.success($localize`Sync Successfully`);
            this.trace.report('sync_api_from_url_success');
          }
        },
        {
          title: $localize`Setting`,
          type: 'sync',
          desc: $localize`Sync API from URL`,
          onClick: args => this.handleClickCard(args)
        }
      ]
    },
    {
      title: $localize`Push`,
      icon: 'play-cycle',
      desc: $localize`Push API to other products`,
      type: 'push'
    },
    {
      title: $localize`Export`,
      icon: 'efferent',
      desc: $localize`Export Postcat project data`,
      type: 'export',
      traceID: 'click_export_project'
    },
    {
      title: $localize`Delete`,
      icon: 'play-cycle',
      desc: $localize`Delete project will clean all the project data，this action can not be recovered！ `,
      type: 'delete'
    }
  ];

  ngOnInit(): void {
    autorun(() => {
      this.projectName = this.store.getCurrentProject.name;
      this.isInit = true;
    });
  }

  startEditProjectName() {
    this.isEdit = true;
  }

  clickItem(inParams) {
    switch (inParams.type) {
      case 'delete': {
        this.delete();
        break;
      }
      default: {
        inParams.onClick ? inParams.onClick(inParams) : this.handleClickCard(inParams);
        break;
      }
    }
  }
  private delete() {
    const modal = this.modalService.confirm({
      nzTitle: $localize`Are you sure delete this project?`,
      nzOkText: $localize`Delete`,
      nzOkDanger: true,
      nzOnOk: async () => {
        const [, err] = await this.api.api_projectDelete({ projectUuids: [this.store.getCurrentProjectID] });
        if (err) {
          return;
        }
        this.router.navigate(['/home/workspace/overview/projects']);
        this.effect.updateProjects(this.store.getCurrentWorkspaceUuid);
        modal.destroy();
      }
    });
  }
  async changeProjectName(name) {
    if (!name) {
      return this.message.error($localize`Please input your projectName`);
    }
    const project = this.store.getCurrentProject;
    try {
      await this.effect.updateProject({ ...project, name });
      this.message.success($localize`Edited successfully`);
    } catch (error) {
      this.message.error($localize`Failed Operation`);
    }
    this.isEdit = false;
  }

  private handleClickCard({ title, desc, type }) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: desc,
      nzContent: actionComponent[type],
      nzComponentParams: {},
      nzFooter: [
        {
          label: $localize`Cancel`,
          onClick: () => modal.destroy()
        },
        {
          label: $localize`Sync Now`,
          show: () => actionComponent[type] === SyncApiComponent && modal.componentInstance?.supportList?.length,
          disabled: () => !modal.componentInstance?.isValid,
          onClick: async () => {
            await modal.componentInstance?.syncNow?.();
            modal.destroy();
          }
        },
        {
          label: actionComponent[type] === SyncApiComponent ? $localize`Save Config` : $localize`Confirm`,
          type: 'primary',
          onClick: () => {
            return new Promise(resolve => {
              modal.componentInstance.submit(status => {
                if (status) {
                  if (status === 'stayModal') {
                    resolve(true);
                    return;
                  }
                  //Sync API
                  if (actionComponent[type] === SyncApiComponent) {
                    this.message.success($localize` Save sync API config successfully`);
                    return resolve(true);
                  }

                  // Import API
                  this.message.success($localize`${title} successfully`);
                  // * For trace
                  const sync_platform = modal.componentInstance.currentExtension;
                  const workspace_type = this.store.isLocal ? 'local' : 'remote';
                  this.trace.report('import_project_success', { sync_platform, workspace_type });
                  modal.destroy();
                } else {
                  this.message.error($localize`Failed to ${title},Please upgrade extension or try again later`);
                }
                resolve(true);
              });
            });
          }
        }
      ]
    });
  }
}
