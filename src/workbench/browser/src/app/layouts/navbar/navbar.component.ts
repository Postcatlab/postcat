import { Component, OnInit } from '@angular/core';
import { ExtensionComponent } from 'eo/workbench/browser/src/app/pages/extension/extension.component';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { interval } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { ElectronService, WebService } from '../../core/services';
import { LanguageService } from '../../core/services/language/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { SettingComponent } from '../../modules/setting/setting.component';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  resourceInfo = this.web.resourceInfo;
  helpMenus = [
    {
      title: $localize`Document`,
      href: 'https://docs.eoapi.io',
      click: $event => {}
    },
    {
      title: $localize`Report Issue`,
      href: `https://github.com/eolinker/eoapi/issues/new?assignees=&labels=&template=bug_report.yml&environment=${this.getEnvironment()}`,
      click: $event => {}
    }
  ];
  constructor(
    public electron: ElectronService,
    private web: WebService,
    private modal: ModalService,
    private modalService: NzModalService,
    public theme: ThemeService,
    private message: MessageService,
    public lang: LanguageService,
    public store: StoreService,
    public dataSourceService: DataSourceService
  ) {}

  async ngOnInit(): Promise<void> {
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(async ({ type }) => {
        if (type === 'open-setting') {
          this.openSettingModal();
          return;
        }
        if (type === 'open-extension') {
          this.openExtension();
          return;
        }
      });
  }
  openExtension() {
    this.modalService.create({
      nzClassName: 'eo-extension-modal',
      nzWidth: '80%',
      nzTitle: $localize`Plugins Hub`,
      nzContent: ExtensionComponent,
      nzFooter: null
    });
  }

  loginOrSign() {
    this.dataSourceService.checkRemoteCanOperate();
  }
  loginOut() {
    this.message.send({ type: 'logOut', data: {} });
  }

  handleSwitchLang(event) {
    this.lang.changeLanguage(event);
  }

  /**
   * 打开系统设置
   */
  openSettingModal() {
    const ref = this.modal.create({
      nzClassName: 'eo-setting-modal',
      nzTitle: $localize`Setting`,
      nzContent: SettingComponent,
      withoutFooter: true
    });
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(({ type }) => {
        if (type === 'close-setting') {
          ref.close();
        }
      });
  }
  private getEnvironment(): string {
    let result = '';
    const systemInfo = this.electron.getSystemInfo();
    systemInfo.forEach(val => {
      if (['homeDir'].includes(val.id)) {
        return;
      }
      result += `- ${val.label}: ${val.value}\r\n`;
    });
    return encodeURIComponent(result);
  }
}
