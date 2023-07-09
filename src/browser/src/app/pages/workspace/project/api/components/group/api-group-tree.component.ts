import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { action, autorun, reaction, toJS } from 'mobx';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzTreeComponent, NzFormatEmitEvent, NzTreeNodeOptions, NzTreeNode, NzFormatBeforeDropEvent } from 'ng-zorro-antd/tree';
import { AiToApiService } from 'pc/browser/src/app/pages/modules/ai-to-api/ai-to-api.service';
import { PageUniqueName } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import { ApiGroupService } from 'pc/browser/src/app/pages/workspace/project/api/components/group/api-group.service';
import {
  BASIC_TABS_INFO,
  requestMethodMap,
  SYSTEM_MOCK_NAME,
  TabsConfig
} from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiMockService } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ApiCaseService } from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-case.service';
import {
  Group,
  GroupModelIDByModule,
  GroupModuleType,
  GroupType,
  MockCreateWay,
  ViewGroup
} from 'pc/browser/src/app/services/storage/db/models';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { eoDeepCopy, waitNextTick } from 'pc/browser/src/app/shared/utils/index.utils';
import { findTreeNode, getExpandGroupByKey } from 'pc/browser/src/app/shared/utils/tree/tree.utils';
import { of } from 'rxjs';

import { ElectronService } from '../../../../../../core/services';
import { ProjectApiService } from '../../service/project-api.service';
import { ApiEffectService } from '../../store/api-effect.service';
import { ApiStoreService } from '../../store/api-state.service';

export type GroupAction = 'new' | 'edit' | 'delete';

const getAllAPIId = ({ id, children = [] }: any) => [id, ...children.map(getAllAPIId)];
@Component({
  selector: 'pc-api-group-tree',
  templateUrl: './api-group-tree.component.html',
  styleUrls: ['./api-group-tree.component.scss']
})
export class ApiGroupTreeComponent implements OnInit, OnDestroy {
  @ViewChild('apiGroup') apiGroup: NzTreeComponent;
  @ViewChild('AIToAPITitle') AIToAPITitle: TemplateRef<HTMLDivElement>;
  primaryColor = 'var(--primary-color)';

