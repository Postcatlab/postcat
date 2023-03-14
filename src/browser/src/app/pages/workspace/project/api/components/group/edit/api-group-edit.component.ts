import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Group } from 'pc/browser/src/app/services/storage/db/models';

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

  constructor(private fb: FormBuilder, private modalRef: NzModalRef, private effect: ApiEffectService) {}

  ngOnInit(): void {
    this.isDelete = this.action === 'delete';
    if (!this.isDelete) {
      const controls = { name: [null, [Validators.required]] };
      this.validateForm = this.fb.group(controls);
    }
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
        result = await this.effect.deleteGroup(this.group);
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
