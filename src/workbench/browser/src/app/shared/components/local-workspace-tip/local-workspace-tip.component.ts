import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { IS_SHOW_REMOTE_SERVER_NOTIFICATION } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service';
import { StorageUtil } from '../../../utils/storage/Storage';

@Component({
  selector: 'eo-local-workspace-tip',
  template: ` <div *ngIf="isShowNotification" class="remote-notification">
    <eo-iconpark-icon name="link-cloud-faild" class="text-[13px] mr-[5px]"></eo-iconpark-icon>
    <span i18n>The current data is stored locally,If you want to collaborate,Please</span>
    <button class="ml-[5px]" nz-button nzType="default" nzSize="small" (click)="switchToTheCloud()" i18n>
      switch to the cloud workspace
    </button>
    <eo-iconpark-icon
      name="close-small"
      class="absolute right-[20px] cursor-pointer"
      (click)="closeNotification()"
    ></eo-iconpark-icon>
  </div>`,
  styleUrls: ['./local-workspace-tip.component.scss'],
})
export class LocalWorkspaceTipComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() isShowChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private eoMessage: EoMessageService,
    private message: MessageService,
    private workspace: WorkspaceService,
    private user: UserService
  ) {}
  get isShowNotification() {
    const isShow =
      this.workspace.isLocal && this.user.isLogin && StorageUtil.get(IS_SHOW_REMOTE_SERVER_NOTIFICATION) !== 'false';
    this.isShow !== isShow && this.setIsShow(isShow);
    return isShow;
  }
  setIsShow(status: boolean) {
    this.isShow = status;
    setTimeout(() => {
      this.isShowChange.emit(status);
    }, 0);
  }
  ngOnInit(): void {}

  switchToTheCloud = () => {
    if (this.workspace.workspaceList[0].id === this.workspace.localWorkspace.id) {
      this.eoMessage.warn($localize`You don't have cloud space yet, please create one`);
      this.message.send({ type: 'addWorkspace', data: {} });
      return;
    }
    this.workspace.setCurrentWorkspace(this.workspace.workspaceList[0]);
  };

  closeNotification() {
    StorageUtil.set(IS_SHOW_REMOTE_SERVER_NOTIFICATION, 'false');
  }
}
