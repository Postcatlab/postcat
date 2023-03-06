import { Injectable } from '@angular/core';

import featureJSON from './feature.json';
type configKey = keyof typeof featureJSON;
@Injectable({
  providedIn: 'root'
})
export class FeatureControlService {
  config: { [key: configKey | string]: boolean };
  constructor() {
    this.config = featureJSON;
  }
  openFearure() {}
  closeFeature() {}
}
