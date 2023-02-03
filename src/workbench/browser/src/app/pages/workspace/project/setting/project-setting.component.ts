import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun, toJS } from 'mobx';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { ExportApiComponent } from '../../../../modules/extension-select/export-api/export-api.component';
import { ImportApiComponent } from '../../../../modules/extension-select/import-api/import-api.component';
import { SyncApiComponent } from '../../../../modules/extension-select/sync-api/sync-api.component';
import { ModalService } from '../../../../shared/services/modal.service';
import { ApiService } from '../../../../shared/services/storage/api.service';

import { debug } from 'console';

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
  projectName: string;
  constructor(
    private modalService: ModalService,
    private message: EoNgFeedbackMessageService,
    public store: StoreService,
    private api: ApiService,
    private router: Router,
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
      desc: $localize`Delete project will clean all the project data，this action can not be recovered！ `,
      type: 'delete'
    }
  ];

  ngOnInit(): void {
    autorun(() => {
      this.projectName = this.store.getCurrentProject.name;
    });
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
    const modal = this.modalService.confirm({
      nzTitle: $localize`Are you sure delete this project?`,
      nzOkText: $localize`Delete`,
      nzOkDanger: true,
      nzOnOk: async () => {
        const [, err] = await this.api.api_projectDelete({ projectUuids: [this.store.getCurrentProjectID] });
        if (err) {
          return;
        }
        this.router.navigate(['/home/workspace/overview']);
        this.effect.updateProjects(this.store.getCurrentWorkspaceUuid);
        modal.destroy();
      }
    });
  }
  async changeProjectName(name) {
    if (!name) return;
    this.isLoading = true;
    const project = this.store.getCurrentProject;
    try {
      await this.effect.updateProject({ ...project, name });
      this.message.success($localize`Edited successfully`);
    } catch (error) {
      this.message.error($localize`Failed Operation`);
    }
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
            } else {
              this.message.error($localize`Failed to ${title},Please upgrade extension or try again later`);
            }
            resolve(true);
          });
        });
      }
    });
  }
}
