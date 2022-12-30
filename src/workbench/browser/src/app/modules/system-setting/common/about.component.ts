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
        <img loading="lazy" class="mx-4" src="https://img.shields.io/github/stars/eolinker/eoapi?style=social" alt="" />
      </a>
      <p i18n class="text-center mt-[15px]">
        Hi!~ If you like <b>Postcat</b>, please give the Postcat a Star!<br />Your support is our greatest motivation~
      </p>
      <a class="favor-image-link mt-[15px]" target="_blank" href="https://github.com/eolinker/eoapi">
        <img loading="lazy" class="w-[40px] favor-image align-middle" src="assets/images/heart.png" />
      </a>
      <nz-divider></nz-divider>
      <div class="w-[300px] text-[12px] text-center m-auto">
        <p *ngFor="let item of list" class="mt-[10px]">{{ item.label }}: {{ item.value }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  list;
  versionInfo;

  constructor(private electron: ElectronService, public theme: ThemeService) {}

  ngOnInit(): void {
    const result = this.electron.getSystemInfo();
    this.versionInfo = {
      version: result.shift().value
    };
    this.list = result;
  }
}
