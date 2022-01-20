import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { GroupTreeItem, GroupApiDataModel } from '../../../../shared/models';
import { Group } from '../../../../shared/services/group/group.model';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';

import { ApiGroupEditComponent } from '../edit/api-group-edit.component';
import { Message } from '../../../../shared/services/message/message.model';

@Component({
  selector: 'eo-api-group-tree',
  templateUrl: './api-group-tree.component.html',
  styleUrls: ['./api-group-tree.component.scss'],
})
export class ApiGroupTreeComponent implements OnInit {
  @Input() treeNodes: Array<GroupTreeItem> | any;
  @Output() groupTreeEvent = new EventEmitter();
  @Output() updateGroupTreeEvent = new EventEmitter();
  /**
   * Expanded keys of tree.
   */
  expandedKeys: Array<string | number>;

  searchValue = '';
  constructor(private modalService: NzModalService) {}

  ngOnInit(): void {}
  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
    this.groupTreeEvent.emit(event);
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
      this.groupTreeEvent.emit(event);
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
          this.groupTreeEvent.emit({
            eventName: 'deleteGroup',
            node: group,
          });
        } else {
          this.groupTreeEvent.emit({
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
    this.updateGroupTreeEvent.emit(groupApiData);
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
  onClick(event: NzFormatEmitEvent) {
    event.event.stopPropagation();
    this.groupTreeEvent.emit(event);
  }
}
