import { Component, Input, OnInit } from '@angular/core';
import { observable, makeObservable, computed, action, reaction } from 'mobx';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { ElectronService } from 'pc/browser/src/app/core/services';
import { ExtensionInfo } from 'pc/browser/src/app/shared/models/extension-manager';

import { ExtensionService } from '../../../services/extensions/extension.service';
import { getExtensionCates, ExtensionGroupType, suggestList } from './extension.model';
@Component({
  selector: 'eo-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss']
})
export class ExtensionComponent implements OnInit {
  @observable currentExtension: ExtensionInfo | null = null;
  @observable selectGroup: ExtensionGroupType | string = ExtensionGroupType.all;
  @observable @Input() keyword = '';
  @observable @Input() nzSelectedKeys: Array<number | string> = ['all'];
  category = '';
  nzSelectedIndex = 0;
  searchOptions = [];
  treeNodes: NzTreeNodeOptions[] = [
    {
      key: 'all',
      title: $localize`All`,
      icon: 'home ',
      isLeaf: true
    },
    {
      key: 'official',
      title: $localize`Official`,
      isLeaf: true
    },
    ...getExtensionCates(),
    {
      key: 'installed',
      title: $localize`Installed`,
      isLeaf: true
    }
  ];

  @computed get hasExtension() {
    return !!this.currentExtension;
  }

  @computed get getExtension() {
    return this.currentExtension;
  }

  constructor(public extensionService: ExtensionService, public electron: ElectronService) {}

  ngOnInit(): void {
    makeObservable(this);
    reaction(
      () => this.keyword,
      (value, oldValue) => {
        const isSuggest = suggestList.some(n => oldValue && n.startsWith(oldValue));
        if (value.trim() === '' && isSuggest) {
          const node = this.treeNodes.find(n => n.key === 'all');
          this.nzSelectedKeys = ['all'];
          node && this.setGroup(node.key);
        }
      }
    );
  }

  onInput(value: string): void {
    this.searchOptions = value.trim() ? suggestList.filter(n => n.startsWith(value)) : [];
    const suggest = suggestList.find(n => value && n.startsWith(value) && n.startsWith('@category:'));
    const node = this.treeNodes.find(n => n.key === suggest);
    if (suggest && node) {
      this.nzSelectedKeys = [node.key];
    }
  }

  selectExtension(ext = null) {
    this.setExtension(ext);
    if (Number.isInteger(ext?.nzSelectedIndex)) {
      this.nzSelectedIndex = ext?.nzSelectedIndex;
    }
  }
  /**
   * Group tree item click.
   *
   * @param event
   */
  clickTreeItem(event: NzFormatEmitEvent): void {
    const { key } = event.node.origin;
    if (String(this.nzSelectedKeys) !== key) {
      this.keyword = '';
    }
    this.selectExtension('');
    this.setGroup(key);
    this.nzSelectedKeys = [key];
  }

  @action setGroup(data) {
    this.selectGroup = data;
  }

  @action setExtension(data = null) {
    this.currentExtension = data;
  }
}
