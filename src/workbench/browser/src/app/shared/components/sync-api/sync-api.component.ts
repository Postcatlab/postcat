import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'eo-sync-api',
  templateUrl: './sync-api.component.html',
  styleUrls: ['./sync-api.component.scss'],
})
export class SyncApiComponent implements OnInit {
  exportType: string = 'eolink';
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
