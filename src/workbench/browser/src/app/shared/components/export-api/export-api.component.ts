import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { StorageService } from '../../../shared/services/storage';

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
  exportEoapi() {}
  submit() {
    switch (this.exportType) {
      case 'eoapi': {
        this.exportEoapi();
        break;
      }
    }
    console.log('export');
  }
}
