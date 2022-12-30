import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { GroupApiDataModel, GroupTreeItem } from '../../../../../../../shared/models';
import { MessageService } from '../../../../../../../shared/services/message';
import { Group, StorageRes, StorageResStatus } from '../../../../../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-group-edit',
  templateUrl: './api-group-edit.component.html',
  styleUrls: ['./api-group-edit.component.scss']
})
export class ApiGroupEditComponent implements OnInit {
  @Input() group: Group;
  @Input() action?: string;
  @Input() treeItems?: any;

  validateForm!: FormGroup;
  isDelete: boolean;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private modalRef: NzModalRef,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.isDelete = this.action === 'delete';
    if (!this.isDelete) {
      const controls = { name: [null, [Validators.required]] };
      this.validateForm = this.fb.group(controls);
    }
  }

  submit(): void {
    if (!this.isDelete) {
      for (const i in this.validateForm.controls) {
        if (this.validateForm.controls.hasOwnProperty(i)) {
          this.validateForm.controls[i].markAsDirty();
          this.validateForm.controls[i].updateValueAndValidity();
        }
      }
      if (this.validateForm.status === 'INVALID') {
        return;
      }
    }
    this.save();
  }

  save(): void {
    if (this.isDelete) {
      this.delete();
    } else {
      if (this.group.uuid) {
        this.update();
      } else {
        this.create();
      }
    }
  }

  create(): void {
    this.storage.run('groupCreate', [this.group], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.modalRef.destroy();
        this.messageService.send({ type: 'updateGroupSuccess', data: { group: result.data } });
      } else {
        console.error(result.data);
      }
    });
  }

  update(): void {
    this.storage.run('groupUpdate', [this.group, this.group.uuid], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.modalRef.destroy();
        this.messageService.send({ type: 'updateGroupSuccess', data: { group: result.data } });
      } else {
        console.error(result.data);
      }
    });
  }

  /**
   * Get all child items belong to parentID
   *
   * @param list
   * @param tree
   * @param parentID
   */
  getChildrenFromTree(list: GroupTreeItem[], tree: GroupApiDataModel, parentID: string): void {
    list.forEach(item => {
      if (item.parentID === parentID) {
        if (!item.isLeaf) {
          tree.group.push(Number(item.key.replace('group-', '')));
          this.getChildrenFromTree(list, tree, item.key);
        } else {
          tree.api.push(Number(item.key));
        }
      }
    });
  }
  /**
   * Delete all tree items
   */
  delete(): void {
    const data: GroupApiDataModel = { group: [this.group.uuid], api: [] };
    this.getChildrenFromTree(this.treeItems, data, `group-${this.group.uuid}`);
    this.modalRef.destroy();
    this.storage.run('groupBulkRemove', [data.group], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        //delete group api
        if (data.api.length > 0) {
          this.messageService.send({ type: 'deleteApiSuccess', data: { uuids: data.api } });
        } else {
          this.messageService.send({ type: 'updateGroupSuccess', data: {} });
        }
      }
    });
  }
}
