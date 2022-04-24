import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ExportApiComponent } from '../../../shared/components/export-api/export-api.component';
import { SyncApiComponent } from '../../../shared/components/sync-api/sync-api.component';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'eo-api-overview',
  templateUrl: './api-overview.component.html',
  styleUrls: ['./api-overview.component.scss'],
})
export class ApiOverviewComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}
  export() {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: '导出 API',
      nzContent: ExportApiComponent,
      nzClosable: false,
      nzComponentParams: {},
      nzOnOk() {
        modal.componentInstance.submit();
      },
    });
  }
  sync() {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: '推送 API',
      nzContent: SyncApiComponent,
      nzClosable: false,
      nzComponentParams: {},
      nzOnOk() {
        modal.componentInstance.submit();
      },
    });
  }
}
