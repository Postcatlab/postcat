import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { autorun, computed, observable, makeObservable } from 'mobx';

import { ExtensionService } from '../../../shared/services/extensions/extension.service';
import { ExtensionGroupType } from '../extension.model';

const extensionSearch = list => keyword => list.filter(it => it.name.includes(keyword) || it.keywords?.includes(keyword));

@Component({
  selector: 'eo-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.scss']
})
export class ExtensionListComponent implements OnInit {
  @Input() @observable type: string = ExtensionGroupType.all;
  @Input() @observable keyword = '';
  @Output() readonly selectChange: EventEmitter<any> = new EventEmitter<any>();
  allList = [];
  officialList = [];
  installedList = [];
  loading = false;
  @computed get renderList() {
    if (this.type === 'all') {
      return this.allList;
    }
    if (this.type === 'official') {
      return this.officialList;
    }
    return this.installedList;
  }
  constructor(public extensionService: ExtensionService, public electron: ElectronService) {}
  async ngOnInit() {
    makeObservable(this);
    autorun(async () => {
      switch (this.type) {
        case 'all': {
          this.allList = [];
          this.allList = await this.searchPlugin(this.type, this.keyword);
          break;
        }
        case 'official': {
          this.officialList = [];
          this.officialList = await this.searchPlugin(this.type, this.keyword);
        }
        default: {
          this.installedList = [];
          this.installedList = await this.searchPlugin(this.type, this.keyword);
          break;
        }
      }
    });
  }
  clickExtension(event, item) {
    this.selectChange.emit(item);
  }
  async searchPlugin(groupType, keyword = '') {
    this.loading = true;
    const func = {
      installed: () => {
        const list = this.extensionService.getInstalledList();
        return extensionSearch(list)(keyword);
      },
      official: async () => {
        const authorName = ['Postcat'];
        const { data }: any = await this.extensionService.requestList();
        return extensionSearch(data.filter(it => authorName.includes(it.author)))(keyword);
      },
      all: async () => {
        const { data }: any = await this.extensionService.requestList();
        return extensionSearch(data)(keyword);
      }
    };
    try {
      return await func[groupType]();
    } catch (error) {
    } finally {
      this.loading = false;
    }
  }
}
