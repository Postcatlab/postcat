import { Component, OnInit } from '@angular/core'

import { NzModalService } from 'ng-zorro-antd/modal'
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
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
      (click)="btngfbi7fCallback()"
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
      (click)="btntdldp7Callback()"
      i18n
    >
      Delete
    </button>
  </section>`
})
export class WorkspaceComponent implements OnInit {
  validateWspNameForm
  constructor(
    public modal: NzModalService,
    public workspace: WorkspaceService,
    public eMessage: EoMessageService,
    public api: RemoteService,
    public fb: UntypedFormBuilder
  ) {
    this.validateWspNameForm = UntypedFormGroup
  }
  async ngOnInit(): Promise<void> {
    // * Init WspName form
    this.validateWspNameForm = this.fb.group({
      workspace: [null, [Validators.required]]
    })

    const { title: currentWsp } = this.workspace.currentWorkspace

    // * get WspName form values
    this.validateWspNameForm.patchValue({
      workspace: currentWsp
    })
  }
  async btngfbi7fCallback() {
    // * click event callback
    const currentWsp = this.workspace.currentWorkspace
    const { workspace: title } = this.validateWspNameForm.value
    const [data, err]: any = await this.api.api_workspaceEdit({
      workspaceID: currentWsp,
      title
    })
    if (err) {
      return
    }

    this.eMessage.success(`Edit workspace name success !`)
  }
  async btntdldp7Callback() {
    // * click event callback

    const confirm = () =>
      new Promise((resolve) => {
        this.modal.confirm({
          nzTitle: `Deletion Confirmation?`,
          nzContent: `Are you sure you want to delete the workspace ? 
You cannot restore it once deleted!`,
          nzOkDanger: true,
          nzOkText: 'Delete',
          nzOnOk: () => resolve(true),
          nzOnCancel: () => resolve(false)
        })
      })
    const isOk = await confirm()
    if (!isOk) {
      return
    }

    const currentWsp = this.workspace.currentWorkspace
    const [data, err]: any = await this.api.api_workspaceDelete({
      workspaceID: currentWsp
    })
    if (err) {
      return
    }

    this.eMessage.success(`Delete success !`)
  }
}
