import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { EoExtensionInfo } from '../extension.model';
import { ExtensionService } from '../extension.service';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { WebService } from '../../../core/services/web/web.service';
import { PROTOCOL } from 'eo/workbench/browser/src/app/shared/constants/protocol';

@Component({
  selector: 'eo-extension-detail',
  templateUrl: './extension-detail.component.html',
  styleUrls: ['./extension-detail.component.scss'],
})
export class ExtensionDetailComponent implements OnInit {
  isOperating = false;
  introLoading = false;
  changelogLoading = false;
  isEnable = false;
  isNotLoaded = true;
  extensionDetail: EoExtensionInfo;
  nzSelectedIndex = 0;

  changeLog = '';
  changeLogNotFound = false;
  constructor(
    private extensionService: ExtensionService,
    private route: ActivatedRoute,
    private router: Router,
    private webService: WebService,
    public electron: ElectronService,
    private language: LanguageService
  ) {
    this.getDetail();
  }

  ngOnInit(): void {}

  async handleInstall() {
    if (this.electron.isElectron) {
      this.manageExtension(this.extensionDetail?.installed ? 'uninstall' : 'install', this.extensionDetail?.name);
    } else {
      const isInstalled = await this.webService.protocolCheck();
      if (isInstalled) {
        // alert("检测到您电脑Eoapi Client本地客户端未安装 请下载");
        this.webService.showDownloadClientModal();
      } else {
        window.location.href = PROTOCOL;
      }
    }
  }

  async getDetail() {
    const extName = this.route.snapshot.queryParams.name;
    this.isOperating = window.eo?.getExtIsInTask(extName, ({ type, status }) => {
      if (type === 'install' && status === 'success') {
        this.extensionDetail.installed = true;
      }
      if (type === 'uninstall' && status === 'success') {
        this.extensionDetail.installed = false;
      }
      this.isOperating = false;
    });
    this.extensionDetail = await this.extensionService.getDetail(this.route.snapshot.queryParams.id, extName);

    this.isEnable = this.extensionService.isEnable(this.extensionDetail.name);

    if (!this.extensionDetail?.installed) {
      await this.fetchReadme(this.language.systemLanguage);
    }
    this.isNotLoaded = false;
    this.extensionDetail.introduction ||= $localize`This plugin has no documentation yet.`;

    if (this.extensionDetail?.features?.configuration) {
      this.nzSelectedIndex = ~~this.route.snapshot.queryParams.tab;
    }
    this.fetchChangelog(this.language.systemLanguage);
  }

  async fetchChangelog(locale = '') {
    //Default locale en-US
    if (locale === 'en-US') {
      locale = '';
    }
    const timer = setTimeout(() => (this.changelogLoading = true), 200);
    try {
      const response = await fetch(
        `https://unpkg.com/${this.extensionDetail.name}@${this.extensionDetail.version}/CHANGELOG.${
          locale ? locale + '.' : ''
        }md`
      );
      if (response.status === 200) {
        this.changeLog = await response.text();
      } else if (!locale && response.status === 404) {
        try {
          // const result = await fetch(`https://eoapi.eolinker.com/npm/${this.extensionDetail.name}`, {
          const result = await fetch(`https://registry.npmjs.org/${this.extensionDetail.name}`, {
            headers: {
              // if fullmeta
              // accept: ' application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
            },
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
      } else if (locale) {
        //If locale README not find,fetch default locale(en-US)
        this.fetchChangelog();
      }
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
      this.introLoading = true;
      const response = await fetch(
        `https://unpkg.com/${this.extensionDetail.name}@${this.extensionDetail.version}/README.${
          locale ? locale + '.' : ''
        }md`
      );
      if (response.status === 200) {
        this.extensionDetail.introduction = await response.text();
      } else if (locale) {
        //If locale README not find,fetch default locale(en-US)
        this.fetchReadme();
      }
    } catch (error) {
    } finally {
      this.introLoading = false;
    }
  }

  handleTabChange = (e) => {
    if (e.tab?.nzTitle === 'ChangeLog') {
      this.fetchChangelog();
    }
  };

  manageExtension(operate: string, id) {
    this.isOperating = true;
    /**
     * * WARNING:Sending a synchronous message will block the whole
     * renderer process until the reply is received, so use this method only as a last
     * resort. It's much better to use the asynchronous version, `invoke()`.
     */
    setTimeout(async () => {
      switch (operate) {
        case 'install': {
          this.extensionDetail.installed = await this.extensionService.install(id);
          this.handleEnableExtension(true);
          this.getDetail();
          break;
        }
        case 'uninstall': {
          this.extensionDetail.installed = !(await this.extensionService.uninstall(id));
          this.handleEnableExtension(false);
          this.fetchReadme(this.language.systemLanguage);
          break;
        }
      }
      this.isOperating = false;
    }, 100);
  }

  backToList() {
    this.router.navigate(['/home/extension/list'], {
      queryParams: {
        type: this.route.snapshot.queryParams.type,
      },
    });
  }

  handleEnableExtension(isEnable) {
    if (isEnable) {
      this.extensionService.enableExtension(this.extensionDetail.name);
    } else {
      this.extensionService.disableExtension(this.extensionDetail.name);
    }
  }
}
