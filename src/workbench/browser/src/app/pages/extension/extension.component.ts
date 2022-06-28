import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { GroupTreeItem } from 'eo/workbench/browser/src/app/shared/models';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { filter, Subject } from 'rxjs';
import { ExtensionGroupType } from './extension.model';
import { ExtensionService } from './extension.service';

@Component({
  selector: 'eo-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss'],
})
export class ExtensionComponent implements OnInit {
  keyword = '';
  nzSelectedKeys: (number | string)[] = [];
  treeNodes: NzTreeNodeOptions[] = [
    {
      key: 'official',
      title: 'Official',
      isLeaf: true,
    },
  ];
  fixedTreeNode: GroupTreeItem[] | NzTreeNode[] = [
    {
      title: 'All',
      key: 'all',
      weight: 0,
      parentID: '0',
      isLeaf: true,
      isFixed: true,
    },
  ];
  selectGroup: ExtensionGroupType | string = ExtensionGroupType.all;

  constructor(
    public extensionService: ExtensionService,
    private router: Router,
    public electron: ElectronService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}
  clickGroup(id) {
    this.selectGroup = id;
    this.router
      .navigate(['home/extension/list'], {
        queryParams: { type: id },
      })
      .finally();
  }
  ngOnInit(): void {
    this.watchRouterChange();
    this.setSelectedKeys();
  }

  onSeachChange(keyword) {
    this.messageService.send({ type: 'searchPluginByKeyword', data: keyword });
  }

  private watchRouterChange() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.setSelectedKeys();
    });
  }

  /**
   * Group tree item click.
   *
   * @param event
   */
  clickTreeItem(event: NzFormatEmitEvent): void {
    const eventName = event.node?.origin.isFixed ? 'clickFixedItem' : 'clickItem';

    switch (eventName) {
      case 'clickFixedItem': {
        this.clickGroup(event.node.key);
        break;
      }
      case 'clickItem': {
        this.clickGroup(event.node.key);
        break;
      }
    }
  }

  private setSelectedKeys() {
    if (this.route.snapshot.queryParams.type) {
      this.nzSelectedKeys = [this.route.snapshot.queryParams.type];
    } else {
      this.nzSelectedKeys = [this.fixedTreeNode[0].key];
    }
  }
}
