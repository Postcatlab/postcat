import { Component, OnInit } from '@angular/core';

import { ElectronService } from '../../../../core/services';
import pkg from '../../../../../../../../../package.json';

type DescriptionsItem = {
  readonly id: string;
  readonly label: string;
  value: string;
};

const descriptions: DescriptionsItem[] = [
  {
    id: 'version',
    label: 'Version',
    value: pkg.version,
  },
  // {
  //   id: 'publishTime',
  //   label: '发布日期',
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
@Component({
  selector: 'eo-about',
  template: `
    <div class="font-bold text-lg mb-2">About</div>
    <div class="about">
      <nz-descriptions [nzColumn]="1">
        <nz-descriptions-item *ngFor="let item of list" [nzTitle]="item.label">{{ item.value }}</nz-descriptions-item>
      </nz-descriptions>
    </div>
  `,
  styles: [
    `
      .about ::ng-deep .ant-descriptions-item-label {
        width: 112px;
        position: relative;
        padding-right: 16px;
        justify-content: flex-end;
      }
      .about ::ng-deep .ant-descriptions-item-label::after {
        position: absolute;
        right: 0;
      }
    `,
  ],
})
export class AboutComponent implements OnInit {
  list = descriptions;

  constructor(private electron: ElectronService) {}

  ngOnInit(): void {
    this.appendDetailWithElectron();
    // fetch('https://api.github.com/repos/eolinker/eoapi/releases')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const publishTime = data.find((n) => n.tag_name.slice(1) === pkg.version)?.published_at;
    //     const publishObj = this.list.find((n) => n.id === 'publishTime');
    //     if (publishTime) {
    //       publishObj.value = new Intl.DateTimeFormat('zh-CN', {
    //         year: 'numeric',
    //         month: '2-digit',
    //         weekday: 'long',
    //         day: '2-digit',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit',
    //         hour12: false,
    //       })
    //         .format(new Date(publishTime))
    //         .replace(/星期[^]?/, '');
    //     } else {
    //       publishObj.value = `当前版本(v${pkg.version})尚未发布`;
    //     }
    //   });
    const systemInfo = this.getSystemInfo();
    this.list.forEach((item) => {
      if (item.id in systemInfo) {
        item.value = systemInfo[item.id];
      }
    });
  }

  appendDetailWithElectron() {
    if (!this.electron.isElectron) {
      return;
    }

    // this.list = [...this.list, ...electronDetails];
    this.list.push(...electronDetails);
  }

  getSystemInfo() {
    const systemInfo = this.electron.ipcRenderer.sendSync('get-system-info');
    return systemInfo;
  }
}
