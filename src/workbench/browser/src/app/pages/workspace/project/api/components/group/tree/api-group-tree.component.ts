import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { requestMethodMap } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { ImportApiComponent } from 'eo/workbench/browser/src/app/modules/extension-select/import-api/import-api.component';
import { ApiGroupEditComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/api/components/group/edit/api-group-edit.component';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { GroupCreateDto, GroupUpdateDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/group.dto';
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
      click: inArg => this.operateApiEvent({ eventName: 'editApi', node: inArg.group })
    },
    {
      title: $localize`:@Copy:Copy`,
      click: inArg => this.operateApiEvent({ eventName: 'copyApi', node: inArg.origin })
    },
    {
      title: $localize`:@Delete:Delete`,
      click: inArg => this.operateApiEvent({ eventName: 'deleteApi', node: inArg.api })
    }
  ];
  groupItemsMenu = [
    {
      title: $localize`Add API`,
      click: inArg => this.operateApiEvent({ eventName: 'addAPI', node: inArg.group })
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
    private modalService: ModalService,
    private router: Router,
    private message: EoNgFeedbackMessageService
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
  /**
   * Group tree item click.
   *
   * @param event
   */
  clickTreeItem(event: NzFormatEmitEvent): void {
    const eventName = !event.node.isLeaf ? 'clickFolder' : event.node?.origin.isFixed ? 'clickFixedItem' : 'clickItem';
    switch (eventName) {
      case 'clickFolder': {
        event.node.isExpanded = !event.node.isExpanded;
        this.toggleExpand();
        break;
      }
      case 'clickFixedItem': {
        this.operateApiEvent({ ...event, eventName: 'jumpOverview' });
        break;
      }
      case 'clickItem': {
        this.operateApiEvent({ ...event, eventName: 'detailApi' });
        break;
      }
    }
  }
  onSearchFunc(data) {
    return true;
  }

  /**
   * Group tree click api event
   * Router jump page or Event emit
   *
   * @param inArg NzFormatEmitEvent
   */
  async operateApiEvent(inArg: NzFormatEmitEvent | any) {
    const prefix = this.store.isShare ? 'home/share' : '/home/workspace/project/api';
    inArg.event?.stopPropagation();
    switch (inArg.eventName) {
      case 'editApi':
      case 'detailApi': {
        this.router.navigate([`${prefix}/http/${inArg.eventName.replace('Api', '')}`], {
          queryParams: { uuid: inArg.node.key }
        });
        break;
      }
      case 'jumpOverview': {
        this.router.navigate([`${prefix}/overview`], {
          queryParams: { uuid: 'overview' }
        });
        break;
      }
      case 'addAPI': {
        this.router.navigate([`${prefix}/http/edit`], {
          queryParams: { groupID: inArg.node?.origin.key }
        });
        break;
      }
      case 'importAPI': {
        const title = $localize`:@@ImportAPI:Import API`;
        const modal = this.modalService.create({
          nzTitle: title,
          nzContent: ImportApiComponent,
          nzComponentParams: {},
          nzOnOk: () =>
            new Promise(resolve => {
              modal.componentInstance.submit(status => {
                if (status) {
                  this.message.success($localize`${title} successfully`);
                  modal.destroy();
                } else {
                  this.message.error($localize`Failed to ${title},Please upgrade extension or try again later`);
                }
              });
            })
        });
        break;
      }
      case 'deleteApi': {
        const apiInfo = inArg.node;
        this.modalService.confirm({
          nzTitle: $localize`Deletion Confirmation?`,
          nzContent: $localize`Are you sure you want to delete the data <strong title="${apiInfo.name}">${
            apiInfo.name.length > 50 ? `${apiInfo.name.slice(0, 50)}...` : apiInfo.name
          }</strong> ? You cannot restore it once deleted!`,
          nzOnOk: () => {
            this.effect.deleteAPI(apiInfo.uuid);
          }
        });
        break;
      }
      case 'copyApi': {
        const { uuid, createdAt, ...apiData } = inArg.node.origin;
        apiData.name += ' Copy';
        const result = await this.effect.createAPI([apiData]);
        this.router.navigate(['/home/workspace/project/api/http/edit'], {
          // queryParams: { pageID: Date.now(), uuid: result.data.uuid }
        });
        break;
      }
    }
  }
}
