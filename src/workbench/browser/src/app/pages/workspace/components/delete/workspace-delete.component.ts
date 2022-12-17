import { Component, Input } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { RemoteService } from '../../../../shared/services/storage/remote.service';
import { EffectService } from '../../../../shared/store/effect.service';
import { StoreService } from '../../../../shared/store/state.service';

@Component({
  selector: 'eo-workspace-delete',
  template: `<p
      >Delete Workspace <b>{{ model?.title }}</b> will clean all the data，this action can not be recovered！</p
    >
    <button
      nz-popconfirm
      i18n-nzPopconfirmTitle
      nzPopconfirmTitle="Are you sure delete this workspace?"
      class="mt-[15px]"
      eo-ng-button
      nzDanger
      i18n-nzOkText
      [nzOkDanger]="true"
      nzOkText="Delete"
      (nzOnConfirm)="delete()"
      type="submit"
      >Delete Workspace</button
    >`
})
export class WorkspaceDeleteComponent {
  @Input() model: API.Workspace;
  constructor(
    private api: RemoteService,
    private message: EoNgFeedbackMessageService,
    private store: StoreService,
    private effect: EffectService,
    private modalRef: NzModalRef
  ) {}
  async delete() {
    const [data, err]: any = await this.api.api_workspaceDelete({
      workspaceID: this.model.id
    });
    if (err) {
      this.message.error($localize`Delete failed !`);
      return;
    }
    this.message.success($localize`Delete success !`);
    if (this.store.getCurrentWorkspaceID === this.model.id) {
      await this.effect.changeWorkspace(this.store.getLocalWorkspace);
    } else {
      this.modalRef.close();
    }
    this.store.setWorkspaceList(this.store.getWorkspaceList.filter(item => item.id !== this.model.id));
  }
}
