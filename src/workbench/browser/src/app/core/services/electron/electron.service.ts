import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import pkg from '../../../../../../../../package.json';
import { getBrowserType } from 'eo/workbench/browser/src/app/utils/browser-type';
import { getSettings } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/Storage';

type DescriptionsItem = {
  readonly id: string;
  readonly label: string;
  value: string;
};
@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;
  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
  getSystemInfo(): DescriptionsItem[] {
    const descriptions: DescriptionsItem[] = [
      {
        id: 'version',
        label: $localize`Version`,
        value: pkg.version,
      },
      // {
      //   id: 'publishTime',
      //   label: $localize`Publish Time`,
      //   value: '',
      // },
    ];

    const electronDetails: DescriptionsItem[] = [
      {
        id: 'homeDir',
        label: 'Install Location',
        value: '',
      },
      {
        id: 'electron',
        label: 'Electron',
        value: '',
      },
      {
        id: 'chrome',
        label: 'Chromium',
        value: '',
      },
      {
        id: 'node',
        label: 'Node.js',
        value: '',
      },
      {
        id: 'v8',
        label: 'V8',
        value: '',
      },
      {
        id: 'os',
        label: 'OS',
        value: '',
      },
    ];

    if (this.isElectron) {
      descriptions.push(...electronDetails);
    } else {
      const browserType = getBrowserType(getSettings()?.['eoapi-language']);
      descriptions.push(
        ...Object.entries<string>(browserType).map(([key, value]) => ({
          id: key,
          label: key.replace(/^\S/, (s) => s.toUpperCase()),
          value,
        }))
      );
    }
    const systemInfo =
      this.ipcRenderer?.sendSync('get-system-info') || getBrowserType(getSettings()?.['eoapi.language']);
    descriptions.forEach((item) => {
      if (item.id in systemInfo) {
        item.value = systemInfo[item.id];
      }
    });

    // remote server version
    const serverVersion = StorageUtil.get('server_version');
    if (serverVersion) {
      descriptions.push({
        id: 'server',
        label: 'Server',
        value: serverVersion,
      });
    }

    return descriptions;
  }
}
