import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, lastValueFrom, Subject } from 'rxjs';
import { ExtensionGroupType } from '../extension.model';
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
  keyword = '';
  renderList = [];
  seachChanged$: Subject<string> = new Subject<string>();
  constructor(public extensionService: ExtensionService, private route: ActivatedRoute, private router: Router) {
    this.type = this.route.snapshot.queryParams.type;
    this.seachChanged$.pipe(debounceTime(500), distinctUntilChanged()).subscribe(async (keyword) => {
      this.renderList = await this.searchPlugin(keyword);
    });
  }
  async ngOnInit() {
    this.watchSearchConditionChange();
  }
  async searchPlugin(keyword = '') {
    if (this.type === 'installed') {
      const installedList = new ExtensionList(
        [...window.eo.getModules()]
          .map((it) => it[1])
          .filter((it) => this.extensionService.extensionIDs.includes(it.moduleID))
      );
      return installedList.search(keyword);
    }
    const res: any = await this.extensionService.requestList();
    if (this.type === 'official') {
      return new ExtensionList(res.data.filter((it) => it.author === 'Eoapi')).search(keyword);
    }
    return new ExtensionList(res.data).search(keyword);
  }
  onSeachChange(keyword) {
    this.seachChanged$.next(keyword);
  }
  clickExtension(item) {
    this.router
      .navigate(['home/extension/detail'], {
        queryParams: {
          type: this.route.snapshot.queryParams.type,
          id: item.moduleID,
          name: item.name,
          jump: 'setting',
        },
      })
      .finally();
  }
  private watchSearchConditionChange() {
    this.route.queryParamMap.subscribe(async (params) => {
      this.type = this.route.snapshot.queryParams.type;
      this.renderList = await this.searchPlugin();
    });
  }
}
