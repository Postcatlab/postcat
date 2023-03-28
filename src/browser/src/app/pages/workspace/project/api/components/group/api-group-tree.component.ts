import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, reaction, toJS } from 'mobx';
import { NzTreeComponent, NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NewPeopleGuideComponent } from 'pc/browser/src/app/pages/new-people-guide/new-people-guide.component';
import { ApiGroupService } from 'pc/browser/src/app/pages/workspace/project/api/components/group/api-group.service';
import { BASIC_TABS_INFO, requestMethodMap, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiMockService } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { Group, GroupModuleType, GroupType, ViewGroup } from 'pc/browser/src/app/services/storage/db/models';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { eoDeepCopy, waitNextTick } from 'pc/browser/src/app/shared/utils/index.utils';
import { findTreeNode, getExpandGroupByKey } from 'pc/browser/src/app/shared/utils/tree/tree.utils';

import { ElectronService } from '../../../../../../core/services';
import { ProjectApiService } from '../../project-api.service';
import { ApiEffectService } from '../../store/api-effect.service';
import { ApiStoreService } from '../../store/api-state.service';

import { group } from 'console';

export type GroupAction = 'new' | 'edit' | 'delete';

const getAllAPIId = ({ id, children = [] }: any) => [id, ...children.map(getAllAPIId)];
@Component({
  selector: 'pc-api-group-tree',
  templateUrl: './api-group-tree.component.html',
  styleUrls: ['./api-group-tree.component.scss']
})
export class ApiGroupTreeComponent implements OnInit, OnDestroy {
  @ViewChild('apiGroup') apiGroup: NzTreeComponent;
  /**
   * Expanded keys of tree.
   */
  expandKeys: Array<string | number> = [];
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
  groupModuleName = 'API_GROUP';
  operateByModule = {};
  extensionActions = [
    {
      title: $localize`:@@ImportAPI:Import API`,
      menuTitle: $localize`Import From File`,
      traceID: 'click_import_project',
      click: title => this.projectApi.importProject('import', title)
    },
    {
      title: $localize`Sync API from URL`,
      menuTitle: $localize`Sync API from URL`,
      traceID: 'sync_api_from_url',
      click: title => this.projectApi.importProject('sync', title)
    }
  ];
  get TYPE_GEROUP_MODULE(): typeof GroupModuleType {
    return GroupModuleType;
  }
  private reactions = [];
  constructor(
    public electron: ElectronService,
    public projectApi: ProjectApiService,
    public groupService: ApiGroupService,
    public globalStore: StoreService,
    private store: ApiStoreService,
    private effect: ApiEffectService,
    private mockService: ApiMockService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: ModalService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {
    this.operateByModule = this.getGroupOperate();
  }

  ngOnInit(): void {
    this.isEdit = !this.globalStore.isShare;
    // * get group data from store
    this.effect.getGroupList().then(() => {
      this.isLoading = false;
    });
    this.reactions.push(
      autorun(() => {
        this.apiGroupTree = this.genComponentTree(this.store.getGroupList);
        //Set expand/selecte key
        this.expandKeys = [...this.getExpandKeys(), ...this.store.getExpandList].map(Number);
        waitNextTick().then(() => {
          this.initSelectKeys();
        });
      })
    );
    this.reactions.push(
      reaction(
        () => this.globalStore.getUrl,
        () => {
          this.initSelectKeys();
        }
      )
    );
  }
  initSelectKeys() {
    //Such as Env group tree
    const isOtherPage = [this.tabsConfig.basic_tabs.find(val => val.uniqueName === 'project-env-edit').pathname].some(path =>
      this.router.url.includes(path)
    );
    const { uuid } = this.route.snapshot.queryParams;
    const groupId = findTreeNode(this.store.getGroupList, val => val.id === (Number(uuid) || uuid))?.id;
    // console.log(groupId, this.store.getGroupList, uuid);
    if (!groupId) return;
    this.nzSelectedKeys = !isOtherPage ? [groupId] : [];
  }
  /**
   * Parse group data from database to view tree
   *
   * @param list P
   * @returns
   */
  parseGroupDataToViewTree(list) {
    return list.map((it: ViewGroup) => {
      //* Group
      if (it.type === GroupType.UserCreated) {
        return {
          ...it,
          module: this.groupModuleName,
          children: this.parseGroupDataToViewTree(it.children || [])
        };
      }
      if (it.type !== GroupType.Virtual) return;
      //* Resource
      const result = {
        ...(it.relationInfo || it),
        //virtual group id
        id: it.id,
        isLeaf: true,
        parentId: it.parentId,
        type: it.type,
        module: it.module,
        _group: {
          id: it.id,
          parentId: it.parentId,
          sort: it.sort
        },
        children: this.parseGroupDataToViewTree(it.children || [])
      };
      if (it.module === GroupModuleType.API) {
        result.isLeaf = false;
        result.method = this.requestMethodMap[result.requestMethod];
        result.methodText = result.method.length > 5 ? result.method.slice(0, 3) : result.method;
      }
      return result;
    });
  }
  /**
   * Generate Group for tree view
   *
   * @param apiGroups
   * @param groupId
   * @returns
   */
  genComponentTree(groups: Group[] = []) {
    groups = this.parseGroupDataToViewTree(groups);
    return [
      ...groups.map(group => ({
        ...group,
        title: group.name || '',
        key: group.id,
        children: this.genComponentTree([...(group?.children || [])])
      }))
    ];
  }
  getExpandKeys() {
    this.expandKeys = this.apiGroup?.getExpandedNodeList().map(node => node.key) || [];
    if (!this.route.snapshot.queryParams.uuid) {
      return this.expandKeys;
    }
    return [...this.expandKeys, ...(getExpandGroupByKey(this.apiGroup, this.route.snapshot.queryParams.uuid) || [])];
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
            type: node.type,
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
    const origin = event.node.origin;
    //* If the group is selected, click again to expand the group
    if (!event.node.isLeaf && this.nzSelectedKeys.includes(event.node.key)) {
      event.node.isExpanded = true;
    }
    if (origin.type === GroupType.UserCreated) {
      // * jump to group detail page
      this.groupService.toDetail(event.node.key);
      return;
    }
    switch (origin.module) {
      case GroupModuleType.API: {
        this.projectApi.toDetail(origin.apiUuid);
        break;
      }
      case GroupModuleType.Mock: {
        this.mockService.toDetail(origin.id);
        break;
      }
    }
  }

  private getGroupOperate = () => {
    return {
      [GroupModuleType.API]: [
        {
          title: $localize`Edit`,
          click: item => this.projectApi.toEdit(item.apiUuid)
        },
        {
          title: $localize`Add Mock`,
          click: item => this.mockService.toAdd(item.apiUuid)
        },
        {
          title: $localize`:@Copy:Copy`,
          click: item => this.projectApi.copy(item.apiUuid)
        },
        {
          title: $localize`:@Delete:Delete`,
          click: item => this.projectApi.toDelete(item)
        }
      ],
      [GroupModuleType.Mock]: [
        {
          title: $localize`Edit`,
          click: item => this.mockService.toEdit(item.uuid)
        },
        {
          title: $localize`:@Copy:Copy`,
          click: item => this.mockService.copy(item.uuid)
        },
        {
          title: $localize`:@Delete:Delete`,
          click: item => this.mockService.toDelete(item)
        }
      ],
      [GroupModuleType.Case]: [],
      [this.groupModuleName]: [
        {
          title: $localize`Add API`,
          click: item => this.projectApi.toAdd(item.id)
        },
        {
          title: $localize`Add Subgroup`,
          click: item => this.groupService.toAdd(item.id)
        },
        {
          title: $localize`Edit`,
          click: item => this.groupService.toEdit(item.uuid)
        },
        {
          title: $localize`:@@Delete:Delete`,
          click: item => this.groupService.toDelete(item)
        }
      ]
    };
  };
  ngOnDestroy(): void {
    //Clear all subscriptions
    this.reactions.forEach(reaction => reaction());
  }

  toGuide() {
    const modal = this.modal.create({
      nzTitle: $localize`New Mock`,
      nzWidth: '70%',
      nzContent: NewPeopleGuideComponent
    });
  }

  toMock() {
    const prefix = this.globalStore.isShare ? 'share' : '/home/workspace/project/api';
    this.router.navigate([`${prefix}/http/mock`], {
      queryParams: {
        pageID: Date.now().toString()
      }
    });
  }
}
