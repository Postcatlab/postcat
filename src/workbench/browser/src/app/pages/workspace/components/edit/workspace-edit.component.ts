import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { autorun } from 'mobx';

import { ModalService } from '../../../../shared/services/modal.service';
import { EffectService } from '../../../../shared/store/effect.service';
import { StoreService } from '../../../../shared/store/state.service';

@Component({
  selector: 'eo-workspace-setting',
  template: `<form *ngIf="validateForm" auto-focus-form nz-form [formGroup]="validateForm" nzLayout="vertical">
      <nz-form-item>
        <nz-form-label i18n nzRequired nzFor="title">Workspace Name</nz-form-label>
        <nz-form-control nzErrorTip="Please input your new work name">
          <input type="text" eo-ng-input id="title" formControlName="title" placeholder="Workspace Name" i18n-placeholder />
        </nz-form-control>
      </nz-form-item>
      <button eo-ng-button [nzLoading]="isSaveBtnLoading" type="submit" nzType="primary" (click)="save($event)" i18n> Save </button>
    </form>
    <div class="my-2">
      <nz-divider></nz-divider>
    </div>
    <div class="mb-2 font-bold" i18n>Actions</div>
    <div class="border rounded">
      <nz-list nzItemLayout="horizontal">
        <nz-list-item *ngFor="let item of overviewList">
          <div class="flex items-center justify-between w-full px-base">
            <b class="w-2/4">{{ item.title }}</b>
            <!-- <span class="w-6/12 text-tips">{{ item.desc }}</span> -->
            <button eo-ng-button nzType="default" [nzDanger]="item.type === 'delete'" (click)="clickItem($event, item)">{{
              item.title
            }}</button>
          </div>
        </nz-list-item>
        <nz-list-empty *ngIf="overviewList.length === 0"></nz-list-empty>
      </nz-list>
    </div>`
})
export class WorkspaceSettingComponent {
  validateForm: UntypedFormGroup;
  isSaveBtnLoading = false;
  overviewList = [
    {
      title: $localize`Delete Workspace`,
      icon: 'play-cycle',
      desc: '',
      type: 'delete'
    }
  ];
  constructor(
    private fb: FormBuilder,
    private message: EoNgFeedbackMessageService,
    private api: ApiService,
    private store: StoreService,
    private modal: ModalService,
    private effect: EffectService
  ) {
    autorun(() => {
      if (this.store.getCurrentWorkspace) {
        this.initForm();
      }
    });
  }

  initForm() {
    this.validateForm = this.fb.group({
      title: [this.store.getCurrentWorkspace?.title, [Validators.required]]
    });
  }
  clickItem(event, inParams) {
    switch (inParams.type) {
      case 'delete': {
        this.delete();
        break;
      }
      default: {
        break;
      }
    }
  }

  delete() {
    const wid = this.store.getCurrentWorkspaceUuid;
    this.modal.confirm({
      nzTitle: $localize`Are you sure delete this workspace?`,
      nzOkText: $localize`Delete`,
      nzOkDanger: true,
      nzOnOk: async () => {
        const [data, err]: any = await this.api.api_workspaceDelete({
          workSpaceUuids: [wid]
        });
        if (err) {
          this.message.error($localize`Delete failed !`);
          return;
        }
        this.message.success($localize`Delete success !`);
        await this.effect.updateWorkspaceList();
        await this.effect.switchWorkspace(this.store.getLocalWorkspace.workSpaceUuid);
      }
    });
  }
  async save($event) {
    $event.stopPropagation();
    if (!this.validateForm.valid) {
      return;
    }
    this.isSaveBtnLoading = true;
    const { title } = this.validateForm.value;
    const [data, err]: any = await this.api.api_workspaceUpdate({
      title
    });
    if (err) {
      this.message.error($localize`Edit workspace failed`);
      return;
    }
    this.message.success($localize`Edit workspace successfully !`);

    //Rest Current Workspace
    await this.effect.updateWorkspaceList();
    this.store.setCurrentWorkspace(this.store.getCurrentWorkspace);

    this.isSaveBtnLoading = false;
  }
}
