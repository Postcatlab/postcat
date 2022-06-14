import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { GroupTreeItem, GroupApiDataModel } from '../../../../shared/models';
import { Group, ApiData, StorageRes, StorageResStatus } from '../../../../shared/services/storage/index.model';
import { Message } from '../../../../shared/services/message/message.model';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { ApiGroupEditComponent } from '../edit/api-group-edit.component';
import { MessageService } from '../../../../shared/services/message';
import { filter, Subject, takeUntil } from 'rxjs';
import { getExpandGroupByKey, listToTree } from '../../../../utils/tree/tree.utils';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { ModalService } from '../../../../shared/services/modal.service';
import { StorageService } from '../../../../shared/services/storage';
import { ElectronService } from '../../../../core/services';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
@Component({
  selector: 'eo-api-group-tree',
  templateUrl: './api-group-tree.component.html',
  styleUrls: ['./api-group-tree.component.scss'],
})
export class ApiGroupTreeComponent implements OnInit, OnDestroy {
  @ViewChild('apiGroup') apiGroup: NzTreeComponent;
  /**
   * Expanded keys of tree.
   */
  expandKeys: Array<string | number> = [];

  searchValue = '';
  /**
   * Default projectID.
   */
  projectID = 1;
  /**
   * All group items.
   */
  groupByID: { [key: number | string]: Group };
  /**
   * All api data items.
   */
  apiDataItems: { [key: number | string]: ApiData };

