import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiStoreService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-state.service';
import { MessageService } from 'pc/browser/src/app/services/message';
import { Group } from 'pc/browser/src/app/services/storage/db/models';
import { PCTree } from 'pc/browser/src/app/shared/utils/tree/tree.utils';

import { ApiEffectService } from '../../../store/api-effect.service';
import { GroupAction } from '../tree/api-group-tree.component';

@Component({
  selector: 'pc-api-group-edit',
  templateUrl: './api-group-edit.component.html',
  styleUrls: ['./api-group-edit.component.scss']
})
export class ApiGroupEditComponent implements OnInit {
  @Input() group: Group;
  @Input() action?: GroupAction;

  validateForm!: FormGroup;
  isDelete: boolean;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private effect: ApiEffectService,
    private messageService: MessageService,
    private store: ApiStoreService
  ) {}

  ngOnInit(): void {
    this.isDelete = this.action === 'delete';
    if (!this.isDelete) {
      const controls = { name: [null, [Validators.required]] };
      this.validateForm = this.fb.group(controls);
    }
  }

  getSubGroupIds(groups: Group[] = [], defaultIds = []) {
    return groups.reduce((prev, curr) => {
      if (curr.children?.length) {
        this.getSubGroupIds(curr.children, prev);
      }
      prev.push(curr.id);
      return prev;
    }, defaultIds);
  }

  async submit(): Promise<[any, any]> {
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
    let result;
    switch (this.action) {
      case 'delete': {
        const groupObj = new PCTree(this.store.getGroupTree);
        const group = groupObj.findGroupByID(this.group.id);
        const uuids = this.getSubGroupIds([group]);
        result = await this.effect.deleteGroup(this.group);
        this.messageService.send({ type: 'deleteGroupSuccess', data: { uuids } });
        break;
      }
      case 'edit': {
        result = await this.effect.updateGroup(this.group);
        break;
      }
      case 'new': {
        result = await this.effect.createGroup([this.group]);
        break;
      }
    }
    this.modalRef.destroy();
    return result;
  }
}
