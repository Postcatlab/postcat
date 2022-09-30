import { Component, OnInit } from '@angular/core'

import { NzModalService } from 'ng-zorro-antd/modal'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms'

@Component({
  selector: 'eo-workspace',
  template: ` <section class="py-5 px-10">
    <h2 class="text-lg flex justify-between items-center">
      <span i18n>Workspace Operate</span>
    </h2>
    <section class="py-2"><eo-api-overview></eo-api-overview></section>
    <nz-divider></nz-divider>
    <h2 class="text-lg flex justify-between items-center">
      <span i18n>Edit Workspace</span>
    </h2>
    <form nz-form [formGroup]="validateWspNameForm" nzLayout="vertical">
      <nz-form-item>
        <nz-form-control nzErrorTip="Please input your name !">
          <nz-form-label [nzSpan]="12" i18n>Name</nz-form-label>
          <input
            type="text"
            nz-input
            formControlName="workspace"
            placeholder=""
            i18n-placeholder
            nzRequired
          />
        </nz-form-control>
      </nz-form-item>
    </form>
    <button
      nz-button
      class=""
      nzType="primary"
      (click)="btn5jkmmiCallback()"
      i18n
    >
      Save
    </button>
    <nz-divider></nz-divider>
    <h2 class="text-lg flex justify-between items-center">
      <span i18n>Delete Workspace</span>
    </h2>
    <div class="pb-4">
      <span i18n
        >After deleting a workspace, all data in the workspace will be
        permanently deleted.</span
      >
    </div>
    <button
      nz-button
      class=""
      nzType="primary"
      nzDanger
      (click)="btnru54qoCallback()"
      i18n
    >
      Delete
    </button>
  </section>`
})
export class WorkspaceComponent implements OnInit {
  validateWspNameForm
  constructor(public modal: NzModalService, public fb: UntypedFormBuilder) {
    this.validateWspNameForm = UntypedFormGroup
  }
  ngOnInit(): void {
    // * Init WspName form
    this.validateWspNameForm = this.fb.group({
      workspace: [null, [Validators.required]]
    })
  }
  async btn5jkmmiCallback() {
    // * click event callback
  }
  async btnru54qoCallback() {
    // * click event callback

    const confirm = () =>
      new Promise((resolve) => {
        this.modal.confirm({
          nzTitle: `Deletion Confirmation?`,
          nzContent: `Are you sure you want to delete the workspace ? 
You cannot restore it once deleted!`,
          nzOkDanger: true,
          nzOnOk: () => resolve(true),
          nzOnCancel: () => resolve(false)
        })
      })
    const isOk = await confirm()
    if (!isOk) {
      return
    }

    console.log('\u53D1\u9001\u8BF7\u6C42')
  }
}
