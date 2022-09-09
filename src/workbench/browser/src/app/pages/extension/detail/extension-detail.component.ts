import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { EoExtensionInfo } from '../extension.model';
import { ResourceInfo } from '../../../shared/models/client.model';
import { ExtensionService } from '../extension.service';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';

@Component({
  selector: 'eo-extension-detail',
  templateUrl: './extension-detail.component.html',
  styleUrls: ['./extension-detail.component.scss'],
})
export class ExtensionDetailComponent implements OnInit {
  isOperating = false;
  introLoading = false;
  changelogLoading = false;
  isVisible = false;
  isEnable = false;
  isNotLoaded = true;
  extensionDetail: EoExtensionInfo;
  resourceInfo = ResourceInfo;
  nzSelectedIndex = 0;

  changeLog = '';
  get isElectron() {
    return this.electronService.isElectron;
  }
  constructor(
    private extensionService: ExtensionService,
    private route: ActivatedRoute,
    private router: Router,
    private electronService: ElectronService,
    private language: LanguageService
  ) {
    this.getDetail();
    this.getInstaller();
  }

  ngOnInit(): void {}

  handleInstall() {
    if (this.electronService.isElectron) {
      this.manageExtension(this.extensionDetail?.installed ? 'uninstall' : 'install', this.extensionDetail?.name);
    } else {
      const PROTOCOL = 'eoapi://';
      (window as any).protocolCheck(
        PROTOCOL,
        () => {
          // alert("检测到您电脑Eoapi Client本地客户端未安装 请下载");
          this.isVisible = true;
        },
        () => {
          window.location.href = PROTOCOL;
        }
      );
    }
  }

  async getDetail() {
    this.extensionDetail = await this.extensionService.getDetail(
      this.route.snapshot.queryParams.id,
      this.route.snapshot.queryParams.name
    );

    this.isEnable = this.extensionService.isEnable(this.extensionDetail.name);

    if (!this.extensionDetail?.installed) {
      await this.fetchReadme(this.language.systemLanguage);
    }
    this.isNotLoaded = false;
    this.extensionDetail.introduction ||= $localize`This plugin has no documentation yet.`;

    if (this.extensionDetail?.features?.configuration) {
      this.nzSelectedIndex = ~~this.route.snapshot.queryParams.tab;
    }
  }

  async fetchChangelog(locale = '') {
    //Default locale en-US
    if (locale === 'en-US') locale = '';
    const timer = setTimeout(() => (this.changelogLoading = true), 200);
    try {
      const response = await fetch(
        `https://unpkg.com/${this.extensionDetail.name}@${this.extensionDetail.version}/changeLog.${
          locale ? locale + '.' : ''
        }md`
      );
      if (response.status === 200) {
        this.changeLog = await response.text();
      } else if (!locale && response.status === 404) {
        const result = await fetch(`https://registry.npmjs.org/${this.extensionDetail.name}`, {
          headers: {
            // if fullmeta
            // accept: ' application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
          },
        });
        const data = await result.json();
        this.changeLog = Object.entries<any>(data.versions).reduceRight((log, [key, value]) => {
          return `
${log}
* [${key}](${value.dist.tarball}) - ${new Date(data.time[key]).toLocaleString()}
          `;
        }, '');
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
    if (locale === 'en-US') locale = '';
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

  private findLinkInSingleAssets(assets, item) {
    let result = '';
    const assetIndex = assets.findIndex(
      (asset) =>
        new RegExp(`${item.suffix}$`, 'g').test(asset.browser_download_url) &&
        (!item.keyword || asset.browser_download_url.includes(item.keyword))
    );
    if (assetIndex === -1) {
      return result;
    }
    result = assets[assetIndex].browser_download_url;
    assets.splice(assetIndex, 1);
    return result;
  }

  private findLink(allAssets, item) {
    let result = '';
    allAssets.some((assets) => {
      result = this.findLinkInSingleAssets(assets, item);
      return result;
    });
    return result;
  }

  getInstaller() {
    fetch('https://api.github.com/repos/eolinker/eoapi/releases')
      .then((response) => response.json())
      .then((data = []) => {
        [...this.resourceInfo]
          .sort((a1, a2) => a2.suffix.length - a1.suffix.length)
          .forEach((item) => {
            item.link = this.findLink(
              data.map((val) => val.assets),
              item
            );
          });
      });
  }

  manageExtension(operate: string, id) {
    this.isOperating = true;
    /**
     * * WARNING:Sending a synchronous message will block the whole
     * renderer process until the reply is received, so use this method only as a last
     * resort. It's much better to use the asynchronous version, `invoke()`.
     */
    setTimeout(() => {
      switch (operate) {
        case 'install': {
          this.extensionDetail.installed = this.extensionService.install(id);
          this.handleEnableExtension(true);
          this.getDetail();
          break;
        }
        case 'uninstall': {
          this.extensionDetail.installed = !this.extensionService.uninstall(id);
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

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleEnableExtension(isEnable) {
    if (isEnable) {
      this.extensionService.enableExtension(this.extensionDetail.name);
    } else {
      this.extensionService.disableExtension(this.extensionDetail.name);
    }
  }
}
