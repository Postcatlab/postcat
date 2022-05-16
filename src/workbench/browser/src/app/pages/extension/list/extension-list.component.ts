import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ExtensionGroupType, ExtensionRes } from '../extension.model';
import { ExtensionService } from '../extension.service';
class ExtensionList {
  list = [];
  constructor(list) {
    this.list = list;
  }
  search(keyword: string) {
    return this.list.filter(
      (it) => it.moduleID.includes(keyword) || it.name.includes(keyword) || it.keywords.includes(keyword)
    );
  }
}
@Component({
  selector: 'eo-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.scss'],
})
export class ExtensionListComponent implements OnInit {
  type: ExtensionGroupType = ExtensionGroupType.all;
  renderList = [];
  constructor(private http: HttpClient, public extensionService: ExtensionService, private route: ActivatedRoute) {
    this.type = this.route.snapshot.queryParams.type;
  }
  async ngOnInit() {
    this.renderList = await this.searchPlugin();
  }
  async searchPlugin(keyword = '') {
    if (this.type === 'installed') {
      const installedList = new ExtensionList(
        [...window.eo.getModules()]
          .map((it) => it[1])
          .filter((it) => this.extensionService.pluginNames.includes(it.moduleID))
      );
      return installedList.search(keyword);
    }
    const res: any = await this.getList();
    if (this.type === 'official') {
      return new ExtensionList(res.data.filter((it) => it.author === 'Eolink')).search(keyword);
    }
    return new ExtensionList(res.data).search(keyword);
  }
  private async getList() {
    return await lastValueFrom(this.http.get('http://106.12.149.147:3333/list'));
  }
  // handleClickPlugin({ name, moduleID }) {
  //   router.push({ path: '/plugin-detail', query: { name, moduleID } });
  // }
  // handleSetingPlugin({ moduleID }) {
  //   router.push({ path: '/plugin-detail', query: { moduleID, isSetting: true } });
  // }
}
