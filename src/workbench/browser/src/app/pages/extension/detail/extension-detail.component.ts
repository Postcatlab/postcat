import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { EoExtensionInfo } from '../extension.model';
import { ResourceInfo } from '../../../shared/models/client.model';
import { ExtensionService } from '../extension.service';

@Component({
  selector: 'eo-extension-detail',
  templateUrl: './extension-detail.component.html',
  styleUrls: ['./extension-detail.component.scss'],
})
export class ExtensionDetailComponent implements OnInit {
  isOperating = false;
  introLoading = false;
  extensionDetail: EoExtensionInfo;
  resourceInfo = ResourceInfo;
  get isElectron() {
    return this.electronService.isElectron;
  }
  constructor(
    private extensionService: ExtensionService,
    private route: ActivatedRoute,
    private router: Router,
    private electronService: ElectronService
  ) {
    this.getDetail();
    this.getInstaller();
  }
  async getDetail() {
    this.extensionDetail = await this.extensionService.getDetail(
      this.route.snapshot.queryParams.id,
      this.route.snapshot.queryParams.name
    );
    if (!this.extensionDetail?.introduction && !this.extensionDetail?.installed) {
      await this.fetchReadme();
    }
    this.extensionDetail.introduction ||= $localize`This plugin has no documentation yet.`;
  }

  async fetchReadme() {
    try {
      this.introLoading = true;
      const htmlText = await (await fetch(`https://www.npmjs.com/package/${this.extensionDetail.name}`)).text();
      const domParser = new DOMParser();
      const html = domParser.parseFromString(htmlText, 'text/html');
      this.extensionDetail.introduction = html.querySelector('#readme').innerHTML;
    } catch (error) {
    } finally {
      this.introLoading = false;
    }
  }

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
      .then((data) => {
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
    console.log(this.isOperating);
    /**
     * * WARNING:Sending a synchronous message will block the whole
     * renderer process until the reply is received, so use this method only as a last
     * resort. It's much better to use the asynchronous version, `invoke()`.
     */
    setTimeout(() => {
      switch (operate) {
        case 'install': {
          this.extensionDetail.installed = this.extensionService.install(id);
          this.getDetail();
          break;
        }
        case 'uninstall': {
          this.extensionDetail.installed = !this.extensionService.uninstall(id);
          this.fetchReadme();
          break;
        }
      }
      this.isOperating = false;
    }, 100);
  }
  ngOnInit(): void {}

  backToList() {
    this.router.navigate(['/home/extension/list'], {
      queryParams: {
        type: this.route.snapshot.queryParams.type,
      },
    });
  }
}
