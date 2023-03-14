import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun } from 'mobx';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';

import { ModalService } from '../../../../services/modal.service';
import { EffectService } from '../../../../store/effect.service';
import { StoreService } from '../../../../store/state.service';

@Component({
  selector: 'eo-workspace-setting',
  template: ` <div class="flex justify-between">
      <form nz-form nzLayout="inline" auto-focus-form nz-form [formGroup]="validateForm" (ngSubmit)="save()">
        <nz-form-item>
          <nz-form-control
            [nzValidateStatus]="!validateForm || validateForm.value?.title ? '' : 'error'"
            i18n-nzErrorTip
            nzErrorTip="Please input your new workspace name"
          >
            <div class="flex items-center">
              <input
                *ngIf="isEdit"
                #inputRef
                type="text"
                eo-ng-input
                autofocus
                id="title"
                formControlName="title"
                placeholder="Workspace Name"
                i18n-placeholder
                (blur)="save()"
              />
              <ng-container *ngIf="!isEdit">
                <h4 nz-typography class="!mb-[0px]">{{ validateForm.value?.title }}</h4>
                <button eo-ng-button nzType="text" class="ml-[5px] cursor-pointer" (click)="startEdit()">
                  <eo-iconpark-icon name="edit"></eo-iconpark-icon>
                </button>
              </ng-container>
            </div>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>

    <div class="my-2">
      <nz-divider></nz-divider>
    </div>
    <div class="mb-2 font-bold" i18n>Actions</div>
    <div class="border-all rounded">
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
  @ViewChild('inputRef') inputRef: ElementRef<HTMLInputElement>;

  validateForm: UntypedFormGroup;
  isSaveBtnLoading = false;
  isEdit = false;
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

  startEdit() {
    this.isEdit = true;
    setTimeout(() => {
      this.inputRef.nativeElement.focus();
    });
  }

  async save() {
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
    this.isEdit = false;
  }
}
