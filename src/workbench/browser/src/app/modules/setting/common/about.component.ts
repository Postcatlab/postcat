import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'eo/workbench/browser/src/app/core/services/theme.service';

import { ElectronService } from '../../../core/services';
@Component({
  selector: 'eo-about',
  template: `
    <div class="about flex flex-col justify-center items-center">
      <img
        loading="lazy"
        class="logo mt-[30px] w-[150px] h-[150px]"
        src="assets/images/{{ theme.appearance === 'dark' ? 'logo.svg' : 'logo.svg' }}"
      />
      <p class="font-bold mt-[15px] text-[16px]">Postcat</p>
      <p class="">V{{ versionInfo?.version }}</p>
      <!-- star -->
      <a href="https://github.com/eolinker/eoapi" target="_blank" class="flex items-center mt-[15px]">
        <img class="mx-4" src="https://img.shields.io/github/stars/eolinker/eoapi?style=social" alt="" />
      </a>
      <p class="text-center mt-[15px]">
        Hi!~ If you like <b>Postcat</b>, please give the Postcat a Star!<br />Your support is our greatest motivation~
      </p>
      <a class="favor-image-link mt-[15px]" href="https://github.com/eolinker/eoapi">
        <img class="w-[40px] align-middle" src="assets/images/heart.png" />
      </a>
      <nz-divider></nz-divider>
      <nz-descriptions [nzColumn]="1">
        <nz-descriptions-item *ngFor="let item of list" [nzTitle]="item.label">{{ item.value }}</nz-descriptions-item>
      </nz-descriptions>
    </div>
  `,
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  list = this.electron.getSystemInfo();
  versionInfo;

  constructor(private electron: ElectronService, public theme: ThemeService) {}

  ngOnInit(): void {
    this.versionInfo = {
      version: this.list[0].value
    };
  }
}