  /**
   * All Tree items.
   */
  treeItems: Array<GroupTreeItem>;
  /**
   * Level Tree nodes.
   */
  treeNodes: GroupTreeItem[] | NzTreeNode[] | any;
  fixedTreeNode: GroupTreeItem[] | NzTreeNode[] = [
    {
      title: '概况',
      key: 'overview',
      weight: 0,
      parentID: '0',
      isLeaf: true,
      isFixed: true,
    },
  ];
  nzSelectedKeys: number[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private messageService: MessageService,
    private storage: StorageService,
    public electron: ElectronService,
    public storageInstance: IndexedDBStorage
  ) {}
  ngOnInit(): void {
    this.buildGroupTreeData();
    this.watchApiAction();
    this.watchRouterChange();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Generate group tree nodes.
   */
  generateGroupTreeData(): void {
    this.treeItems.sort((a, b) => a.weight - b.weight);
    this.treeNodes = [];
    listToTree(this.treeItems, this.treeNodes, '0');
    setTimeout(() => {
      this.expandGroup();
    }, 0);
  }
  /**
   * Load all group and apiData items.
   */
  buildGroupTreeData(): void {
    this.groupByID = {};
    this.treeItems = [];
    this.getGroups();
  }
  getGroups() {
    this.storage.run('groupLoadAllByProjectID', [this.projectID], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        console.log(result);
        result.data.forEach((item) => {
          delete item.updatedAt;
          this.groupByID[item.uuid] = item;
          this.treeItems.push({
            title: item.name,
            key: `group-${item.uuid}`,
            weight: item.weight || 0,
            parentID: item.parentID ? `group-${item.parentID}` : '0',
            isLeaf: false,
          });
        });
      }
      this.getApis();
    });
  }
  getApis() {
    this.storage.run('apiDataLoadAllByProjectID', [this.projectID], (result: StorageRes) => {
      const { success, empty } = StorageResStatus;
      if ([success, empty].includes(result.status)) {
        let apiItems = {};
        [].concat(result.data).forEach((item: ApiData) => {
          delete item.updatedAt;
          apiItems[item.uuid] = item;
          this.treeItems.push({
            title: item.name,
            key: item.uuid.toString(),
            weight: item.weight || 0,
            parentID: item.groupID ? `group-${item.groupID}` : '0',
            method: item.method,
            isLeaf: true,
          });
        });
        this.apiDataItems = apiItems;
        this.messageService.send({ type: 'loadApi', data: this.apiDataItems });
        this.setSelectedKeys();
        this.generateGroupTreeData();
        this.restoreExpandStatus();
      }
    });
  }
  restoreExpandStatus() {
    const key = this.expandKeys.slice(0);
    this.expandKeys = [];
    this.expandKeys = key;
  }
  toggleExpand() {
    this.expandKeys = this.apiGroup.getExpandedNodeList().map((tree) => tree.key);
  }
  /**
   * Expand Select Group
   */
  private expandGroup() {
    if (!this.route.snapshot.queryParams.uuid) {
      return;
    }
    this.expandKeys = [
      ...this.expandKeys,
      ...(getExpandGroupByKey(this.apiGroup, this.route.snapshot.queryParams.uuid) || []),
    ];
  }
  // 重新构建整个group
  async rebuildGroupTree(result) {
    this.storageInstance.apiData.clear();
    this.storageInstance.group.clear();
    await this.storageInstance.apiData.bulkAdd(result);
    const apiItems = {};
    this.treeItems = [];
    result.forEach((item: ApiData) => {
      delete item.updatedAt;
      apiItems[item.uuid] = item;
      this.treeItems.push({
        title: item.name,
        key: item.uuid.toString(),
        weight: item.weight || 0,
        parentID: item.groupID ? `group-${item.groupID}` : '0',
        method: item.method,
        isLeaf: true,
      });
    });
    this.apiDataItems = apiItems;
    this.messageService.send({ type: 'loadApi', data: this.apiDataItems });
    this.setSelectedKeys();
    this.generateGroupTreeData();
    this.restoreExpandStatus();
  }

  /**
   * Watch  apiData change event.
   */
  watchApiAction(): void {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'addApiSuccess':
          case 'editApiSuccess':
          case 'copyApiSuccess':
          case 'deleteApiSuccess':
          case 'bulkDeleteApiSuccess':
          case 'updateGroupSuccess': {
            this.buildGroupTreeData();
            break;
          }
          case 'importSuccess': {
            const { apiData } = JSON.parse(inArg.data);
            this.rebuildGroupTree(apiData);
          }
        }
      });
  }
  /**
   * Group tree click api event
   *
   * @param inArg NzFormatEmitEvent
   */
  operateApiEvent(inArg: NzFormatEmitEvent | any): void {
    inArg.event.stopPropagation();
    this.messageService.send({ type: inArg.eventName, data: inArg.node });
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
      case 'clickFixedItem': {
        event.eventName = 'detailOverview';
        this.operateApiEvent(event);
        break;
      }
      case 'clickItem': {
        event.eventName = 'detailApi';
        this.operateApiEvent(event);
        break;
      }
    }
  }

  /**
   * Build group model.
   *
   * @param parentID number
   * @return Group
   */
  buildGroupModel(parentID?: string): Group {
    const groupModel: Group = {
      projectID: 1,
      parentID: parentID ? Number(parentID.replace('group-', '')) : 0,
      weight: 0,
      name: '',
    };
    return groupModel;
  }
  /**
   * Create group.
   */
  addGroup() {
    this.groupModal('添加分组', { group: this.buildGroupModel(), action: 'new' });
  }

  /**
   * Create sub group.
   *
   * @param node NzTreeNode
   */
  addSubGroup(node: NzTreeNode) {
    this.groupModal('添加子分组', { group: this.buildGroupModel(node.key), action: 'sub' });
  }

  /**
   * Edit group.
   *
   * @param node NzTreeNode
   */
  editGroup(node: NzTreeNode) {
    this.groupModal('编辑分组', { group: this.nodeToGroup(node), action: 'edit' });
  }

  /**
   * Delete group.
   *
   * @param node NzTreeNode
   */
  deleteGroup(node: NzTreeNode) {
    this.groupModal('删除分组', { group: this.nodeToGroup(node), treeItems: this.treeItems, action: 'delete' });
  }

  /**
   * Group edit modal.
   *
   * @param title
   * @param group
   */
  groupModal(title: string, params: object) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: title,
      nzContent: ApiGroupEditComponent,
      nzClosable: false,
      nzComponentParams: params,
      nzOnOk() {
        modal.componentInstance.submit();
      },
    });
  }
  /**
   * Drag & drop tree item.
   *
   * @param event
   */
  treeItemDrop(event: NzFormatEmitEvent): void {
    const dragNode = event.dragNode;
    const groupApiData: GroupApiDataModel = { group: [], api: [] };
    if (dragNode.parentNode) {
      const parentNode = dragNode.parentNode;
      parentNode.getChildren().forEach((item: NzTreeNode, index: number) => {
        if (item.isLeaf) {
          groupApiData.api.push({ uuid: item.key, weight: index, groupID: parentNode.key });
        } else {
          groupApiData.group.push({ uuid: item.key, weight: index, parentID: parentNode.key });
        }
      });
    } else {
      if (dragNode.isLeaf) {
        groupApiData.api.push({ uuid: dragNode.key, weight: 0, groupID: '0' });
      } else {
        groupApiData.group.push({ uuid: dragNode.key, weight: 0, parentID: '0' });
      }
    }
    this.updateoperateApiEvent(groupApiData);
  }
  /**
   * Update tree items after drag.
   *
   * @param data GroupApiDataModel
   */
  updateoperateApiEvent(data: GroupApiDataModel) {
    if (data.group.length > 0) {
      this.storage.run(
        'groupBulkUpdate',
        [
          data.group.map((val) => {
            return { ...val, uuid: val.uuid.replace('group-',''), parentID: val.parentID.replace('group-','') };
          }),
        ],
        (result: StorageRes) => {}
      );
    }
    if (data.api.length > 0) {
      this.storage.run('apiDataBulkUpdate', [data.api], (result: StorageRes) => {});
    }
  }
  private watchRouterChange() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.setSelectedKeys();
      this.expandGroup();
    });
  }
  private nodeToGroup(node: NzTreeNode): Group {
    return {
      projectID: 1,
      uuid: Number(node.origin.key.replace('group-', '')),
      name: node.origin.title,
      parentID: Number(node.origin.parentID.replace('group-', '')),
      weight: node.origin.weight,
    };
  }

  private setSelectedKeys() {
    console.log('setSelectedKeys', this.route.snapshot.queryParams.uuid, this.nzSelectedKeys);
    if (this.route.snapshot.queryParams.uuid) {
      this.nzSelectedKeys = [this.route.snapshot.queryParams.uuid];
    } else {
      this.nzSelectedKeys = [];
    }
  }
}
