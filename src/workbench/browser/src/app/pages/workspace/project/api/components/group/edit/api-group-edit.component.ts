import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { ApiEffectService } from '../../../service/store/api-effect.service';

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

  constructor(private fb: FormBuilder, private modalRef: NzModalRef, private effect: ApiEffectService) {}

  ngOnInit(): void {
    this.isDelete = this.action === 'delete';
    if (!this.isDelete) {
      const controls = { name: [null, [Validators.required]] };
      this.validateForm = this.fb.group(controls);
    }
  }

  submit(): Promise<void> {
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
    if (this.isDelete) {
      return this.delete();
    } else {
      if (this.group.id) {
        return this.update();
      } else {
        return this.create();
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
   * Delete all tree items
   */
  async delete() {
    await this.effect.deleteGroup(this.group);
    this.modalRef.destroy();
  }
}
