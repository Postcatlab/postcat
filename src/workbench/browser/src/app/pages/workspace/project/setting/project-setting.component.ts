import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
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
export class ProjectSettingComponent {
  modal: NzModalRef;
  constructor(private modalService: ModalService, private message: EoNgFeedbackMessageService) {}
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

  handleClickCard = (event, item) => {
    this.clickCard(item);
  };

  clickCard({ title, desc, type }) {
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
