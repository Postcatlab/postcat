import { Component, Input, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { SettingService } from 'pc/browser/src/app/components/system-setting/settings.service';

@Component({
  selector: 'eo-extension-setting',
  template: `
    <div
      class="sticky top-0 py-[10px] border-solid border-0 border-b-[1px] z-10 mb-[3px]"
      style="border-color: var(--border-color); background-color: var(--background-color); border-bottom: 1px solid var(--system-border-color);"
    >
      <button eo-ng-button nzType="primary" (click)="handleSave()">Save</button>
    </div>

    <eo-schema-form [model]="localSettings" [configuration]="configuration" />
  `
})
export class ExtensionSettingComponent implements OnInit {
  @Input() configuration = {} as any;
  @Input() extName: string;
  localSettings = {} as Record<string, any>;

  constructor(private settingService: SettingService, private message: EoNgFeedbackMessageService) {}

  ngOnInit(): void {
    this.init();
  }

  private init() {
    this.localSettings = this.settingService.settings;
  }
  handleSave = () => {
    this.settingService.saveSetting(this.localSettings);
    this.message.success($localize`Save Success`);
  };
}
