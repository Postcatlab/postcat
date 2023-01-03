import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { ModuleInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { observable, makeObservable, computed, action } from 'mobx';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import { ExtensionGroupType } from './extension.model';
import { ExtensionService } from './extension.service';

@Component({
  selector: 'eo-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss']
})
export class ExtensionComponent implements OnInit {
  @observable currentExtension: ModuleInfo | null = null;
  @observable selectGroup: ExtensionGroupType | string = ExtensionGroupType.all;
  keyword = '';
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
