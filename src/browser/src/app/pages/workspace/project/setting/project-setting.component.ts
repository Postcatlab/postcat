import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun, toJS } from 'mobx';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ExtensionService } from 'pc/browser/src/app/services/extensions/extension.service';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { EffectService } from 'pc/browser/src/app/store/effect.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';

import { ExportApiComponent } from '../../../../components/extension-select/export-api/export-api.component';
import { ImportApiComponent } from '../../../../components/extension-select/import-api/import-api.component';
import { PushApiComponent } from '../../../../components/extension-select/push-api/push-api.component';
import { SyncApiComponent } from '../../../../components/extension-select/sync-api/sync-api.component';
import { ModalService } from '../../../../services/modal.service';
import { ApiService } from '../../../../services/storage/api.service';

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
  @ViewChild('inputRef') inputRef: ElementRef<HTMLInputElement>;

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
      desc: $localize`Sync API from URL`,
      btns: [
        {
          title: $localize`Sync`,
          type: 'sync',
          traceID: 'sync_api_from_url_success',
          loading: () => this.syncLoading,
          show: () => this.store.getSyncSettingList?.length,
          onClick: async args => {
            this.syncLoading = true;
            const featureMap = this.extensionService.getValidExtensionsByFature('pullAPI');

            if (!featureMap.size) {
              return this.message.info($localize`Please install extension first`);
            }

            for (const [name, info] of featureMap) {
              const module = await this.extensionService.getExtensionPackage(name);
              const [, err] = await module[info.action]();
              if (err) {
                this.message.error(err);
                this.syncLoading = false;
                return Promise.reject(err);
              }
            }
            this.syncLoading = false;
            this.message.success($localize`Sync successfully`);
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
    setTimeout(() => {
      this.inputRef.nativeElement.focus();
    });
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
          label: actionComponent[type] === SyncApiComponent ? $localize`Save and Sync` : $localize`Confirm`,
          type: 'primary',
          disabled: () => !modal.componentInstance?.isValid,
          onClick: () => {
            return new Promise(resolve => {
              modal.componentInstance.submit(status => {
                if (!status) {
                  this.message.error($localize`Failed to ${title},Please upgrade extension or try again later`);
                  return resolve(true);
                }
                if (status === 'stayModal') {
                  return resolve(true);
                }
                this.message.success($localize`${title} successfully`);
                resolve(true);
                modal.destroy();
              });
            });
          }
        }
      ]
    });
  }
}
