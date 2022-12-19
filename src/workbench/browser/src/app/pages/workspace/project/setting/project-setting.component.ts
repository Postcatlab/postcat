import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { observable, makeObservable, reaction } from 'mobx';
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
  isLoading: boolean;
  @observable projectName: string;
  constructor(
    private modalService: ModalService,
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
      desc: $localize`Import data from other products`,
      type: 'import'
    },
    {
      title: $localize`Export`,
      icon: 'efferent',
      desc: $localize`Export Postcat project data`,
      type: 'export'
    },
    {
      title: $localize`Push`,
      icon: 'play-cycle',
      desc: $localize`Push/Sync API to other products`,
      type: 'push'
    },
    {
      title: $localize`Delete`,
      icon: 'play-cycle',
      desc: $localize`Delete project will clean all the project 
      data，this action can not be recovered！ `,
      type: 'delete'
    }
  ];

  ngOnInit(): void {
    makeObservable(this);
    reaction(
      () => this.store.getCurrentProject.name,
      name => {
        if (this.projectName === name) {
          return;
        }
        this.projectName = name;
      }
    );
  }

  clickItem(event, inParams) {
    switch (inParams.type) {
      case 'delete': {
        this.delete();
        break;
      }
      default: {
        this.handleClickCard(inParams);
        break;
      }
    }
  }
  private delete() {
    this.modalService.confirm({
      nzTitle: 'Are you sure delete this project?',
      nzOkText: $localize`Delete`,
      nzOkDanger: true,
      nzOnOk: () => {}
    });
  }
  async handleChangeProjectName(name) {
    this.isLoading = true;
    const project = this.store.getCurrentProject;
    const isOk: any = await this.effect.updateProject({ ...project, name });
    isOk ? this.message.success($localize`Edited successfully`) : this.message.error($localize`Failed Operation`);
    this.isLoading = false;
  }

  private handleClickCard({ title, desc, type }) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: desc,
      nzContent: actionComponent[type],
      nzComponentParams: {},
      nzOnOk: () => {
        return new Promise(resolve => {
          modal.componentInstance.submit(status => {
            if (status) {
              if (status === 'stayModal') {
                resolve(true);
                return;
              }
              this.message.success($localize`${title} successfully`);
              modal.destroy();
              resolve(true);
            } else {
              this.message.error($localize`Failed to ${title},Please upgrade extension or try again later`);
              resolve(true);
            }
          });
        });
      }
    });
  }
}
