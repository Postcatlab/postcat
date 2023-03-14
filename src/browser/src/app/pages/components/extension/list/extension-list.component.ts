import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { autorun, observable, makeObservable } from 'mobx';
import { WebService } from 'pc/browser/src/app/core/services';

import { ExtensionService } from '../../../../services/extensions/extension.service';
import { ContributionPointsPrefix, ExtensionGroupType, suggestList } from '../extension.model';

const extensionSearch = list => {
  return (keyword = '') => {
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
  githubFeatureUrl;
  constructor(public extensionService: ExtensionService, public web: WebService) {
    this.githubFeatureUrl = this.web.getGithubUrl({
      title: 'New Extension Request: ',
      template: 'feature_request.yml',
      labels: 'extension'
    });
  }
  async ngOnInit() {
    makeObservable(this);
    autorun(async () => {
      if (this.keyword) {
        const notCompleteSuggest = suggestList.some(n => n.startsWith(this.keyword) && this.keyword !== n);
        if (notCompleteSuggest) return;
      }
      const originType = this.type;
      let type = this.type;
      if (type.startsWith(ContributionPointsPrefix.category)) {
        type = 'category';
        this.category = this.type.slice(ContributionPointsPrefix.category.length);
      }
      this.extensionList = [];
      const data = await this.searchPlugin(type, { keyword: this.keyword, category: this.category });
      // 避免频繁切换，导致侧边栏选中状态与右侧展示不一致
      if (originType === this.type) {
        this.extensionList = data;
        this.extensionList.sort((a, b) => {
          return a.name === 'postcat-chat-robot' ? -1 : 1;
        });
      }
    });
  }
  clickExtension(event: MouseEvent, item, nzSelectedIndex?) {
    event.stopPropagation();
    item.nzSelectedIndex = nzSelectedIndex;
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
      const result = await func[groupType]();
      return result;
    } catch (error) {
    } finally {
      this.loading = false;
    }
  }
}
