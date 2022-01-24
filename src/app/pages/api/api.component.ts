import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { Message, MessageService } from '../../shared/services/message';
import { GroupService } from '../../shared/services/group/group.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiDataService } from '../../shared/services/api-data/api-data.service';
import { listToTree } from '../../utils/tree';

import { GroupApiDataModel, GroupTreeItem } from '../../shared/models';
import { ApiData } from '../../shared/services/api-data/api-data.model';
import { Group } from '../../shared/services/group/group.model';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiTabService } from './tab/api-tab.service';
@Component({
  selector: 'eo-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit, OnDestroy {
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

  /**
   * API uuid
   */
  id: number;

  TABS = [
    {
      routerLink: 'detail',
      title: '文档',
    },
    {
      routerLink: 'edit',
      title: '编辑',
    },
    {
      routerLink: 'test',
      title: '测试',
    },
  ];
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private apiDataService: ApiDataService,
    private messageService: MessageService,
    private modalService: NzModalService,
    private tabSerive: ApiTabService
  ) {}

  ngOnInit(): void {
    this.watchChangeRouter();
    this.buildGroupTreeData();
    this.watchGroupTreeData();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      this.generateGroupTreeData();
    });
  }
  /**
   * Get current API ID to show content tab
   */
  watchChangeRouter() {
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.route.queryParamMap.subscribe((params) => {
      this.id = Number(params.get('uuid'));
    });
  }
  clickContentMenu(data) {
    this.tabSerive.apiEvent$.next({ action: 'beforeChangeRouter', data: data });
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
        this.copyApi(event.node);
        break;
      case 'deleteApi':
        this.deleteApi(event.node);
        break;
      default: {
        this.tabSerive.apiEvent$.next({ action: event.eventName, data: event.node });
        break;
      }
    }
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
          case 'editApi': 
          {
            this.tabSerive.apiEvent$.next({ action: `${data.type}Finish`,data:data.data});
            this.buildGroupTreeData();
            break;
          }
          case 'groupAdd':
          case 'groupEdit':
          case 'groupDelete':
            this.buildGroupTreeData();
            break;
          case 'apiDelete':
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
   * Copy api data.
   *
   * @param node NzTreeNode
   */
  copyApi(node: NzTreeNode): void {
    const data = this.apiDataItems[node.key];
    delete data.uuid;
    delete data.createdAt;
    data.name += ' Copy';
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(data));
    this.tabSerive.apiEvent$.next({
      action: 'newApi',
    });
  }

  /**
   * Delete api data.
   *
   * @param node NzTreeNode
   */
  deleteApi(node: NzTreeNode): void {
    this.modalService.confirm({
      nzTitle: '删除确认?',
      nzContent: `确认要删除数据<strong>${node.title}</strong>吗？删除后不可恢复！`,
      nzOnOk: () => {
        this.apiDataService.remove(node.key).subscribe((result: boolean) => {
          this.messageService.send({ type: 'apiDelete', data: { uuid: node.key } });
        });
      },
    });
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

  /**
   * Update tree items after drag.
   *
   * @param data GroupApiDataModel
   */
  updateGroupTreeEvent(data: GroupApiDataModel) {
    if (data.group.length > 0 && data.api.length > 0) {
      this.groupService.bulkUpdate(data.group).subscribe((result) => {
        console.log(result);
        this.apiDataService.bulkUpdate(data.api).subscribe((result) => {
          console.log(result);
        });
      });
    } else if (data.group.length > 0) {
      this.groupService.bulkUpdate(data.group).subscribe((result) => {
        console.log(result);
      });
    } else if (data.api.length > 0) {
      this.apiDataService.bulkUpdate(data.api).subscribe((result) => {
        console.log(result);
      });
    }
  }
}
