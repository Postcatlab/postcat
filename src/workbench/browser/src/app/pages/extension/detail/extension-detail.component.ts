import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private extensionService: ExtensionService, private route: ActivatedRoute) {
    this.getDetail();
  }
  async getDetail() {
    this.extensionDetail = await this.extensionService.getDetail(this.route.snapshot.queryParams.id,this.route.snapshot.queryParams.name);
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
          break;
        }
        case 'uninstall': {
          this.extensionDetail.installed = !this.extensionService.uninstall(id);
        }
      }
      this.isOperating = false;
    }, 0);
  }
  ngOnInit(): void {}
}
