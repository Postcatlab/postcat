import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { observable, makeObservable, reaction, autorun } from 'mobx';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { ExportApiComponent } from '../../../../modules/extension-select/export-api/export-api.component';
import { ImportApiComponent } from '../../../../modules/extension-select/import-api/import-api.component';
import { SyncApiComponent } from '../../../../modules/extension-select/sync-api/sync-api.component';
import { ModalService } from '../../../../shared/services/modal.service';

const actionComponent = {
  push: SyncApiComponent,
  import: ImportApiComponent,
  export: ExportApiComponent
};
@Component({
  selector: 'eo-project-setting',
  templateUrl: './project-setting.component.html',
  styleUrls: ['./project-setting.component.scss']
})
export class ProjectSettingComponent implements OnInit {
  modal: NzModalRef;
  isLoading: boolean;
  @observable projectName: string;
  constructor(
    private modalService: ModalService,
    private storage: StorageService,
    private message: EoNgFeedbackMessageService,
    private store: StoreService,
    private effect: EffectService
  ) {
    this.isLoading = false;
  }
  overviewList = [
    {
      title: $localize`Import`,
      icon: 'afferent',
      desc: $localize`:@@ImportAPI:Import API`,
      type: 'import'
    },
    {
      title: $localize`Export`,
      icon: 'efferent',
      desc: $localize`Export API`,
      type: 'export'
    },
    {
      title: $localize`Push`,
      icon: 'play-cycle',
      desc: $localize`Push/Sync API to other platforms`,
      type: 'push'
    }
  ];

  ngOnInit(): void {
    makeObservable(this);
    const { name } = this.store.getCurrentProject;
    this.projectName = name;
  }

  async handleChangeProjectName(name) {
    this.isLoading = true;
    const project = this.store.getCurrentProject;
    const isOk: any = await this.effect.updateProject({ ...project, name });
    isOk ? this.message.success($localize`Edited successfully`) : this.message.error($localize`Failed Operation`);
    this.isLoading = false;
  }

  handleClickCard(event, { title, desc, type }) {
    this.modal = this.modalService.create({
      nzTitle: desc,
      nzContent: actionComponent[type],
      nzComponentParams: {},
      nzOnOk: () => {
        this.modal.componentInstance.submit(status => {
          if (status) {
            this.message.success($localize`${title} successfully`);
            this.modal.destroy();
          } else {
            this.message.error($localize`Failed to ${title},Please upgrade extension or try again later`);
            return Promise.resolve();
          }
        });
      }
    });
  }
}
