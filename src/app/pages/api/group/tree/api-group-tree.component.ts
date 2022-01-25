import { Component, OnInit, OnDestroy } from '@angular/core';

import { GroupTreeItem, GroupApiDataModel } from '../../../../shared/models';
import { Group } from '../../../../shared/services/group/group.model';
import { Message } from '../../../../shared/services/message/message.model';
import { ApiData } from '../../../../shared/services/api-data/api-data.model';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { ApiGroupEditComponent } from '../edit/api-group-edit.component';

import { GroupService } from '../../../../shared/services/group/group.service';
import { ApiService } from '../../api.service';
import { ApiTabService } from '../../tab/api-tab.service';
import { ApiDataService } from '../../../../shared/services/api-data/api-data.service';
import { MessageService } from '../../../../shared/services/message';

import { Subject, takeUntil } from 'rxjs';
import { listToTree } from '../../../../utils/tree';
@Component({
  selector: 'eo-api-group-tree',
  templateUrl: './api-group-tree.component.html',
  styleUrls: ['./api-group-tree.component.scss'],
})
export class ApiGroupTreeComponent implements OnInit, OnDestroy {
  /**
   * Expanded keys of tree.
   */
  expandedKeys: Array<string | number>;

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
  treeNodes: Array<GroupTreeItem>;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private modalService: NzModalService,
    private groupService: GroupService,
    private apiDataService: ApiDataService,
    private apiService: ApiService,
    private tabSerive: ApiTabService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.buildGroupTreeData();
    this.watchGroupTreeData();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Watch group and apiData change event.
   */
  watchGroupTreeData(): void {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Message) => {
        switch (data.type) {
          case 'addApi':
          case 'editApi': {
            this.tabSerive.apiEvent$.next({ action: `${data.type}Finish`, data: data.data });
            this.buildGroupTreeData();
            break;
          }
          case 'copyApi': {
            this.tabSerive.apiEvent$.next({
              action: 'copyApi',
            });
            break;
          }
          case 'groupAdd':
          case 'groupEdit':
          case 'groupDelete':
            this.buildGroupTreeData();
            break;
          case 'deleteApi':
            let tmpApi = data.data;
            this.tabSerive.apiEvent$.next({ action: 'removeApiDataTabs', data: [tmpApi.uuid] });
            this.buildGroupTreeData();
            break;
          case 'apiBatchDelete':
            this.tabSerive.apiEvent$.next({ action: 'removeApiDataTabs', data: data.data.uuids });
            break;
        }
      });
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
      this.tabSerive.apiEvent$.next({ action: 'afterLoadApi', data: this.apiDataItems });
      this.generateGroupTreeData();
    });
  }
  /**
   * Event emit from group tree component.
   *
   * @param event NzFormatEmitEvent
   */
  groupTreeEvent(event: NzFormatEmitEvent | any): void {
    switch (event.eventName) {
      case 'deleteGroup':
        this.deleteGroupTreeItems(event.node);
        break;
      case 'loadAllGroup':
        this.buildGroupTreeData();
        break;
      case 'copyApi':
        this.apiService.copy(this.apiDataItems[event.node.key]);
        break;
      case 'deleteApi':
        this.apiService.delete(this.apiDataItems[event.node.key]);
        break;
      default: {
        this.tabSerive.apiEvent$.next({ action: event.eventName, data: event.node });
        break;
      }
    }
  }

  /**
   * Group tree item click.
   *
   * @param event
   */
  treeItemClick(event: NzFormatEmitEvent): void {
    if (!event.node.isLeaf) {
      event.node.isExpanded = !event.node.isExpanded;
    } else {
      event.eventName = 'detailApi';
      this.groupTreeEvent(event);
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
  newGroup() {
    this.groupModal('添加分组', { group: this.buildGroupModel(), action: 'new' });
  }

  /**
   * Create sub group.
   *
   * @param node NzTreeNode
   */
  newSubGroup(node: NzTreeNode) {
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
          this.groupTreeEvent({
            eventName: 'deleteGroup',
            node: group,
          });
        } else {
          this.groupTreeEvent({
            eventName: 'loadAllGroup',
          });
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
    this.updateGroupTreeEvent(groupApiData);
  }
  /**
   * Update tree items after drag.
   *
   * @param data GroupApiDataModel
   */
  updateGroupTreeEvent(data: GroupApiDataModel) {
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
        this.apiDataService.bulkRemove(data.api).subscribe((result) => {
          this.buildGroupTreeData();
          this.messageService.send({ type: 'apiBatchDelete', data: { uuids: data.api } });
        });
      });
    } else if (data.group.length > 0) {
      this.groupService.bulkRemove(data.group).subscribe((result) => {
        this.buildGroupTreeData();
      });
    } else if (data.api.length > 0) {
      this.apiDataService.bulkRemove(data.api).subscribe((result) => {
        this.buildGroupTreeData();
        this.messageService.send({ type: 'apiBatchDelete', data: { uuids: data.api } });
      });
    } else {
      this.buildGroupTreeData();
    }
  }
  onClick(event: NzFormatEmitEvent) {
    event.event.stopPropagation();
    this.groupTreeEvent(event);
  }
}
