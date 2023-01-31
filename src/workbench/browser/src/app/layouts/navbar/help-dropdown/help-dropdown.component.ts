import { Component } from '@angular/core';

import { ElectronService } from '../../../core/services';

@Component({
  selector: 'pc-help-dropdown',
  template: ` <button
      eo-ng-button
      nzType="text"
      class="flex items-center justify-center mr-[10px]"
      eo-ng-dropdown
      [nzDropdownMenu]="helpMenu"
    >
      <eo-iconpark-icon name="help"> </eo-iconpark-icon>
    </button>
    <eo-ng-dropdown-menu #helpMenu="nzDropdownMenu">
      <ul nz-menu>
        <a href="https://docs.postcat.com" target="_blank" nz-menu-item i18n>Document</a>
        <a
          href="https://github.com/eolinker/postcat/issues/new?assignees=&labels=&template=bug_report.yml&environment={{
            issueEnvironment
          }}"
          target="_blank"
          nz-menu-item
          i18n
          >Report Issue</a
        >
      </ul>
    </eo-ng-dropdown-menu>`,
  styles: []
})
export class HelpDropdownComponent {
  helpMenus = [
    {
      title: $localize`Document`,
      href: 'https://docs.postcat.com',
      itemClick: $event => {}
    },
    {
      title: $localize`Report Issue`,
      href: `https://github.com/eolinker/postcat/issues/new?assignees=&labels=&template=bug_report.yml&environment=${this.getEnvironment()}`,
      itemClick: $event => {}
    }
  ];
  constructor(private electron: ElectronService) {}
  issueEnvironment = this.getEnvironment();
  private getEnvironment(): string {
    let result = '';
    const systemInfo = this.electron?.getSystemInfo();
    systemInfo?.forEach(val => {
      if (['homeDir'].includes(val.id)) {
        return;
      }
      result += `- ${val.label}: ${val.value}\r\n`;
    });
    return encodeURIComponent(result);
  }
}
