import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'eo-page-feature-preview',
  templateUrl: './page-feature-preview.component.html',
  styleUrls: ['./page-feature-preview.component.scss'],
})
export class PageFeaturePreviewComponent implements OnInit {
  resourceInfo = [
    {
      id: 'win',
      name: 'Windows 客户端',
      icon: 'windows',
      keyword: 'Setup',
      suffix: 'exe',
      link: '',
    },
    {
      id: 'mac',
      name: 'macOS(Intel) 客户端',
      icon: 'apple',
      suffix: 'dmg',
      link: '',
    },
    {
      id: 'mac',
      name: 'macOS(M1) 客户端',
      icon: 'apple',
      suffix: 'arm64.dmg',
      link: '',
    },
  ];

  constructor() {
    this.getInstaller();
  }

  ngOnInit(): void {}

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
}
