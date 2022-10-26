import { debounce } from 'eo/workbench/browser/src/app/utils/index.utils';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { GroupTreeItem, GroupApiDataModel } from '../../../../shared/models';
import { Group, ApiData, StorageRes, StorageResStatus } from '../../../../shared/services/storage/index.model';
import { Message } from '../../../../shared/services/message/message.model';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { ApiGroupEditComponent } from '../edit/api-group-edit.component';
import { MessageService } from '../../../../shared/services/message';
import { filter, Subject, takeUntil } from 'rxjs';
import { getExpandGroupByKey, listToTree } from '../../../../utils/tree/tree.utils';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { ModalService } from '../../../../shared/services/modal.service';
import { StorageService } from '../../../../shared/services/storage';
import { ElectronService } from '../../../../core/services';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { ImportApiComponent } from 'eo/workbench/browser/src/app/shared/components/import-api/import-api.component';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { ProjectService } from 'eo/workbench/browser/src/app/shared/services/project/project.service';
import { StatusService } from 'eo/workbench/browser/src/app/shared/services/status.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
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
  expandKeys: Array<string> = [];

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
  treeNodes: GroupTreeItem[] | NzTreeNode[] | any = [];
  apiDataLoading = true;
  fixedTreeNode: GroupTreeItem[] | NzTreeNode[] = [
    {
      title: $localize`:@@API Index:Index`,
      key: 'overview',
      weight: 0,
      parentID: '0',
      isLeaf: true,
      isFixed: true,
    },
  ];
  nzSelectedKeys: number[] = [];
  isEdit: boolean;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public electron: ElectronService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private message: EoMessageService,
    private messageService: MessageService,
    private storage: StorageService,
    private apiService: ApiService,
    private projectService: ProjectService,
    private nzModalService: NzModalService,
    public status: StatusService,
    private http: RemoteService
  ) {}
  ngOnInit(): void {
    this.isEdit=!this.status.isShare;
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
  buildGroupTreeData = debounce(async (callback) => {
    this.groupByID = {};
    this.treeItems = [];
    await this.getProjectCollections();
    callback?.();
  });

  async getProjectCollections() {
    this.apiDataLoading = true;
    return new Promise(async (resolve) => {
      if (this.status.isShare) {
        const [, err]: any = await this.http.api_shareGetAllApi({ uniqueID: '' });
        if (err) {
          return;
        }
        this.apiDataLoading = false;
        return;
      }
      this.storage.run('projectCollections', [this.projectService.currentProjectID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          const { groups, apis } = result.data;
          this.getGroups(groups);
          this.getApis(apis);
        }
        resolve(true);
        this.apiDataLoading = false;
      });
    });
  }

  getGroups(apiGroups = []) {
    apiGroups.forEach((item) => {
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
  async getApis(apis) {
    const apiItems = {};
    [].concat(apis).forEach((item: ApiData) => {
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
          case 'updateGroupSuccess': {
            const group = inArg.data?.group;

            if (
              inArg.type === 'updateGroupSuccess' &&
              group?.parentID &&
              !this.expandKeys.includes(`group-${group?.parentID}`)
            ) {
              this.expandKeys.push(`group-${group?.parentID}`);
            }

            this.buildGroupTreeData();
            break;
          }
        }
      });
  }
  /**
   * Group tree click api event
   * Router jump page or Event emit
   *
   * @param inArg NzFormatEmitEvent
   */
  operateApiEvent(inArg: NzFormatEmitEvent | any): void {
    const prefix=this.status.isShare?'home/share':'/home/api';
    inArg.event.stopPropagation();
    switch (inArg.eventName) {
      case 'testApi':
      case 'editApi':
      case 'detailApi': {
        this.router.navigate([`${prefix}/http/${inArg.eventName.replace('Api', '')}`], {
          queryParams: { uuid: inArg.node.key },
        });
        break;
      }
      case 'jumpOverview': {
        this.router.navigate([`${prefix}/overview`], {
          queryParams: { uuid: 'overview' },
        });
        break;
      }
      case 'addAPI': {
        this.router.navigate([`${prefix}/http/edit`], {
          queryParams: { groupID: inArg.node?.origin.key.replace('group-', '') },
        });
        break;
      }
      case 'importAPI': {
        const title = $localize`:@@ImportAPI:Import API`;
        const modal = this.modalService.create({
          nzTitle: title,
          nzContent: ImportApiComponent,
          nzMaskClosable: false,
          nzComponentParams: {},
          nzOnOk: () =>
            new Promise((resolve) => {
              modal.componentInstance.submit((status) => {
                if (status) {
                  this.message.success($localize`${title} successfully`);
                  this.buildGroupTreeData(resolve);
                  modal.destroy();
                } else {
                  this.message.error($localize`Failed to ${title}`);
                }
              });
            }),
        });
        break;
      }
      case 'deleteApi': {
        const apiInfo = inArg.node;
        this.nzModalService.confirm({
          nzTitle: $localize`Deletion Confirmation?`,
          nzContent: $localize`Are you sure you want to delete the data <strong title="${apiInfo.name}">${
            apiInfo.name.length > 50 ? apiInfo.name.slice(0, 50) + '...' : apiInfo.name
          }</strong> ? You cannot restore it once deleted!`,
          nzOnOk: () => {
            this.apiService.delete(apiInfo.uuid);
          },
        });
        break;
      }
      case 'copyApi': {
        this.apiService.copy(inArg.node);
        break;
      }
    }
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
        this.operateApiEvent({ ...event, eventName: 'jumpOverview' });
        break;
      }
      case 'clickItem': {
        this.operateApiEvent({ ...event, eventName: 'detailApi' });
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
    this.groupModal($localize`Add Group`, { group: this.buildGroupModel(), action: 'new' });
  }

  /**
   * Create sub group.
   *
   * @param node NzTreeNode
   */
  addSubGroup(node: NzTreeNode) {
    this.groupModal($localize`Add Subgroup`, { group: this.buildGroupModel(node.key), action: 'sub' });
  }

  /**
   * Edit group.
   *
   * @param node NzTreeNode
   */
  editGroup(node: NzTreeNode) {
    this.groupModal($localize`Edit Group`, { group: this.nodeToGroup(node), action: 'edit' });
  }

  /**
   * Delete group.
   *
   * @param node NzTreeNode
   */
  deleteGroup(node: NzTreeNode) {
    this.groupModal($localize`Delete Group`, {
      group: this.nodeToGroup(node),
      treeItems: this.treeItems,
      action: 'delete',
    });
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
  treeItemDrop = (event: NzFormatEmitEvent) => {
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
      const nodes = this.apiGroup.getTreeNodes().filter((n) => n.level === 0);
      nodes.forEach((item, index) => {
        if (item.isLeaf) {
          groupApiData.api.push({ uuid: item.key, weight: index, groupID: '0' });
        } else {
          groupApiData.group.push({ uuid: item.key, weight: index, parentID: '0' });
        }
      });
    }
    this.updateOperateApiEvent(groupApiData);
  };

  private replaceGroupKey(key: string) {
    return Number(key.replace('group-', ''));
  }
  /**
   * Update tree items after drag.
   *
   * @param data GroupApiDataModel
   */
  updateOperateApiEvent(data: GroupApiDataModel) {
    let count = 0;
    if (data.group.length > 0) {
      count++;
      this.storage.run(
        'groupBulkUpdate',
        [
          data.group.map((val) => ({
            ...val,
            uuid: this.replaceGroupKey(val.uuid),
            parentID: this.replaceGroupKey(val.parentID),
          })),
        ],
        (result: StorageRes) => {
          if (--count === 0) {
            this.buildGroupTreeData();
          }
        }
      );
    }
    if (data.api.length > 0) {
      count++;
      this.storage.run(
        'apiDataBulkUpdate',
        [
          data.api.map((n) => ({
            ...n,
            uuid: this.replaceGroupKey(n.uuid),
            groupID: this.replaceGroupKey(n.groupID),
          })),
        ],
        (result: StorageRes) => {
          if (--count === 0) {
            this.buildGroupTreeData();
          }
        }
      );
    }
  }
  /**
   * Expand Group fit current select api  when router change
   */
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
    if (this.route.snapshot.queryParams.uuid) {
      this.nzSelectedKeys = [this.route.snapshot.queryParams.uuid];
    } else {
      this.nzSelectedKeys = [];
    }
  }
}
