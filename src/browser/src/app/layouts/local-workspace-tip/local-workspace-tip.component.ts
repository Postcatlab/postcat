import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun } from 'mobx';
import { MessageService } from 'pc/browser/src/app/services/message';
import { IS_SHOW_REMOTE_SERVER_NOTIFICATION } from 'pc/browser/src/app/shared/models/storageKeys.constant';
import { EffectService } from 'pc/browser/src/app/store/effect.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';

import { StorageUtil } from '../../shared/utils/storage/storage.utils';

@Component({
  selector: 'eo-local-workspace-tip',
  template: `
    <eo-ng-feedback-alert
      *ngIf="isShow"
      class="remote-notification"
      nzType="warning"
      [nzMessage]="templateRefMsg"
      nzCloseable
      (nzOnClose)="closeNotification()"
    ></eo-ng-feedback-alert>
    <ng-template #templateRefMsg>
      <eo-iconpark-icon name="link-cloud-faild" class="text-[13px] mr-[5px]"></eo-iconpark-icon>
      <span i18n>The current data is stored locally,If you want to collaborate,Please</span>
      <button class="ml-[5px]" eo-ng-button nzType="default" nzSize="small" (click)="switchToTheCloud()" i18n>
        switch to the cloud workspace
      </button></ng-template
    >
  `,
  styleUrls: ['./local-workspace-tip.component.scss']
})
export class LocalWorkspaceTipComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() readonly isShowChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  manualClose = StorageUtil.get(IS_SHOW_REMOTE_SERVER_NOTIFICATION) === 'false';
  constructor(
    private eoMessage: EoNgFeedbackMessageService,
    private message: MessageService,
    private store: StoreService,
    private effect: EffectService
  ) {}
  ngOnInit(): void {
    autorun(() => {
      this.updateIsShow();
    });
  }
  updateIsShow() {
    const status = this.store.isLocal && this.store.isLogin && !this.manualClose;
    Promise.resolve().then(() => {
      this.isShowChange.emit(status);
    });
  }
  switchToTheCloud = () => {
    const workspaces = this.store.getWorkspaceList;
    if (workspaces.length === 1) {
      // * only local workspace
      this.eoMessage.warning($localize`You don't have cloud space yet, please new one`);
      this.message.send({ type: 'addWorkspace', data: {} });
      return;
    }
    this.effect.switchWorkspace(workspaces.find(val => !val.isLocal)?.workSpaceUuid);
  };

  closeNotification() {
    this.manualClose = true;
    StorageUtil.set(IS_SHOW_REMOTE_SERVER_NOTIFICATION, 'false', 60 * 60 * 24 * 15);
    this.updateIsShow();
  }
}
