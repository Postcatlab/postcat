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
  supportList: any[] = [];
  constructor(private modalRef: NzModalRef, private storage: StorageService) {}

  ngOnInit(): void {
    const extensionList = window.eo.getModules();
    this.supportList = Object.values([...extensionList])
      .map((it) => it[1])
      .filter((it) => it.moduleType === 'feature')
      .filter((it) => it.features['apimanager.sync'])
      .map((it: any) => ({
        key: it.moduleName,
        image: it.logo,
        title: it.features['apimanager.sync'].label,
      }));
  }
  submit() {
    console.log('sync');
  }
}
