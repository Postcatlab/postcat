import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { autorun, observable, makeObservable } from 'mobx';

import { ExtensionService } from '../../../shared/services/extensions/extension.service';
import { ContributionPointsPrefix, ExtensionGroupType, suggestList } from '../extension.model';

const extensionSearch = list => {
  return (keyword: string) => {
    return list.filter(it => {
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
  @Input() @observable category = '';
  @Output() readonly selectChange: EventEmitter<any> = new EventEmitter<any>();
  extensionList = [];
  loading = false;
  constructor(public extensionService: ExtensionService, public electron: ElectronService) {}
  async ngOnInit() {
    makeObservable(this);
    autorun(async () => {
      let type = this.type;
      if (type.startsWith(ContributionPointsPrefix.category)) {
        type = 'category';
        this.category = this.type.slice(ContributionPointsPrefix.category.length);
      }
      this.extensionList = await this.searchPlugin(type, { keyword: this.keyword, category: this.category });
    });
  }
  clickExtension(event, item) {
    this.selectChange.emit(item);
  }
  async searchPlugin(groupType, { keyword = '', category = '', feature = '' }) {
    this.loading = true;
    const suggest = suggestList.find(n => keyword.startsWith(n));

    if (suggest) {
      const prefix = Object.values(ContributionPointsPrefix).find(n => keyword.startsWith(n));
      const text = suggest.slice(prefix.length);
      keyword = keyword.slice(suggest.length).trim();
      if (prefix === ContributionPointsPrefix.feature) {
        groupType = 'feature';
        feature = text;
      } else if (prefix === ContributionPointsPrefix.category) {
        groupType = 'category';
        category = text;
      }
    }
    const func = {
      installed: () => {
        const list = this.extensionService.getInstalledList();
        return extensionSearch(list)(keyword);
      },
      official: async () => {
        const [{ data }]: any = await this.extensionService.requestList('list', { author: 'Postcat', keyword });
        return data;
      },
      all: async () => {
        const [{ data }]: any = await this.extensionService.requestList('list', { keyword });
        return data;
      },
      category: async () => {
        const [{ data }]: any = await this.extensionService.requestList('list', { category, keyword });
        return data;
      },
      feature: async () => {
        const [{ data }]: any = await this.extensionService.requestList('list', { feature, keyword });
        return data;
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
