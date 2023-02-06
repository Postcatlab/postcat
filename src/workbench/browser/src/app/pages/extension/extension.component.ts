import { Component, Input, OnInit } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { ExtensionInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { observable, makeObservable, computed, action } from 'mobx';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import { ExtensionService } from '../../shared/services/extensions/extension.service';
import { ExtensionGroupType } from './extension.model';

export const suggestMap = {
  '@feature ': ['importAPI', 'exportAPI', 'syncAPI', 'sidebarViews', 'theme'],
  '@category ': ['Data Migration', 'Themes', 'API Security', 'Other']
} as const;
export const suggestList = Object.entries(suggestMap).reduce((prev, [key, value]) => {
  value.forEach(n => prev.push(key + n));
  return prev;
}, []);
export const suggestCates = Object.keys(suggestList) as Array<keyof typeof suggestList>;

@Component({
  selector: 'eo-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss']
})
export class ExtensionComponent implements OnInit {
  @observable currentExtension: ExtensionInfo | null = null;
  @observable selectGroup: ExtensionGroupType | string = ExtensionGroupType.all;
  @Input() keyword = '';
  searchOptions = [];
  nzSelectedKeys: Array<number | string> = ['all'];
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
    {
      key: 'installed',
      title: $localize`Installed`,
      isLeaf: true
    },
    {
      key: 'Data Migration',
      title: $localize`Data Migration`,
      isLeaf: true
    },
    {
      key: 'Themes',
      title: $localize`Themes`,
      isLeaf: true
    },
    {
      key: 'API Security',
      title: $localize`API Security`,
      isLeaf: true
    },
    {
      key: 'Other',
      title: $localize`Other`,
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
  }

  selectExtension(ext = null) {
    this.setExtension(ext);
  }
  /**
   * Group tree item click.
   *
   * @param event
   */
  clickTreeItem(event: NzFormatEmitEvent): void {
    this.selectExtension('');
    this.setGroup(event.node.key);
  }

  @action setGroup(data) {
    this.selectGroup = data;
  }

  @action setExtension(data = null) {
    this.currentExtension = data;
  }
}
