import { Component, OnInit } from '@angular/core';
import { processEnv } from 'eo/platform/node/constant';
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
  }> = [
    {
      key: 'postman',
      image: '',
      title: 'Postman(.json)',
    },
    {
      key: 'openapi',
      image: '',
      title: 'OpenAPI(.json)',
    },
  ];
  importType = 'postman';
  featureList = window.eo.getFeature('apimanage.import');
  constructor(private storage: StorageService) {}
  ngOnInit(): void {
    // this.supportList = this.supportList.concat(
    //   this.featureList.map((feature: FeatureType, key: string) => ({ key, image: feature.icon, title: feature.label }))
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
    console.log('import');
  }
}
