import { Component } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { ModalService } from '../../../shared/services/modal.service';
import { ExportApiComponent } from '../export-api/export-api.component';
import { ImportApiComponent } from '../import-api/import-api.component';
import { SyncApiComponent } from '../sync-api/sync-api.component';

const actionComponent = {
  push: SyncApiComponent,
  import: ImportApiComponent,
  export: ExportApiComponent
};
@Component({
  selector: 'eo-api-overview',
  templateUrl: './api-overview.component.html',
  styleUrls: ['./api-overview.component.scss']
})
export class ApiOverviewComponent {
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
