import { Component, OnInit } from '@angular/core';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import { ApiService } from '../../../services/storage/api.service';
import { StoreService } from '../../../store/state.service';

@Component({
  selector: 'pc-share-navbar',
  template: `
    <div class="flex items-center justify-between eo-navbar">
      <div class="flex items-center">
        <eo-logo class="logo"></eo-logo>
        <!-- Star -->
        <a [href]="APP_CONFIG.GITHUB_REPO_URL" target="_blank" class="flex items-center ml-[15px] electron-can-be-click">
          <img loading="lazy" src="https://img.shields.io/github/stars/postcatlab/postcat?style=social" alt="" />
        </a>
        <!-- Project Name -->
        <p class="ml-[15px]">{{ projectName }}</p>
      </div>
      <div class=" right-group-btn">
        <!-- Help -->
        <pc-help-dropdown></pc-help-dropdown>
        <!-- User -->
        <pc-btn-user></pc-btn-user>
        <!-- Web download client -->
        <pc-download-client></pc-download-client>
      </div>
    </div>
  `,
  styles: []
})
export class ShareNavbarComponent {
  projectName: string;
  readonly APP_CONFIG = APP_CONFIG;
  constructor(private api: ApiService, private store: StoreService) {
    this.initProjectName();
  }
  async initProjectName() {
    const [data, err] = await this.api.api_shareProjectDetail({ sharedUuid: this.store.getShareID });
    if (err) return;
    this.projectName = data.name;
  }
}
