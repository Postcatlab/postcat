import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, takeUntil, Subject } from 'rxjs';

import { ExtensionGroupType } from '../extension.model';
import { ExtensionService } from '../extension.service';

class ExtensionList {
  list = [];
  constructor(list) {
    this.list = list;
  }
  search(keyword: string) {
    return this.list.filter((it) => it.name.includes(keyword) || it.keywords?.includes(keyword));
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
  loading = false;
  seachChanged$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public extensionService: ExtensionService,
    public electron: ElectronService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private modal: NzModalService
  ) {
    this.type = this.route.snapshot.queryParams.type;
    this.seachChanged$.pipe(debounceTime(300), distinctUntilChanged()).subscribe(async (keyword) => {
      this.getPluginList(keyword);
    });
  }
  async ngOnInit() {
    this.watchSearchConditionChange();
    this.watchSearchKeywordChange();
  }
  async getPluginList(keyword: string) {
    this.renderList = await this.searchPlugin(keyword);
  }
  async searchPlugin(keyword = '') {
    const timer = setTimeout(() => (this.loading = true), 80);
    const timeStart = Date.now();
    try {
      if (this.type === 'installed') {
        const installedList = new ExtensionList(this.extensionService.getInstalledList());
        return installedList.search(keyword).map((n) => {
          n.isEnable = this.extensionService.isEnable(n.name);
          return n;
        });
      }
      const res: any = await this.extensionService.requestList();
      if (this.type === 'official') {
        return new ExtensionList(res.data.filter((it) => it.author === 'Eoapi')).search(keyword);
      }
      return new ExtensionList(res.data).search(keyword);
    } catch (error) {
    } finally {
      clearTimeout(timer);
      const timeout = Date.now() - timeStart > 300 ? 0 : 300;
      setTimeout(() => (this.loading = false), timeout);
    }
  }
  onSeachChange(keyword) {
    this.seachChanged$.next(keyword);
  }
  clickExtension(event, item) {
    this.router
      .navigate(['home/extension/detail'], {
        queryParams: {
          type: this.route.snapshot.queryParams.type,
          id: item.name,
          name: item.name,
          tab: event?.target?.dataset?.id === 'details' ? 1 : 0,
        },
      })
      .finally();
  }

  handleEnableExtension(isEnable, item) {
    if (isEnable) {
      this.extensionService.enableExtension(item.name);
    } else {
      this.extensionService.disableExtension(item.name);
    }
  }

  private watchSearchConditionChange() {
    this.route.queryParamMap.subscribe(async (params) => {
      this.type = this.route.snapshot.queryParams.type;
      this.renderList = await this.searchPlugin();
    });
  }

  private watchSearchKeywordChange() {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'searchPluginByKeyword': {
            this.onSeachChange(inArg.data);
            break;
          }
        }
      });
  }
}
