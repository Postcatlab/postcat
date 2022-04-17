import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MessageService } from '../../../shared/services/message';
import { StorageService } from '../../../shared/services/storage';

@Component({
  selector: 'eo-export-api',
  templateUrl: './export-api.component.html',
  styleUrls: ['./export-api.component.scss'],
})
export class ExportApiComponent implements OnInit {
  exportType:'eoapi'
  constructor(
    private modalRef: NzModalRef,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
  }
  submit(){
    console.log('export')
  }
}
