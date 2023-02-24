import { Component } from '@angular/core';

import { ElectronService, WebService } from '../../../core/services';

@Component({
  selector: 'pc-help-dropdown',
  template: ` <button eo-ng-button nzType="text" class="flex items-center justify-center" eo-ng-dropdown [nzDropdownMenu]="helpMenu">
      <eo-iconpark-icon name="help"> </eo-iconpark-icon>
    </button>
    <eo-ng-dropdown-menu #helpMenu="nzDropdownMenu">
      <ul nz-menu>
        <a href="https://docs.postcat.com" target="_blank" trace traceID="jump_to_docs" nz-menu-item i18n>Document</a>
        <a [href]="web.githubBugUrl" target="_blank" nz-menu-item i18n trace traceID="report_issue">Report Issue</a>
      </ul>
    </eo-ng-dropdown-menu>`,
  styles: []
})
export class HelpDropdownComponent {
  constructor(public web: WebService) {}
}
