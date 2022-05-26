import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage';

type FeatureType = {
  icon: string;
  label: string;
  description: string;
};

@Component({
  selector: 'eo-import-api',
  templateUrl: './import-api.component.html',
  styleUrls: ['./import-api.component.scss'],
})
export class ImportApiComponent implements OnInit {
  supportList: Array<{
    key: string;
    image: string;
    title: string;
  }> = [];
  importType = 'postman';
  featureList = window.eo.getFeature('apimanage.import');
  constructor(private storage: StorageService) {}
  ngOnInit(): void {
    // this.supportList = this.supportList.concat(
    //   this.featureList.map(({ icon, label }: FeatureType, key: string) => ({
    //     key,
    //     image: icon,
    //     title: label,
    //   }))
    // );
    this.featureList?.forEach((feature: FeatureType, key: string) => {
      this.supportList.push({
        key,
        image: feature.icon,
        title: feature.label,
      });
    });
  }
  submit() {
    // console.log('import');
    // console.log(this.featureList);
    const feature = this.featureList.get('eoapi-import-openapi');
    const action = feature.action || null;
    // const filename = feature.filename || null;
    const module = window.eo.loadFeatureModule('eoapi-import-openapi');
    const data = module[action]();
    alert(JSON.stringify(data));
  }
}
