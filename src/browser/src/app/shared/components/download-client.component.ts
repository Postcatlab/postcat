import { Component } from '@angular/core';
import { WebService } from 'pc/browser/src/app/core/services';

@Component({
  selector: 'eo-download-client-modal',
  template: `
    <span i18n>Don't have Postcat Client?</span>
    <eo-ng-dropdown class="ml-5" btnType="primary" title="Download" [menus]="resourceInfo" [itemTmp]="downloadMenu"> </eo-ng-dropdown>
    <ng-template #downloadMenu let-item="item">
      <a [href]="item.link" traceID="download_client" [traceParams]="{ client_system: item.id }" trace>{{ item.name }}</a>
    </ng-template>
  `
})
export class DownloadClientModalComponent {
  resourceInfo;

  constructor(public web: WebService) {
    this.resourceInfo = this.web.resourceInfo;
  }
}
