import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { StorageService } from '../../../shared/services/storage';
import { StorageHandleResult, StorageHandleStatus } from '../../../../../../../platform/browser/IndexedDB';
@Component({
  selector: 'eo-export-api',
  templateUrl: './export-api.component.html',
  styleUrls: ['./export-api.component.scss'],
})
export class ExportApiComponent implements OnInit {
  exportType: string = 'eoapi';
  supportList: any[] = [
    {
      key: 'eoapi',
      image:'',
      title: 'Eoapi(.json)',
    },
    {
      key: 'openapi3',
      image:'',
      title: 'Swagger V3.0',
    },
  ];
  constructor(private modalRef: NzModalRef, private storage: StorageService) {}
  ngOnInit(): void {}
  exportEoapi() {
    this.storage.run('projectExport', [], (result: StorageHandleResult) => {
      console.log(result)
      if (result.status === StorageHandleStatus.success) {
      } else {
      }
    });
  }
  submit() {
    switch (this.exportType) {
      case 'eoapi': {
        this.exportEoapi();
        break;
      }
    }
  }
}
