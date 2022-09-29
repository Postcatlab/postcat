import { Component, OnInit } from '@angular/core'

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms'

@Component({
  selector: 'eo-workspace',
  template: `<section class="py-5 px-10">
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
      (click)="btnv3v6i4Callback()"
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
      (click)="btn3g657qCallback()"
      i18n
    >
      Delete
    </button>
  </section>`
})
export class WorkspaceComponent implements OnInit {
  validateWspNameForm
  constructor(public fb: UntypedFormBuilder) {
    this.validateWspNameForm = UntypedFormGroup
  }
  ngOnInit(): void {
    // * Init WspName form
    this.validateWspNameForm = this.fb.group({
      workspace: [null, [Validators.required]]
    })
  }
  async btnv3v6i4Callback() {
    // * click event callback
  }
  async btn3g657qCallback() {
    // * click event callback
  }
}
