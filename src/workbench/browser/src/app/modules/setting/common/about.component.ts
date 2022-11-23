import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../core/services';
@Component({
  selector: 'eo-about',
  template: `
    <div class="font-bold text-lg mb-2" i18n>About</div>
    <div class="about">
      <nz-descriptions [nzColumn]="1">
        <nz-descriptions-item *ngFor="let item of list" [nzTitle]="item.label">{{ item.value }}</nz-descriptions-item>
      </nz-descriptions>
    </div>
  `,
  styleUrls:['./about.component.scss'] ,
})
export class AboutComponent implements OnInit {
  list = this.electron.getSystemInfo();

  constructor(private electron: ElectronService) {}

  ngOnInit(): void {
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
  }
}
