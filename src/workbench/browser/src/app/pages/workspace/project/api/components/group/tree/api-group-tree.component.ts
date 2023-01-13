import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiGroupEditComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/api/components/group/edit/api-group-edit.component';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { GroupCreateDto, GroupUpdateDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/group.dto';
import { requestMethodMap } from 'eo/workbench/browser/src/app/shared/services/storage/db/enums/api.enum';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
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
  requestMethodMap = requestMethodMap;
  nzSelectedKeys = [];
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
      click: inArg => this.addGroup(inArg.group?.origin)
    },
    {
      title: $localize`Edit`,
      click: inArg => this.editGroup(inArg.group?.origin)
    },
    {
      title: $localize`:@@Delete:Delete`,
      click: inArg => this.deleteGroup(inArg.group?.origin)
    }
  ];

  constructor(
    public electron: ElectronService,
    public store: StoreService,
    private effect: EffectService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.isEdit = !this.store.isShare;
    // * get group data from store
    this.effect.getGroupList();
  }
  getRequestMethodText(node) {
    return this.requestMethodMap[node.origin?.protocol];
  }
  renderRequestMethodText(node) {
    return this.getRequestMethodText(node).length > 5 ? this.getRequestMethodText(node).slice(0, 3) : this.getRequestMethodText(node);
  }
  /**
   * Group edit modal.
   *
   * @param title
   * @param group
   */
  groupModal(
    title: string,
    params: {
      group: GroupCreateDto | GroupUpdateDto;
      action: 'new' | 'edit' | 'delete';
    }
  ) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: title,
      nzContent: ApiGroupEditComponent,
      nzComponentParams: params,
      nzOnOk() {
        modal.componentInstance.submit();
      }
    });
  }
  editGroup(group) {
    this.groupModal($localize`Edit Group`, {
      group: {
        id: group.id,
        name: group.name
      },
      action: 'edit'
    });
  }
  deleteGroup(group) {
    this.groupModal($localize`Delete Group`, {
      group,
      action: 'delete'
    });
  }
  addAPI(group) {}
  deleteAPI(api) {}
  copyAPI(api) {}
  editAPI(group) {}
  addGroup(group = this.store.getRootGroup) {
    this.groupModal($localize`Add Group`, {
      group: {
        type: 1,
        name: '',
        parentId: group.id
      },
      action: 'new'
    });
  }
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
