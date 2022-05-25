import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ExportApiComponent } from '../../../shared/components/export-api/export-api.component';
import { SyncApiComponent } from '../../../shared/components/sync-api/sync-api.component';
import { ImportApiComponent } from '../../../shared/components/import-api/import-api.component';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'eo-api-overview',
  templateUrl: './api-overview.component.html',
  styleUrls: ['./api-overview.component.scss'],
})
export class ApiOverviewComponent implements OnInit {
  constructor(private modalService: ModalService, private message: NzMessageService) {}

  ngOnInit(): void {}
  export() {
    let that = this;
    const modal: NzModalRef = this.modalService.create({
      nzTitle: '导出 API',
      nzContent: ExportApiComponent,
      nzClosable: false,
      nzComponentParams: {},
      nzOnOk() {
        modal.componentInstance.submit((isSuccess) => {
          if (isSuccess) {
            that.message.success('导出成功');
            modal.destroy();
          } else {
            that.message.error('导出失败');
          }
        });
      },
    });
  }
  import() {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: '导入 API',
      nzContent: ImportApiComponent,
      nzClosable: false,
      nzComponentParams: {},
      nzOnOk() {
        modal.componentInstance.submit((isSuccess) => {
          if (isSuccess) {
            this.message.success('导入成功');
            modal.destroy();
          } else {
            this.message.error('导入失败');
          }
        });
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
        modal.componentInstance.submit((isSuccess) => {
          if (isSuccess) {
            this.message.success('同步成功');
            modal.destroy();
          } else {
            this.message.error('同步失败');
          }
        });
      },
    });
  }
}
