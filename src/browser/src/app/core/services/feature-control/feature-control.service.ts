import { Injectable } from '@angular/core';
import { Message, MessageService } from 'pc/browser/src/app/services/message';

import featureJSON from './feature.json';
type configKey = keyof typeof featureJSON;
@Injectable({
  providedIn: 'root'
})
export class FeatureControlService {
  config: { [key: configKey | string]: boolean };
  constructor(private message: MessageService) {
    this.config = featureJSON;
  }
  init() {
    this.watchExtensionChange();
  }
  watchExtensionChange() {
    this.message.get().subscribe((inArg: Message) => {
      if (inArg.type !== 'extensionsChange') return;
      const extension = inArg.data.extension;
      if (!extension?.features?.featureControl?.length) return;
      let aciton = inArg.data.action;
      if (inArg.data.action === 'init') {
        aciton = extension.enable ? 'enable' : 'disable';
      }
      switch (aciton) {
        case 'install':
        case 'enable': {
          this.openFearure(extension?.features?.featureControl);
          break;
        }
        case 'disable':
        case 'uninstall': {
          this.closeFeature(extension?.features?.featureControl);
          break;
        }
      }
    });
  }
  openFearure(features) {
    features.forEach(({ id }) => {
      this.config[id] = true;
    });
  }
  closeFeature(features) {
    features.forEach(({ id }) => {
      this.config[id] = false;
    });
  }
}
