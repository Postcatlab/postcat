import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { IS_SHOW_REMOTE_SERVER_NOTIFICATION } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StorageUtil } from '../../utils/storage/Storage';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

@Component({
  selector: 'eo-local-workspace-tip',
  template: ` <div *ngIf="isShowNotification" class="remote-notification">
    <eo-iconpark-icon name="link-cloud-faild" class="text-[13px] mr-[5px]"></eo-iconpark-icon>
    <span i18n>The current data is stored locally,If you want to collaborate,Please</span>
    <button class="ml-[5px]" eo-ng-button nzType="default" nzSize="small" (click)="switchToTheCloud()" i18n>
      switch to the cloud workspace
    </button>
    <eo-iconpark-icon
      name="close"
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
    private eoMessage: EoNgFeedbackMessageService,
    private message: MessageService,
    private store: StoreService
  ) {}
  get isShowNotification() {
    const isShow =
      this.store.isLocal && this.store.isLogin && StorageUtil.get(IS_SHOW_REMOTE_SERVER_NOTIFICATION) !== 'false';
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
    if (this.store.getWorkspaceList[0].id === this.store.getLocalWorkspaceInfo.id) {
      this.eoMessage.warning($localize`You don't have cloud space yet, please create one`);
      this.message.send({ type: 'addWorkspace', data: {} });
      return;
    }
    this.store.setCurrentWorkspace(this.store.getWorkspaceList[0]);
  };

  closeNotification() {
    StorageUtil.set(IS_SHOW_REMOTE_SERVER_NOTIFICATION, 'false');
  }
}
