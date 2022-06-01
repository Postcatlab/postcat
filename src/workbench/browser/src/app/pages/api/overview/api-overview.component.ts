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
    // {
    //   title: '导入',
    //   icon: 'import',
    //   desc: '导入 API 数据',
    //   type: 'import',
    // },
    {
      title: '导出',
      icon: 'export',
      desc: '导出 API 数据',
      type: 'export',
    },
    {
      title: '推送',
      icon: 'sync',
      desc: '将 API 推送/同步到其他平台',
      type: 'push',
    },
  ];

  clickCard({ title, desc, type }) {
    this.modal = this.modalService.create({
      nzTitle: desc,
      nzContent: actionComponent[type],
      nzClosable: false,
      nzComponentParams: {},
      nzOnOk: () => {
        this.modal.componentInstance.submit((status) => {
          if (status) {
            this.message.success(`${title}成功`);
            this.modal.destroy();
          } else {
            this.message.error(`${title}失败`);
          }
        });
      },
    });
  }
  ngOnDestroy() {
    //TODO router change manual close modal
    this.modal.destroy();
  }
}
