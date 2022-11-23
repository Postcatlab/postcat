import { Component } from '@angular/core';
import { WebService } from 'eo/workbench/browser/src/app/core/services';

@Component({
  selector: 'eo-download-client',
  template: `
    <span i18n>Don't have Eoapi Client?</span>
    <eo-ng-dropdown class="ml-5" btnType="primary" title="Download" [menus]="resourceInfo" [itemTmp]="downloadMenu">
    </eo-ng-dropdown>
    <ng-template #downloadMenu let-item="item">
      <a [href]="item.link">{{ item.name }}</a>
    </ng-template>
  `,
})
export class DownloadClienteComponent {
  resourceInfo = this.web.resourceInfo;

  constructor(public web: WebService) {}
}
