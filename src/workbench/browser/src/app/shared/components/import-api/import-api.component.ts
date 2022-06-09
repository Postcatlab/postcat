import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';
import { FeatureType } from '../../types';

@Component({
  selector: 'eo-import-api',
  template: `<extension-select [(extension)]="importType" [extensionList]="supportList"></extension-select>`,
})
export class ImportApiComponent implements OnInit {
  supportList: Array<FeatureType> = [];
  importType = 'openapi';
  featureMap = window.eo.getFeature('apimanage.import');
  constructor(private storage: StorageService) {}
  ngOnInit(): void {
    this.featureMap?.forEach((data: FeatureType, key: string) => {
      this.supportList.push({
        key,
        ...data,
      });
    });
  }
  submit() {
    // console.log('import');
    // console.log(this.featureMap);
    const feature = this.featureMap.get('eoapi-import-openapi');
    const action = feature.action || null;
    // const filename = feature.filename || null;
    const module = window.eo.loadFeatureModule('eoapi-import-openapi');
    const data = module[action]();
    alert(JSON.stringify(data));
  }
}
