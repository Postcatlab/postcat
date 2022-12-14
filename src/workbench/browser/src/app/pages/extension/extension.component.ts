import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { GroupTreeItem } from 'eo/workbench/browser/src/app/shared/models';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { observable, makeObservable, computed, action } from 'mobx';
import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import { ExtensionGroupType } from './extension.model';
import { ExtensionService } from './extension.service';

@Component({
  selector: 'eo-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss']
})
export class ExtensionComponent implements OnInit {
  @observable extensionName = '';
  keyword = '';
  nzSelectedKeys: Array<number | string> = [];
  treeNodes: NzTreeNodeOptions[] = [
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
  fixedTreeNode: GroupTreeItem[] | NzTreeNode[] = [
    {
      title: $localize`All`,
      key: 'all',
      weight: 0,
      parentID: '0',
      isLeaf: true,
      isFixed: true
    }
  ];
  selectGroup: ExtensionGroupType | string = ExtensionGroupType.all;

  @computed get hasExtension() {
    return !!this.extensionName;
  }

  @computed get getExtension() {
    return this.extensionName;
  }

  constructor(public extensionService: ExtensionService, public electron: ElectronService, private messageService: MessageService) {}

  clickGroup(id) {
    this.selectGroup = id;
    this.selectExtension('');
  }
  ngOnInit(): void {
    makeObservable(this);
    this.nzSelectedKeys = [this.fixedTreeNode[0].key];
  }

  selectExtension(name = '') {
    this.setExtension(name);
  }

  onSearchChange(keyword) {
    this.messageService.send({ type: 'searchPluginByKeyword', data: keyword });
  }

  /**
   * Group tree item click.
   *
   * @param event
   */
  clickTreeItem(event: NzFormatEmitEvent): void {
    const eventName = event.node?.origin.isFixed ? 'clickFixedItem' : 'clickItem';

    switch (eventName) {
      case 'clickFixedItem': {
        this.clickGroup(event.node.key);
        break;
      }
      case 'clickItem': {
        this.clickGroup(event.node.key);
        break;
      }
    }
  }

  @action setExtension(data = '') {
    this.extensionName = data;
  }
}
