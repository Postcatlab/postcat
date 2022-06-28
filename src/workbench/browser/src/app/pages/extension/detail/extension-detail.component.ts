import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EoExtensionInfo } from '../extension.model';
import { ExtensionService } from '../extension.service';

@Component({
  selector: 'eo-extension-detail',
  templateUrl: './extension-detail.component.html',
  styleUrls: ['./extension-detail.component.scss'],
})
export class ExtensionDetailComponent implements OnInit {
  isOperating = false;
  extensionDetail: EoExtensionInfo;

  constructor(private extensionService: ExtensionService, private route: ActivatedRoute, private router: Router) {
    this.getDetail();
  }
  async getDetail() {
    this.extensionDetail = await this.extensionService.getDetail(
      this.route.snapshot.queryParams.id,
      this.route.snapshot.queryParams.name
    );
    if (!this.extensionDetail?.introduction && !this.extensionDetail?.installed) {
      await this.fetchReadme();
    }
    this.extensionDetail.introduction ||= 'This plugin has no documentation yet.';
  }

  async fetchReadme() {
    try {
      const htmlText = await (await fetch(`https://www.npmjs.com/package/${this.extensionDetail.name}`)).text();
      const domParser = new DOMParser();
      const html = domParser.parseFromString(htmlText, 'text/html');
      this.extensionDetail.introduction = html.querySelector('#readme').innerHTML;
    } catch (error) {}
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
