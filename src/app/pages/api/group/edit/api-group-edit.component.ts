import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../../../../shared/services/group/group.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { GroupService } from '../../../../shared/services/group/group.service';

@Component({
  selector: 'eo-api-group-edit',
  templateUrl: './api-group-edit.component.html',
  styleUrls: ['./api-group-edit.component.scss']
})
export class ApiGroupEditComponent implements OnInit {
  @Input() group: Group;
  @Input() action?: string;

  validateForm!: FormGroup;
  showLoading: boolean = false;
  isDelete: boolean;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private groupService: GroupService,
  ) { }

  ngOnInit(): void {
    this.isDelete = this.action === 'delete';
    if (!this.isDelete) {
      const controls = {name: [null, [Validators.required]]};
      this.validateForm = this.fb.group(controls);
    }
  }

  close(): void {
    this.modalRef.destroy();
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
    this.showLoading = true;
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
    this.groupService.create(this.group).subscribe((data: Group) => {
      this.showLoading = false;
      this.modalRef.destroy({type: 'createGroup', data: {group: data}});
    }, error => {
      this.showLoading = false;
      console.log(error);
    });
  }

  update(): void {
    this.groupService.update(this.group, this.group.uuid).subscribe((data: Group) => {
      this.showLoading = false;
      this.modalRef.destroy({type: 'updateGroup', data: {group: data}});
    }, error => {
      this.showLoading = false;
      console.log(error);
    });
  }

  delete(): void {
    this.groupService.remove(this.group.uuid).subscribe(data => {
      this.showLoading = false;
      this.modalRef.destroy({type: 'deleteGroup', data: {group: this.group}});
    }, error => {
      this.showLoading = false;
      console.log(error);
    });
  }

}
