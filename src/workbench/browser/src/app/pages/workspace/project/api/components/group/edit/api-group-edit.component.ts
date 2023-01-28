import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { GroupApiDataModel, GroupTreeItem } from '../../../../../../../shared/models';

@Component({
  selector: 'pc-api-group-edit',
  templateUrl: './api-group-edit.component.html',
  styleUrls: ['./api-group-edit.component.scss']
})
export class ApiGroupEditComponent implements OnInit {
  @Input() group: Group;
  @Input() action?: string;
  @Input() treeItems?: any;

  validateForm!: FormGroup;
  isDelete: boolean;

  constructor(private fb: FormBuilder, private modalRef: NzModalRef, private storage: StorageService, private effect: EffectService) {}

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
      if (this.group.id) {
        this.update();
      } else {
        this.create();
      }
    }
  }

  async create() {
    await this.effect.createGroup([this.group]);
    this.modalRef.destroy();
  }

  async update() {
    await this.effect.updateGroup(this.group);
    this.modalRef.destroy();
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
    this.effect.deleteGroup(this.group);
    this.modalRef.destroy();
  }
}
