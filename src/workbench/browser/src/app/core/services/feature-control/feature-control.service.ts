import { Injectable } from '@angular/core';
import { ExtensionInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';

import featureJSON from './feature.json';
type configKey = keyof typeof featureJSON;
@Injectable({
  providedIn: 'root'
})
export class FeatureControlService {
  config: { [key: configKey | string]: boolean };
  constructor(private message: MessageService) {
    this.config = featureJSON;
    this.watchExtensionChange();
  }
  watchExtensionChange() {
    this.message.get().subscribe((inArg: Message) => {
      if (inArg.type !== 'extensionsChange') return;
      const extension = inArg.data.extension;
      if (!extension?.features?.featureControl?.length) return;
      switch (inArg.data.action) {
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
