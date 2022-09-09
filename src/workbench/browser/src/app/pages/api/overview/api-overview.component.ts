import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { EoMessageService } from '../../../eoui/message/eo-message.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ExportApiComponent } from '../../../shared/components/export-api/export-api.component';
import { SyncApiComponent } from '../../../shared/components/sync-api/sync-api.component';
import { ImportApiComponent } from '../../../shared/components/import-api/import-api.component';
import { ModalService } from '../../../shared/services/modal.service';
import { filter } from 'rxjs';

const actionComponent = {
  push: SyncApiComponent,
  import: ImportApiComponent,
  export: ExportApiComponent,
};
@Component({
  selector: 'eo-api-overview',
  templateUrl: './api-overview.component.html',
  styleUrls: ['./api-overview.component.scss'],
})
export class ApiOverviewComponent implements OnDestroy {
  modal: NzModalRef;
  constructor(private modalService: ModalService, private router: Router, private message: EoMessageService) {}
  overviewList = [
    {
      title: $localize`Import`,
      icon: 'afferent-three',
      desc: $localize`Import API data`,
      type: 'import',
    },
    {
      title: $localize`Export`,
      icon: 'efferent-three',
      desc: $localize`Export API data`,
      type: 'export',
    },
    {
      title: $localize`Push`,
      icon: 'send',
      desc: $localize`Push/Sync API to other platforms`,
      type: 'push',
    },
  ];

  handleClickCard = (event, item) => {
    if (event.target?.classList?.contains?.('ant-card-actions') || event.target?.closest('.ant-card-actions')) {
      this.clickCard(item);
    }
  };

  clickCard({ title, desc, type }) {
    this.modal = this.modalService.create({
      nzTitle: desc,
      nzContent: actionComponent[type],
      nzClosable: false,
      nzComponentParams: {},
      nzOnOk: () => {
        this.modal.componentInstance.submit((status) => {
          if (status) {
            this.message.success($localize`${title} successfully`);
            this.modal.destroy();
          } else {
            this.message.error($localize`Failed to ${title}`);
          }
        });
      },
    });
  }
  ngOnDestroy() {
    //TODO router change manual close modal
    if (this.modal) {
      this.modal.destroy();
    }
  }
}
