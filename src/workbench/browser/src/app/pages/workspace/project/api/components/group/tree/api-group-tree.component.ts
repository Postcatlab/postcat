import { Component, OnInit, ViewChild } from '@angular/core';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { NzTreeComponent, NzFormatEmitEvent } from 'ng-zorro-antd/tree';

import { ElectronService } from '../../../../../../../core/services';
import { GroupApiDataModel } from '../../../../../../../shared/models';

@Component({
  selector: 'eo-api-group-tree',
  templateUrl: './api-group-tree.component.html',
  styleUrls: ['./api-group-tree.component.scss']
})
export class ApiGroupTreeComponent implements OnInit {
  @ViewChild('apiGroup') apiGroup: NzTreeComponent;
  /**
   * Expanded keys of tree.
   */
  expandKeys: string[] = [];
  nzSelectedKeys = [];
  treeNodes = [];
  searchValue = '';
  isLoading = true;
  isEdit: boolean;
  apiItemsMenu = [
    {
      title: $localize`Edit`,
      click: inArg => this.editAPI(inArg.group)
    },
    {
      title: $localize`:@Copy:Copy`,
      click: inArg => this.copyAPI(inArg.api)
    },
    {
      title: $localize`:@Delete:Delete`,
      click: inArg => this.deleteAPI(inArg.api)
    }
  ];
  groupItemsMenu = [
    {
      title: $localize`Add API`,
      click: inArg => this.addAPI(inArg.group)
    },
    {
      title: $localize`Add Subgroup`,
      click: inArg => this.addGroup(inArg.group)
    },
    {
      title: $localize`Edit`,
      click: inArg => this.editGroup(inArg.group)
    },
    {
      title: $localize`:@@Delete:Delete`,
      click: inArg => this.effect.deleteGroup(inArg.group)
    }
  ];
  constructor(public electron: ElectronService, public store: StoreService, private effect: EffectService) {}
  ngOnInit(): void {
    this.isEdit = !this.store.isShare;
    // * get group data from store
    this.effect.getGroupList();
  }
  editGroup(group) {}
  addAPI(group) {}
  deleteAPI(api) {}
  copyAPI(api) {}
  editAPI(group) {}
  addGroup(group) {}
  importAPI() {}

  /**
   * Drag & drop tree item.
   *
   * @param event
   */
  treeItemDrop = (event: NzFormatEmitEvent) => {
    const dragNode = event.dragNode;
    const groupApiData: GroupApiDataModel = { group: [], api: [] };
    // * update group list
  };

  toggleExpand() {}
  clickTreeItem(data) {}
  onSearchFunc(data) {
    return true;
  }
}
