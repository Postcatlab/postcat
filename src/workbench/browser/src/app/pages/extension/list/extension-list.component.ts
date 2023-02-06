import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { suggestList } from 'eo/workbench/browser/src/app/pages/extension/extension.component';
import { autorun, observable, makeObservable } from 'mobx';

import { ExtensionService } from '../../../shared/services/extensions/extension.service';
import { ExtensionGroupType } from '../extension.model';

const extensionSearch = list => {
  return (keyword: string) => {
    return list.filter(it => {
      const isSuggest = suggestList.some(n => keyword.startsWith(n));

      if (isSuggest) {
        const [suggest, text] = keyword.split(' ');

        if (suggest === '@feature') {
          return Object.keys(it.features).some(key => text === key);
        } else if (suggest === '@category') {
          return it.categories?.includes(text);
        }
      }
      if (keyword) {
        return it.name.includes(keyword) || it.keywords?.includes(keyword);
      }
      return true;
    });
  };
};
@Component({
  selector: 'eo-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.scss']
})
export class ExtensionListComponent implements OnInit {
  @Input() @observable type: string = ExtensionGroupType.all;
  @Input() @observable keyword = '';
  @Output() readonly selectChange: EventEmitter<any> = new EventEmitter<any>();
  extensionList = [];
  loading = false;
  constructor(public extensionService: ExtensionService, public electron: ElectronService) {}
  async ngOnInit() {
    makeObservable(this);
    autorun(async () => {
      this.extensionList = await this.searchPlugin(this.type, this.keyword);
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
