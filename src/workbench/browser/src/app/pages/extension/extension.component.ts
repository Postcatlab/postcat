import { Component, Input, OnInit } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { ExtensionInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { observable, makeObservable, computed, action } from 'mobx';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import { ExtensionService } from '../../shared/services/extensions/extension.service';
import { getExtensionCates, ExtensionGroupType, suggestList } from './extension.model';
@Component({
  selector: 'eo-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss']
})
export class ExtensionComponent implements OnInit {
  @observable currentExtension: ExtensionInfo | null = null;
  @observable selectGroup: ExtensionGroupType | string = ExtensionGroupType.all;
  @Input() keyword = '';
  @Input() nzSelectedKeys: Array<number | string> = ['all'];
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
  }

  onInput(value: string): void {
    this.searchOptions = value.trim() ? suggestList.filter(n => n.startsWith(value)) : [];
    const suggest = suggestList.find(n => n.startsWith(value));
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
    if (this.selectGroup !== key) {
      this.keyword = '';
    }
    this.selectExtension('');
    this.setGroup(key);
  }

  @action setGroup(data) {
    this.selectGroup = data;
  }

  @action setExtension(data = null) {
    this.currentExtension = data;
  }
}
