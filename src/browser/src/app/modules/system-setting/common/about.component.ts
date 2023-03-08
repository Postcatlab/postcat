import { Component, OnInit } from '@angular/core';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import { WebService } from '../../../core/services';
@Component({
  selector: 'eo-about',
  template: `
    <div class="about flex flex-col justify-center items-center">
      <eo-logo class="logo mt-[30px] w-[150px] h-[150px]"></eo-logo>
      <p class="font-bold mt-[15px] text-[16px]">Postcat</p>
      <p class="">V{{ versionInfo?.version }}</p>
      <!-- Star -->
      <a
        [href]="APP_CONFIG.GITHUB_REPO_URL"
        target="_blank"
        class="flex items-center mt-[15px]"
        trace
        traceID="jump_to_github"
        [traceParams]="{ where_jump_to_github: 'star' }"
      >
        <img loading="lazy" class="mx-4" src="https://img.shields.io/github/stars/postcatlab/postcat?style=social" alt="" />
      </a>
      <!-- Star motivation -->
      <pc-star-motivation></pc-star-motivation>
      <nz-divider></nz-divider>
      <!-- System info -->
      <div class="w-[300px] text-[12px] text-center m-auto">
        <p *ngFor="let item of list" class="mt-[10px]">{{ item.label }}: {{ item.value }}</p>
      </div>
    </div>
  `
})
export class AboutComponent implements OnInit {
  list;
  versionInfo;
  readonly APP_CONFIG = APP_CONFIG;
  constructor(private web: WebService) {}

  ngOnInit(): void {
    const result = this.web.getSystemInfo();
    this.versionInfo = {
      version: result.shift().value
    };
    this.list = result;
  }
}
