import { Component, Input } from '@angular/core';
import { MessageService } from 'pc/browser/src/app/services/message';

@Component({
  selector: 'extension-feedback',
  template: `
    <ng-container *ngIf="extensionLength; else empty">
      <ng-content></ng-content>
    </ng-container>
    <ng-template #empty>
      <div class="mb-4" i18n>
        This feature requires plugin support, please open <a (click)="openExtension()"> Extensions Hub </a>
        download or open exist extensions.
      </div>
    </ng-template>

    <ng-content select="demo"></ng-content>

    <ng-container *ngIf="extensionLength">
      <eo-ng-feedback-alert class="block mt-[15px]" nzType="default" [nzMessage]="templateRefMsg" nzShowIcon></eo-ng-feedback-alert>
      <ng-template #templateRefMsg>
        <div class="text" i18n>
          Couldn't find the {{ tipsText }} you were looking for?
          <a (click)="openExtension()">find more...</a>
        </div>
      </ng-template>
    </ng-container>
  `
})
export class ExtensionFeedbackComponent {
  @Input() extensionLength = 0;
  @Input() suggest = '';
  @Input() tipsText = $localize`format`;

  constructor(private messageService: MessageService) {}

  openExtension() {
    this.messageService.send({
      type: 'open-extension',
      data: { suggest: this.suggest }
    });
  }
}
