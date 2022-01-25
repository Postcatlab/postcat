import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { GroupTreeItem, GroupApiDataModel } from '../../../../shared/models';
import { Group } from '../../../../shared/services/group/group.model';
import { Message } from '../../../../shared/services/message/message.model';
import { ApiData } from '../../../../shared/services/api-data/api-data.model';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { ApiGroupEditComponent } from '../edit/api-group-edit.component';

import { GroupService } from '../../../../shared/services/group/group.service';
import { ApiDataService } from '../../../../shared/services/api-data/api-data.service';
import { MessageService } from '../../../../shared/services/message';

import { Subject, takeUntil } from 'rxjs';
import { listToTree } from '../../../../utils/tree';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
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
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private modalService: NzModalService,
    private groupService: GroupService,
    private apiDataService: ApiDataService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.buildGroupTreeData();
    this.watchApiAction();
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
    listToTree(this.treeItems, this.treeNodes, 0);
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
    this.groupService.loadAllByProjectID(this.projectID).subscribe((items: Array<Group>) => {
      items.forEach((item) => {
        delete item.updatedAt;
        this.groupByID[item.uuid] = item;
        this.treeItems.push({
          title: item.name,
          key: item.uuid,
          weight: item.weight || 0,
          parentID: item.parentID || 0,
          isLeaf: false,
        });
      });
      this.getApis();
    });
  }
  getApis() {
    this.apiDataService.loadAllByProjectID(this.projectID).subscribe((items: Array<ApiData>) => {
      let apiItems = {};
      items.forEach((item) => {
        delete item.updatedAt;
        apiItems[item.uuid] = item;
        this.treeItems.push({
          title: item.name,
          key: item.uuid,
          weight: item.weight || 0,
          parentID: item.groupID || 0,
          method: item.method,
          isLeaf: true,
        });
      });
      this.apiDataItems = apiItems;
      this.messageService.send({ type: 'loadApi', data: this.apiDataItems });
      this.generateGroupTreeData();
      this.restoreExpandStatus();
    });
  }
  restoreExpandStatus() {
    let key = this.expandKeys.slice(0);
    this.expandKeys = [];
    this.expandKeys = key;
  }
  toggleExpand() {
    this.expandKeys = this.apiGroup.getExpandedNodeList().map((tree) => tree.key);
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
          case 'addApi':
          case 'editApi':
          case 'deleteApi':
          case 'bulkDeleteApi': {
            this.buildGroupTreeData();
            break;
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
    if (!event.node.isLeaf) {
      event.node.isExpanded = !event.node.isExpanded;
      this.toggleExpand();
    } else {
      event.eventName = 'detailApi';
      this.operateApiEvent(event);
    }
  }

  /**
   * Build group model.
   *
   * @param parentID number
   * @return Group
   */
  buildGroupModel(parentID?: number | string): Group {
    const groupModel: Group = {
      projectID: 1,
      parentID: parentID || 0,
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
    this.groupModal('删除分组', { group: this.nodeToGroup(node), action: 'delete' });
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
      nzComponentParams: params,
      nzFooter: null,
    });
    modal.afterClose.subscribe((res: Message) => {
      if (res) {
        if ('deleteGroup' === res.type) {
          const group: Group = res.data.group;
          this.deleteGroupTreeItems(group);
        } else {
          this.buildGroupTreeData();
        }
      }
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
        groupApiData.api.push({ uuid: dragNode.key, weight: 0, groupID: 0 });
      } else {
        groupApiData.group.push({ uuid: dragNode.key, weight: 0, parentID: 0 });
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
    if (data.group.length > 0 && data.api.length > 0) {
      this.groupService.bulkUpdate(data.group).subscribe((result) => {
        this.apiDataService.bulkUpdate(data.api).subscribe((result) => {});
      });
    } else if (data.group.length > 0) {
      this.groupService.bulkUpdate(data.group).subscribe((result) => {});
    } else if (data.api.length > 0) {
      this.apiDataService.bulkUpdate(data.api).subscribe((result) => {});
    }
  }
  private nodeToGroup(node: NzTreeNode): Group {
    return {
      projectID: 1,
      uuid: node.origin.key,
      name: node.origin.title,
      parentID: node.origin.parentID,
      weight: node.origin.weight,
    };
  }

  /**
   * Get all child items belong to parentID
   *
   * @param list
   * @param tree
   * @param parentID
   */
  getChildrenFromTree(list: Array<GroupTreeItem>, tree: GroupApiDataModel, parentID: number | string): void {
    list.forEach((data) => {
      if (data.parentID === parentID) {
        if (!data.isLeaf) {
          tree.group.push(data.key);
          this.getChildrenFromTree(list, tree, data.key);
        } else {
          tree.api.push(data.key);
        }
      }
    });
  }
  /**
   * Delete all tree items of parent node.
   *
   * @param data GroupApiDataModel
   */
  deleteGroupTreeItems(group: Group) {
    const data: GroupApiDataModel = { group: [], api: [] };
    this.getChildrenFromTree(this.treeItems, data, group.uuid);
    if (data.group.length > 0 && data.api.length > 0) {
      this.groupService.bulkRemove(data.group).subscribe((result) => {
        this.messageService.send({ type: 'gotoBulkDeleteApi', data: { uuids: data.api } });
      });
    } else if (data.group.length > 0) {
      this.groupService.bulkRemove(data.group).subscribe((result) => {
        this.buildGroupTreeData();
      });
    } else if (data.api.length > 0) {
      this.messageService.send({ type: 'gotoBulkDeleteApi', data: { uuids: data.api } });
    } else {
      this.buildGroupTreeData();
    }
  }
}
