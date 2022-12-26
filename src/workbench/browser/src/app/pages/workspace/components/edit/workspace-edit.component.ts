import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { RemoteService } from '../../../../shared/services/storage/remote.service';
import { EffectService } from '../../../../shared/store/effect.service';
import { StoreService } from '../../../../shared/store/state.service';
import { eoDeepCopy } from '../../../../utils/index.utils';

@Component({
  selector: 'eo-workspace-edit',
  template: `<form auto-focus-form nz-form [formGroup]="validateForm" nzLayout="vertical">
    <nz-form-item>
      <nz-form-label i18n nzFor="title">Workspace Name</nz-form-label>
      <nz-form-control nzErrorTip="Please input your new work name">
        <input type="text" eo-ng-input id="title" formControlName="title" placeholder="Workspace Name" i18n-placeholder />
      </nz-form-control>
    </nz-form-item>
    <button eo-ng-button [nzLoading]="isSaveBtnLoading" type="submit" nzType="primary" (click)="save($event)" i18n> Save </button>
  </form>`
})
export class WorkspaceEditComponent implements OnChanges {
  validateForm: UntypedFormGroup;
  isSaveBtnLoading = false;
  constructor(
    private fb: FormBuilder,
    private message: EoNgFeedbackMessageService,
    private api: RemoteService,
    private store: StoreService
  ) {
    this.initForm();
  }

  ngOnChanges(): void {
    this.initForm();
  }
  initForm() {
    this.validateForm = this.fb.group({
      title: [this.store.getCurrentWorkspace?.title, [Validators.required]]
    });
  }
  async save($event) {
    $event.stopPropagation();
    if (!this.validateForm.valid) return;
    this.isSaveBtnLoading = true;
    const id = this.store.getCurrentWorkspaceID;
    const { title } = this.validateForm.value;
    const [data, err]: any = await this.api.api_workspaceEdit({
      workspaceID: id,
      title
    });
    if (err) {
      this.message.error($localize`Edit workspace failed`);
      return;
    }
    this.message.success($localize`Edit workspace successfully !`);
    this.store.updateWorkspace(eoDeepCopy(data));
    this.isSaveBtnLoading = false;
  }
}
