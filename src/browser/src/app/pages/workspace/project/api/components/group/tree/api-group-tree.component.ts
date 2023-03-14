import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun, reaction } from 'mobx';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzTreeComponent, NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { ImportApiComponent } from 'pc/browser/src/app/components/extension-select/import-api/import-api.component';
import { SyncApiComponent } from 'pc/browser/src/app/components/extension-select/sync-api/sync-api.component';
import { ApiTabService } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import { requestMethodMap } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ApiGroupEditComponent } from 'pc/browser/src/app/pages/workspace/project/api/components/group/edit/api-group-edit.component';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { GroupCreateDto, GroupUpdateDto } from 'pc/browser/src/app/services/storage/db/dto/group.dto';
import { eoDeepCopy, waitNextTick } from 'pc/browser/src/app/shared/utils/index.utils';
import { getExpandGroupByKey } from 'pc/browser/src/app/shared/utils/tree/tree.utils';
import { StoreService } from 'pc/browser/src/app/store/state.service';

import { ElectronService } from '../../../../../../../core/services';
import { ProjectApiService } from '../../../api.service';
import { ApiEffectService } from '../../../store/api-effect.service';
import { ApiStoreService } from '../../../store/api-state.service';

export type GroupAction = 'new' | 'edit' | 'delete';

const actionComponent = {
  sync: SyncApiComponent,
  import: ImportApiComponent
};

const getAllAPIId = ({ id, children = [] }: any) => [id, ...children.map(getAllAPIId)];
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
  searchFunc = (node: NzTreeNodeOptions) => {
    const { uri, name, title } = node;
    // console.log('node', uri, name, title);
    return [uri, name, title].some(n => n?.includes?.(this.searchValue));
  };
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
      click: inArg => this.addGroup(inArg)
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

  extensionActions = [
    {
      title: $localize`:@@ImportAPI:Import API`,
      menuTitle: $localize`Import From File`,
      traceID: 'click_import_project',
      click: title => this.importAPI('import', title)
    },
    {
      title: $localize`Sync API from URL`,
      menuTitle: $localize`Sync API from URL`,
      traceID: 'sync_api_from_url',
      click: title => this.importAPI('sync', title)
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
    private tab: ApiTabService,
    private message: EoNgFeedbackMessageService
  ) {}

  ngOnInit(): void {
    this.isEdit = !this.globalStore.isShare;
    // * get group data from store
    this.effect.getGroupList().then(() => {
      this.isLoading = false;
    });
    autorun(() => {
      this.expandKeys = this.getExpandKeys();
      this.apiGroupTree = this.store.getApiGroupTree;
      waitNextTick().then(() => {
        this.initSelectKeys();
      });
    });
    reaction(
      () => this.globalStore.getUrl,
      () => {
        this.initSelectKeys();
      }
    );
  }
  initSelectKeys() {
    const isApiPage = ['/home/workspace/project/api/http', '/home/workspace/project/api/ws', 'home/workspace/project/api/group/edit'].some(
      path => this.router.url.includes(path)
    );
    const { uuid } = this.route.snapshot.queryParams;
    this.nzSelectedKeys = uuid && isApiPage ? [Number(uuid) || uuid] : [];
  }
  getExpandKeys() {
    this.expandKeys = this.apiGroup?.getExpandedNodeList().map(node => node.key) || [];
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
      nzOnOk: () => {
        if (params.action === 'delete') {
          const idList = [...new Set(getAllAPIId(params.group).flat(Infinity))];
          this.tab.batchCloseTabById(idList);
        }
        return modal.componentInstance.submit().then(data => {
          if (params.action !== 'new') return;
          this.expandKeys = [...(this.expandKeys || []), modal.componentInstance.group.parentId];
        });
      }
    });
  }
  editGroup(group) {
    this.navigate2group({ uuid: group.id });
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
      queryParams: { groupId: group?.key, pageID: Date.now() }
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
  addGroup(node?) {
    const group = node?.group?.origin || this.store.getRootGroup;
    this.navigate2group({ parentId: group.id });
    console.log('node', node);
    if (node?.group) {
      node.group.isExpanded = true;
    }
  }
  importAPI(type: keyof typeof actionComponent, title) {
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: actionComponent[type],
      nzComponentParams: {},
      nzFooter: [
        {
          label: $localize`Cancel`,
          onClick: () => modal.destroy()
        },
        {
          label: actionComponent[type] === SyncApiComponent ? $localize`Save and Sync` : $localize`Confirm`,
          disabled: () => !modal.componentInstance?.isValid,
          type: 'primary',
          onClick: () => {
            return new Promise(resolve => {
              modal.componentInstance.submit(status => {
                if (!status) {
                  this.message.error($localize`Failed to ${title},Please upgrade extension or try again later`);
                  return resolve(true);
                }
                if (status === 'stayModal') {
                  return resolve(true);
                }
                // Import API
                this.effect.getGroupList();
                this.message.success($localize`${title} successfully`);
                resolve(true);
                modal.destroy();
              }, modal);
            });
          }
        }
      ]
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
    this.expandKeys = parentNode?.isLeaf ? this.expandKeys : [...new Set([parentNode?.key, ...this.expandKeys])];
    this.effect.sortGroup(
      dragNode.isLeaf
        ? {
            id: node._group.id,
            type: node._group.type,
            sort,
            //@ts-ignore
            parentId: parentNode?.key || this.store.getRootGroup.id
          }
        : { ...node, sort, parentId: parentNode?.key || this.store.getRootGroup.id }
    );
  };

  /**
   * Group tree item click.
   *
   * @param event
   */
  clickTreeItem(event: NzFormatEmitEvent): void {
    const eventName = !event.node.isLeaf ? 'clickFolder' : event.node?.origin.isFixed ? 'clickFixedItem' : 'clickItem';
    switch (eventName) {
      case 'clickFolder': {
        //* Open Folder
        if (this.nzSelectedKeys.includes(event.node.key)) {
          event.node.isExpanded = true;
          break;
        }

        // * jump to group detail page
        this.navigate2group({ uuid: event.node.key });
        break;
      }
      case 'clickItem': {
        // * jump to api detail page
        const prefix = this.globalStore.isShare ? 'share' : '/home/workspace/project/api';
        this.router.navigate([`${prefix}/http/detail`], {
          queryParams: { uuid: event.node.key }
        });
        break;
      }
    }
  }

  navigate2group(queryParams) {
    const prefix = this.globalStore.isShare ? 'share' : '/home/workspace/project/api';
    this.router.navigate([`${prefix}/group/edit`], {
      queryParams
    });
  }
}
