import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { requestMethodMap } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { ImportApiComponent } from 'eo/workbench/browser/src/app/modules/extension-select/import-api/import-api.component';
import { ApiGroupEditComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/api/components/group/edit/api-group-edit.component';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { GroupCreateDto, GroupUpdateDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/group.dto';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { eoDeepCopy, waitNextTick } from 'eo/workbench/browser/src/app/utils/index.utils';
import { getExpandGroupByKey } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { autorun, reaction } from 'mobx';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTreeComponent, NzFormatEmitEvent } from 'ng-zorro-antd/tree';

import { ElectronService } from '../../../../../../../core/services';
import { ProjectApiService } from '../../../api.service';
import { ApiEffectService } from '../../../service/store/api-effect.service';
import { ApiStoreService } from '../../../service/store/api-state.service';

export type GroupAction = 'new' | 'edit' | 'delete';
@Component({
  selector: 'pc-api-group-tree',
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
  apiGroupTree = [];
  apiItemsMenu = [
    {
      title: $localize`Edit`,
      click: node => this.editAPI(node.origin)
    },
    {
      title: $localize`:@Copy:Copy`,
      click: node => this.copyAPI(node.origin)
    },
    {
      title: $localize`:@Delete:Delete`,
      click: node => this.deleteAPI(node.origin)
    }
  ];
  groupItemsMenu = [
    {
      title: $localize`Add API`,
      click: inArg => this.addAPI(inArg.group.origin)
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
    public globalStore: StoreService,
    private store: ApiStoreService,
    private effect: ApiEffectService,
    private projectApi: ProjectApiService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private message: EoNgFeedbackMessageService
  ) {}

  ngOnInit(): void {
    this.isEdit = !this.globalStore.isShare;
    // * get group data from store
    this.effect.getGroupList().then(() => {
      this.isLoading = false;
    });
    autorun(
      () => {
        this.apiGroupTree = this.store.getApiGroupTree;
        waitNextTick().then(() => {
          this.initSelectKeys();
          this.expandKeys = this.getExpandKeys();
        });
      },
      {
        delay: 300
      }
    );
    reaction(
      () => this.globalStore.getUrl,
      () => {
        this.initSelectKeys();
      }
    );
  }
  initSelectKeys() {
    const isApiPage = ['/home/workspace/project/api/http', '/home/workspace/project/api/ws'].some(path => this.router.url.includes(path));
    const { uuid } = this.route.snapshot.queryParams;
    this.nzSelectedKeys = uuid && isApiPage ? [uuid] : [];
  }
  getExpandKeys() {
    if (!this.route.snapshot.queryParams.uuid) {
      return this.expandKeys;
    }
    return [...this.expandKeys, ...(getExpandGroupByKey(this.apiGroup, this.route.snapshot.queryParams.uuid) || [])];
  }
  getRequestMethodText(node) {
    return this.requestMethodMap[node.origin?.requestMethod];
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
      action: GroupAction;
    }
  ) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: title,
      nzContent: ApiGroupEditComponent,
      nzComponentParams: params,
      nzOnOk: () =>
        modal.componentInstance.submit().then(data => {
          if (params.action !== 'new') return;
          this.expandKeys = [...(this.expandKeys || []), modal.componentInstance.group.parentId];
        })
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
  addAPI(group?) {
    const prefix = this.globalStore.isShare ? 'share' : '/home/workspace/project/api';
    this.router.navigate([`${prefix}/http/edit`], {
      queryParams: { groupId: group?.key }
    });
  }
  deleteAPI(apiInfo) {
    this.modalService.confirm({
      nzTitle: $localize`Deletion Confirmation?`,
      nzContent: $localize`Are you sure you want to delete the data <strong title="${apiInfo.name}">${
        apiInfo.name.length > 50 ? `${apiInfo.name.slice(0, 50)}...` : apiInfo.name
      }</strong> ? You cannot restore it once deleted!`,
      nzOnOk: () => {
        this.projectApi.delete(apiInfo.apiUuid);
      }
    });
  }
  copyAPI(api) {
    this.projectApi.copy(api.key);
  }
  editAPI(api) {
    const prefix = this.globalStore.isShare ? 'share' : '/home/workspace/project/api';
    this.router.navigate([`${prefix}/http/edit`], {
      queryParams: { uuid: api.key }
    });
  }
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
  importAPI() {
    const title = $localize`:@@ImportAPI:Import API`;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: ImportApiComponent,
      nzComponentParams: {},
      nzOnOk: () =>
        new Promise(resolve => {
          modal.componentInstance.submit(status => {
            this.effect.getGroupList();
            if (!status) {
              this.message.error($localize`Failed to ${title},Please upgrade extension or try again later`);
              return resolve(true);
            }
            if (status === 'stayModal') {
              return resolve(true);
            }
            this.message.success($localize`${title} successfully`);
            modal.destroy();
            return resolve(true);
          });
        })
    });
  }

  /**
   * Drag & drop tree item.
   *
   * @param event
   */
  treeItemDrop = ({ dragNode }: NzFormatEmitEvent) => {
    const node = eoDeepCopy(dragNode.origin);
    const parentNode = dragNode.parentNode;
    const children = dragNode.parentNode ? dragNode.parentNode.getChildren() : this.apiGroup.getTreeNodes().filter(n => n.level === 0);
    // * Get group sort index
    const sort = children.findIndex(val => val.key === node.key);
    console.log('TODO: sort 可能不是按顺序的', [...children]);
    // * It will be update group list automatic
    this.effect.sortGroup(
      dragNode.isLeaf
        ? {
            id: node._group.id,
            type: node._group.type,
            sort,
            //@ts-ignore
            parentId: parentNode?.key || this.store.getRootGroup.id
          }
        : { ...node, sort, parentId: dragNode.parentNode?.key || this.store.getRootGroup.id }
    );
    console.log(dragNode, node, dragNode.parentNode?.key);
  };

  toggleExpand() {
    this.expandKeys = this.apiGroup.getExpandedNodeList().map(tree => tree.key);
  }
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
      case 'clickItem': {
        // * jump to api detail page
        const prefix = this.globalStore.isShare ? 'share' : '/home/workspace/project/api';
        this.router.navigate([`${prefix}/http/detail`], {
          queryParams: { uuid: event.node.key, groupId: event.node.origin.groupId }
        });
        break;
      }
    }
  }
}
