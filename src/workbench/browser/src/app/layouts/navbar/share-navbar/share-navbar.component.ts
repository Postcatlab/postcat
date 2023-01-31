import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pc-share-navbar',
  template: `
    <div class="flex items-center justify-between eo-navbar">
      <div class="flex items-center">
        <eo-logo class="logo"></eo-logo>
        <!-- Star -->
        <a href="https://github.com/eolinker/postcat" target="_blank" class="flex items-center ml-[15px] electron-can-be-click">
          <img loading="lazy" src="https://img.shields.io/github/stars/eolinker/postcat?style=social" alt="" />
        </a>
      </div>
      <!-- Help -->
      <pc-help-dropdown></pc-help-dropdown>
      <!-- Web download client -->
      <pc-download-client></pc-download-client>
    </div>
  `,
  styles: []
})
export class ShareNavbarComponent {
  constructor() {}
}
