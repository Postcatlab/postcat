import { Component } from '@angular/core';

import { ThemeService } from '../../../core/services/theme/theme.service';
import StorageUtil from '../../../shared/utils/storage/storage.utils';

@Component({
  selector: 'pc-debug-theme',
  template: `<div class="h-[80%]"
      ><eo-monaco-editor
        [autoFormat]="true"
        class="border-all"
        [(code)]="code"
        [eventList]="['format', 'copy', 'search', 'replace']"
      ></eo-monaco-editor></div
    ><button class="m-[15px]" eo-ng-button (click)="changeTheme()">Apply</button>`,
  styles: []
})
export class DebugThemeComponent {
  code: string;
  constructor(private theme: ThemeService) {
    const currentTheme = StorageUtil.get('pc_theme');
    this.code = JSON.stringify(currentTheme.colors);
  }
  changeTheme() {
    this.theme.changeCurrentThemeColorForDebug(JSON.parse(this.code));
  }
}