  /**
   * Expanded keys of tree.
   */
  expandKeys: Array<string | number> = [];
  requestMethodMap = requestMethodMap;
  nzSelectedKeys = [];
  searchValue = '';

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
      iconName: 'file-addition',
      click: title => this.projectApi.importProject('import', title)
    },
    {
      title: $localize`Sync API from URL`,
      menuTitle: $localize`Sync API from URL`,
      traceID: 'sync_api_from_url',
      iconName: 'upload-file',
      click: title => this.projectApi.importProject('sync', title)
    }
  ];
  groupModuleByUniqueName = {
    [PageUniqueName.GroupEdit]: this.groupModuleName,
    [PageUniqueName.HttpCase]: GroupModuleType.Case,
    [PageUniqueName.HttpMock]: GroupModuleType.Mock,
    [PageUniqueName.EnvEdit]: '',
    [PageUniqueName.HttpTest]: GroupModuleType.API,
    [PageUniqueName.HttpDetail]: GroupModuleType.API,
    [PageUniqueName.HttpEdit]: GroupModuleType.API
  };
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
    private caseService: ApiCaseService,
    private feedback: EoNgFeedbackMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private nzContextMenuService: NzContextMenuService,
    private AiToApiService: AiToApiService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {
    this.operateByModule = this.getGroupOperate();
  }
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }
  searchFunc = (node: NzTreeNodeOptions) => {
    const { title } = node;
    const uri = node.relationInfo?.uri;
    const searchVal = this.searchValue.toLowerCase();
    return [uri, title].some(n => n?.toLowerCase()?.includes?.(searchVal));
  };
  onSearchFocus($event) {
    this.expandKeys = this.apiGroup?.getExpandedNodeList().map(node => node.key) || [];
  }
  shrinkLevelGroup(trees: NzTreeNode[]) {
    trees.forEach(node => {
      if (!node.isExpanded) return;
      node.isExpanded = false;
      if (node.children) {
        this.shrinkLevelGroup(node.children);
      }
    });
  }
  searchValueChange($event) {
    if (!this.searchValue) {
      //? All set false
      this.shrinkLevelGroup(this.apiGroup.getTreeNodes());
      this.expandKeys = [...this.expandKeys];
    }
  }
  ngOnInit(): void {
    this.isEdit = !this.globalStore.isShare;
    // * get group data from store
    this.effect.getGroupList().then(() => {
      this.isLoading = false;
    });
    this.reactions.push(
      autorun(() => {
        // * Get previous expandKeys before apiGroupComponent init
        this.expandKeys = this.apiGroup?.getExpandedNodeList().map(node => node.key) || [];

        this.apiGroupTree = this.genComponentTree(this.store.getGroupList);

        //Wait for the tree component to be rendered
        waitNextTick().then(() => {
          //Reset expandKeys
          //TODO only when the tree component is added, the expandedNodeList will be updated
          this.expandKeys = this.getExpandKeys();

          //* Set expand/selecte key
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
  private getCurrentGroupIDByModelID() {
    const { uuid } = this.route.snapshot.queryParams;
    if (!uuid) return;
    const currentModule =
      this.groupModuleByUniqueName[this.tabsConfig.BASIC_TABS.find(val => this.router.url.includes(val.pathname)).uniqueName];
    return findTreeNode(this.apiGroupTree, val => val.module === currentModule && val.modelID === (Number(uuid) || uuid))?.id;
  }
  initSelectKeys() {
    //Such as Env group tree
    const groupId = this.getCurrentGroupIDByModelID();
    if (!groupId) {
      this.nzSelectedKeys = [];
      return;
    }
    this.nzSelectedKeys = [groupId];
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
          modelID: it.id,
          module: this.groupModuleName,
          children: this.parseGroupDataToViewTree(it.children || [])
        };
      }
      if (it.type !== GroupType.Virtual) return;
      //* Resource
      const result = {
        //virtual group id
        isLeaf: true,
        ...it,
        modelID: it.relationInfo[GroupModelIDByModule[it.module]],
        relationInfo: it.relationInfo,
        children: this.parseGroupDataToViewTree(it.children || [])
      };
      switch (it.module) {
        case GroupModuleType.API: {
          result.isLeaf = false;
          result.method = this.requestMethodMap[result.relationInfo.requestMethod];
          result.methodText = result.method.length > 5 ? result.method.slice(0, 3) : result.method;
          break;
        }
        case GroupModuleType.Mock: {
          if (it.relationInfo.createWay === MockCreateWay.System) {
            result.relationInfo.name = SYSTEM_MOCK_NAME;
          }
          break;
        }
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
  genComponentTree(groups: Group[] = []): ViewGroup[] {
    groups = this.parseGroupDataToViewTree(groups);
    return [
      ...groups.map((group: ViewGroup) => ({
        ...group,
        title: group.relationInfo?.name || group.name || '',
        key: group.id,
        children: this.genComponentTree([...(group?.children || [])])
      }))
    ];
  }
  getExpandKeys() {
    if (!this.route.snapshot.queryParams.uuid) {
      return this.expandKeys;
    }
    const groupId = this.getCurrentGroupIDByModelID();
    if (!groupId) return this.expandKeys;
    //Get tree node by group id
    return [...new Set([...this.expandKeys, ...(getExpandGroupByKey(this.apiGroup, groupId) || [])])];
  }
  beforeDrop = (arg: NzFormatBeforeDropEvent) => {
    const targetItem = arg.node?.origin;
    const dragItem = arg.dragNode?.origin;
    const post = arg.pos === -1 ? 'bofore' : arg.pos === 1 ? 'in' : 'behind';
    const tips = {
      [GroupModuleType.Mock]: 'Mock',
      [GroupModuleType.Case]: $localize`Case`
    };
    if ([GroupModuleType.Mock, GroupModuleType.Case].includes(dragItem.module)) {
      this.feedback.warning($localize`${tips[dragItem.module]} does not support sorting at the moment, please report to Github Issue`);
      return of(false);
    }
    if (dragItem.module === GroupModuleType.API && targetItem.module === GroupModuleType.API && post === 'in') {
      this.feedback.warning($localize`${tips[dragItem.module]} does not support sorting at the moment, please report to Github Issue`);
      return of(false);
    }
    return of(true);
  };
  /**
   * Drag & drop tree item.
   *
   * @param event
   */
  drop = ({ dragNode }: NzFormatEmitEvent) => {
    const node = eoDeepCopy(dragNode.origin);
    if ([GroupModuleType.Mock, GroupModuleType.Case].includes(node.module)) {
      return;
    }
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
            id: node.id,
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

    if (origin.type === GroupType.UserCreated) {
      event.node.isExpanded = true;
      // * jump to group detail page
      this.groupService.toDetail(event.node.key);
      return;
    }
    switch (origin.module) {
      case GroupModuleType.API: {
        this.projectApi.toDetail(origin.relationInfo.apiUuid);
        break;
      }
      case GroupModuleType.Mock: {
        this.mockService.toDetail(origin.relationInfo);
        break;
      }
      case GroupModuleType.Case: {
        this.caseService.toDetail(origin.relationInfo);
        break;
      }
    }
  }

  private getGroupOperate = () => {
    return {
      [GroupModuleType.API]: {
        list: [
          {
            title: $localize`Edit`,
            click: ({ relationInfo: item }) => this.projectApi.toEdit(item.apiUuid)
          },
          {
            title: $localize`Add Mock`,
            click: ({ relationInfo: item }) => this.mockService.toAdd(item.apiUuid)
          },
          {
            title: $localize`Add Case`,
            click: ({ relationInfo: item }) => this.caseService.toAdd(item.apiUuid)
          },
          {
            title: $localize`:@Copy:Copy`,
            click: ({ relationInfo: item }) => this.projectApi.copy(item.apiUuid)
          },
          {
            title: $localize`:@Delete:Delete`,
            click: ({ relationInfo: item }) => this.projectApi.toDelete(item)
          }
        ]
      },
      [GroupModuleType.Mock]: {
        showFn: ({ relationInfo: item }) => {
          return item.createWay === MockCreateWay.Custom;
        },
        list: [
          {
            title: $localize`Edit`,
            click: ({ relationInfo: item }) => this.mockService.toEdit(item.id)
          },
          {
            title: $localize`:@Copy:Copy`,
            click: ({ relationInfo: item }) => this.mockService.copy(item.id)
          },
          {
            title: $localize`:@Delete:Delete`,
            click: ({ relationInfo: item }) => this.mockService.toDelete(item.id, item.name)
          }
        ]
      },
      [GroupModuleType.Case]: {
        list: [
          {
            title: $localize`Edit`,
            click: ({ relationInfo: item }) => this.caseService.toEdit(item.apiCaseUuid)
          },
          {
            title: $localize`:@Copy:Copy`,
            click: ({ relationInfo: item }) => this.caseService.copy(item.apiCaseUuid)
          },
          {
            title: $localize`:@Delete:Delete`,
            click: ({ relationInfo: item }) => this.caseService.toDelete(item)
          }
        ]
      },
      [this.groupModuleName]: {
        list: [
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
            click: item => this.groupService.toEdit(item.id)
          },
          {
            title: $localize`:@@Delete:Delete`,
            click: item => this.groupService.toDelete(item)
          }
        ]
      }
    };
  };

  aiToAPI() {
    this.AiToApiService.openAIToAPIModal(this.AIToAPITitle);
  }
  ngOnDestroy(): void {
    //Clear all subscriptions
    this.reactions.forEach(reaction => reaction());
  }
}
