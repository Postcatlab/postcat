import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ElectronService } from 'pc/browser/src/app/core/services';
import { LanguageService } from 'pc/browser/src/app/core/services/language/language.service';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { ExtensionInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import { WebService } from '../../../../core/services/web/web.service';
import { ExtensionService } from '../../../../services/extensions/extension.service';
import { EoExtensionInfo } from '../extension.model';

@Component({
  selector: 'eo-extension-detail',
  templateUrl: './extension-detail.component.html',
  styleUrls: ['./extension-detail.component.scss']
})
export class ExtensionDetailComponent implements OnInit {
  @Input() extensionData: ExtensionInfo | null = null;
  @Output() readonly goBack: EventEmitter<any> = new EventEmitter();
  @Input() nzSelectedIndex = 0;
  isOperating = false;
  introLoading = false;
  isAvailableElectron = true;
  changelogLoading = false;
  isNotLoaded = true;
  extensionDetail: EoExtensionInfo;
  readonly APP_CONFIG = APP_CONFIG;
  changeLog = '';
  changeLogNotFound = false;
  constructor(
    public extensionService: ExtensionService,
    private webService: WebService,
    private electron: ElectronService,
    private language: LanguageService,
    private trace: TraceService
  ) {}

  ngOnInit(): void {
    this.getDetail();
  }
  jumpToClient() {
    this.webService.jumpToClient($localize`Postcat Client is required to use this extension.`);
  }
  async handleInstall() {
    this.manageExtension(this.extensionDetail?.installed ? 'uninstall' : 'install', this.extensionDetail?.name);
  }

  async getDetail() {
    const nzSelectedIndex = this.nzSelectedIndex;
    this.nzSelectedIndex = -1;
    this.extensionDetail = { ...this.extensionDetail, ...this.extensionData };
    if (this.electron.isElectron) {
      this.isOperating = window.electron.getInstallingExtension(this.extensionData?.name, ({ type, status }) => {
        if (type === 'install' && status === 'success') {
          this.extensionDetail.installed = true;
        }
        if (type === 'uninstall' && status === 'success') {
          this.extensionDetail.installed = false;
        }
        this.isOperating = false;
      });
    }
    this.introLoading = true;
    this.extensionDetail = await this.extensionService.getDetail(this.extensionData?.name);
    if (!this.extensionDetail?.installed || this.webService.isWeb) {
      await this.fetchReadme(this.language.systemLanguage);
    }
    this.introLoading = false;
    this.isNotLoaded = false;
    this.extensionDetail.introduction ||= $localize`This plugin has no documentation yet.`;
    this.isAvailableElectron = this.checkisAvailableElectron(this.extensionDetail);
    this.fetchChangelog(this.language.systemLanguage);

    setTimeout(() => {
      this.nzSelectedIndex = nzSelectedIndex;
    });
  }
  async fetchChangelog(locale = '') {
    //Default locale en-US
    if (locale === 'en-US') {
      locale = '';
    }
    const timer = setTimeout(() => (this.changelogLoading = true), 200);
    try {
      const response = await fetch(`https://unpkg.com/${this.extensionDetail.name}@${this.extensionDetail.version}/CHANGELOG.md`);
      if (response.status === 200) {
        this.changeLog = await response.text();
      } else if (response.status === 404) {
        try {
          // const result = await fetch(`https://eoapi.eolinker.com/npm/${this.extensionDetail.name}`, {
          const result = await fetch(`https://registry.npmjs.org/${this.extensionDetail.name}`, {
            headers: {
              // if fullmeta
              // accept: ' application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
            }
          });
          const data = await result.json();
          this.changeLog = Object.entries<any>(data.versions).reduceRight(
            (log, [key, value]) => `
${log}
* [${key}](${value.dist.tarball}) - ${new Date(data.time[key]).toLocaleString()}
              `,
            ''
          );
        } catch (error) {
          this.changeLogNotFound = true;
        }
      }
      //  else if (locale) {
      //   //If locale README not find,fetch default locale(en-US)
      //   this.fetchChangelog();
      // }
    } catch (error) {
    } finally {
      clearTimeout(timer);
      this.changelogLoading = false;
    }
  }
  async fetchReadme(locale = '') {
    //Default locale en-US
    if (locale === 'en-US') {
      locale = '';
    }
    try {
      const response = await fetch(
        `https://unpkg.com/${this.extensionDetail.name}@${this.extensionDetail.version}/README.${locale ? `${locale}.` : ''}md`
      );
      if (response.status === 200) {
        this.extensionDetail.introduction = await response.text();
      } else if (locale) {
        //If locale README not find,fetch default locale(en-US)
        this.fetchReadme();
      }
    } catch (error) {
    } finally {
    }
  }
  handleTabChange = e => {
    if (e.tab?.nzTitle === 'ChangeLog') {
      this.fetchChangelog();
    }
  };
  checkisAvailableElectron(pkgInfo): boolean {
    if (this.electron.isElectron && this.extensionDetail.browser && !this.extensionDetail.main) return false;
    return true;
  }
  private async manageExtension(operate: string, id) {
    this.isOperating = true;
    switch (operate) {
      case 'install': {
        const { name, version, i18n } = this.extensionDetail;
        this.extensionDetail['enabled'] = true;
        this.extensionDetail.installed = await this.extensionService.installExtension({
          name,
          version
        });
        this.trace.report('install_extension_success', { extension_id: id });
        break;
      }
      case 'uninstall': {
        this.extensionDetail.installed = !(await this.extensionService.uninstallExtension(id));
        this.trace.report('uninstall_extension_success', { extension_id: id });
        break;
      }
    }
    this.getDetail();
    this.isOperating = false;
  }

  backToList() {
    this.goBack.emit();
  }
}
