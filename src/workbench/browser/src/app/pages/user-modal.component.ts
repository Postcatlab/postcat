import { ViewChild, ElementRef, Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { interval, Subject } from 'rxjs';
import { distinct, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'eo-user-modal',
  template: ` <nz-modal
      [nzFooter]="modalSyncFooter"
      [(nzVisible)]="isSyncModalVisible"
      (nzOnCancel)="handleSyncModalCancel()"
      (nzAfterClose)="e7odmm4Callback()"
      nzTitle="Do you want to upload local data to the cloud ?"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <span i18n> After confirmation, the system will create a cloud space to upload the local data to the cloud. </span>
        <eo-ng-feedback-alert
          nzType="warning"
          nzMessage="Subsequent local space and cloud space are no longer synchronized"
          i18n-nzMessage
          nzShowIcon
        ></eo-ng-feedback-alert>
      </ng-container>
      <ng-template #modalSyncFooter>
        <button eo-ng-button [nzLoading]="isSyncCancelBtnLoading" class="" nzType="default" (click)="btnsgs0ckCallback()" i18n>
          Cancel
        </button>
        <button eo-ng-button [nzLoading]="isSyncSyncBtnLoading" class="" nzType="primary" (click)="btnsf8zsrCallback()" i18n> Sync </button>
      </ng-template>
    </nz-modal>
    <nz-modal
      [nzFooter]="modalCheckConnectFooter"
      [(nzVisible)]="isCheckConnectModalVisible"
      (nzOnCancel)="handleCheckConnectModalCancel()"
      (nzAfterClose)="e4pgjfkCallback()"
      nzTitle="Check your connection"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <span i18n> Can't connect right now, click to retry or </span>
        <span style="color: #1890ff" class="cursor-pointer" (click)="textiqd22iCallback()" i18n> config in the configuration </span>
      </ng-container>
      <ng-template #modalCheckConnectFooter>
        <button eo-ng-button [nzLoading]="isCheckConnectCancelBtnLoading" class="" nzType="default" (click)="btnzls4ymCallback()" i18n>
          Cancel
        </button>
        <button eo-ng-button [nzLoading]="isCheckConnectRetryBtnLoading" class="" nzType="primary" (click)="btn0mu0b2Callback()" i18n>
          Retry
        </button>
      </ng-template>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [nzWidth]="400"
      [(nzVisible)]="isLoginModalVisible"
      (nzOnCancel)="handleLoginModalCancel()"
      (nzAfterClose)="euu4ezrCallback()"
      nzTitle="Sign In/Up"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <section class="my-3">
          <form nz-form [formGroup]="validateLoginForm" nzLayout="horizontal">
            <nz-form-item>
              <nz-form-control nzErrorTip="Please input your email or phone;">
                <input
                  type="text"
                  #usernameLoginRef
                  eo-ng-input
                  formControlName="username"
                  placeholder="Enter Email/Phone/Username"
                  i18n-placeholder
                />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control [nzErrorTip]="passwordErrorTpl">
                <input type="password" eo-ng-input formControlName="password" placeholder="Enter password" i18n-placeholder />
                <ng-template #passwordErrorTpl let-control>
                  <ng-container *ngIf="control.hasError('required')" i18n> Please input your password; </ng-container>

                  <ng-container *ngIf="control.hasError('minlength')" i18n> Min length is 6; </ng-container>
                </ng-template>
              </nz-form-control>
            </nz-form-item>

            <section class="">
              <button
                eo-ng-button
                [nzLoading]="isLoginBtnBtnLoading"
                type="submit"
                class="h-10 mt-2"
                nzType="primary"
                nzBlock
                (click)="btnvz94ljCallback()"
                i18n
              >
                Sign In/Up
              </button>
            </section>
          </form>
        </section>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isOpenSettingModalVisible"
      (nzOnCancel)="handleOpenSettingModalCancel()"
      (nzAfterClose)="e95oi5lCallback()"
      nzTitle="Open setting"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <span i18n> If you want to collaborate, please </span>
        <span style="color: #1890ff" class="cursor-pointer" (click)="textqdb64pCallback()" i18n> open the settings </span>
        <span i18n> and fill in the configuration </span>
      </ng-container>
    </nz-modal>
    <nz-modal
      [nzFooter]="null"
      [(nzVisible)]="isAddWorkspaceModalVisible"
      (nzOnCancel)="handleAddWorkspaceModalCancel()"
      (nzAfterClose)="ebdsz2aCallback()"
      nzTitle="Add Workspace"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <form nz-form [formGroup]="validateWorkspaceNameForm" nzLayout="horizontal">
          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your new work name;">
              <input
                type="text"
                #newWorkNameWorkspaceNameRef
                eo-ng-input
                formControlName="newWorkName"
                placeholder="Workspace Name"
                i18n-placeholder
              />
            </nz-form-control>
          </nz-form-item>

          <section class="flex justify-end">
            <button
              eo-ng-button
              [nzLoading]="isCancelBtnLoading"
              type="button"
              class="mr-3"
              nzType="default"
              (click)="btn66ztjiCallback()"
              i18n
            >
              Cancel
            </button>
            <button eo-ng-button [nzLoading]="isSaveBtnLoading" type="submit" class="" nzType="primary" (click)="btnd4wbcjCallback()" i18n>
              Save
            </button>
          </section>
        </form>
      </ng-container>
    </nz-modal>`
})
export class UserModalComponent implements OnInit, OnDestroy {
  isSyncModalVisible;
  isSyncCancelBtnLoading;
  isSyncSyncBtnLoading;
  isCheckConnectModalVisible;
  isCheckConnectCancelBtnLoading;
  isCheckConnectRetryBtnLoading;
  isLoginModalVisible;
  validateLoginForm;
  @ViewChild('usernameLoginRef') usernameLoginRef: ElementRef<HTMLInputElement>;
  isLoginBtnBtnLoading;
  isOpenSettingModalVisible;
  isAddWorkspaceModalVisible;
  validateWorkspaceNameForm;
  @ViewChild('newWorkNameWorkspaceNameRef')
  newWorkNameWorkspaceNameRef: ElementRef<HTMLInputElement>;
  isCancelBtnLoading;
  isSaveBtnLoading;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public store: StoreService,
    public message: MessageService,
    public api: RemoteService,
    public eMessage: EoNgFeedbackMessageService,
    public effect: EffectService,
    public dataSource: DataSourceService,
    public modal: NzModalService,
    public fb: UntypedFormBuilder,
    private web: WebService
  ) {
    this.isSyncModalVisible = false;
    this.isSyncCancelBtnLoading = false;
    this.isSyncSyncBtnLoading = false;
    this.isCheckConnectModalVisible = false;
    this.isCheckConnectCancelBtnLoading = false;
    this.isCheckConnectRetryBtnLoading = false;
    this.isLoginModalVisible = false;
    this.validateLoginForm = UntypedFormGroup;
    this.isLoginBtnBtnLoading = false;
    this.isOpenSettingModalVisible = false;
    this.isAddWorkspaceModalVisible = false;
    this.validateWorkspaceNameForm = UntypedFormGroup;
    this.isCancelBtnLoading = false;
    this.isSaveBtnLoading = false;
  }
  async ngOnInit(): Promise<void> {
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .pipe(takeUntil(this.destroy$))
      .subscribe(async ({ type, data }) => {
        if (type === 'login') {
          // * 唤起弹窗
          this.isLoginModalVisible = true;
          {
            {
              {
                // * auto focus
                setTimeout(() => {
                  this.usernameLoginRef?.nativeElement.focus();
                }, 300);
              }
            }
          }

          return;
        }

        if (type === 'clear-user') {
          this.store.clearAuth();
          this.store.setUserProfile({
            id: -1,
            password: '',
            username: '',
            workspaces: []
          });
          return;
        }

        if (type === 'http-401') {
          if (this.store.isLocal) {
            return;
          }

          // * 唤起弹窗
          this.isLoginModalVisible = true;
          {
            {
              {
                // * auto focus
                setTimeout(() => {
                  this.usernameLoginRef?.nativeElement.focus();
                }, 300);
              }
            }
          }

          return;
        }

        if (type === 'logOut') {
          this.store.setUserProfile({
            id: -1,
            password: '',
            username: '',
            workspaces: []
          });
          this.store.setWorkspaceList([]);
          this.eMessage.success($localize`Successfully logged out !`);
          const refreshToken = this.store.getLoginInfo.refreshToken;
          this.store.clearAuth();
          {
            const [data, err]: any = await this.api.api_authLogout({
              refreshToken
            });
            if (err) {
              if (err.status === 401) {
                this.message.send({ type: 'clear-user', data: {} });
                if (this.store.isLogin) {
                  return;
                }
                this.message.send({ type: 'http-401', data: {} });
              }
              return;
            }
          }
          return;
        }

        if (type === 'ping-fail') {
          this.eMessage.error($localize`Connect failed`);
          // * 唤起弹窗
          this.isCheckConnectModalVisible = true;

          return;
        }

        if (type === 'ping-success') {
          this.eMessage.success($localize`Connect success`);
          return;
        }

        if (type === 'need-config-remote') {
          // * 唤起弹窗
          this.isOpenSettingModalVisible = true;

          return;
        }

        if (type === 'addWorkspace') {
          // * 唤起弹窗
          this.isAddWorkspaceModalVisible = true;
          {
            {
              // * auto focus
              setTimeout(() => {
                this.newWorkNameWorkspaceNameRef?.nativeElement.focus();
              }, 300);
            }
          }

          return;
        }

        if (type === 'retry') {
          // * 唤起弹窗
          this.isCheckConnectModalVisible = true;

          return;
        }
      });

    // * Init Login form
    this.validateLoginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });

    // * Init WorkspaceName form
    this.validateWorkspaceNameForm = this.fb.group({
      newWorkName: [null, [Validators.required]]
    });

    if (this.store.isShare) {
      return;
    }

    const url = this.dataSource.remoteServerUrl;

    if (url === '') {
      // * 唤起弹窗
      // this.isOpenSettingModalVisible = true;

      return;
    }

    const { id: currentWorkspaceID } = this.store.getCurrentWorkspace;
    if (currentWorkspaceID === -1) {
      // * local workspace, then return
      return;
    }
    const status = await this.dataSource.pingCloudServerUrl();

    if (!status) {
      // * 唤起弹窗
      if (this.web.isWeb) {
        return;
      }
      this.isCheckConnectModalVisible = true;

      return;
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  handleSyncModalCancel(): void {
    // * 关闭弹窗
    this.isSyncModalVisible = false;
  }
  async e7odmm4Callback() {
    // * nzAfterClose event callback
  }
  async btnsgs0ckCallback() {
    // * click event callback
    this.isSyncCancelBtnLoading = true;
    const btnSyncCancelRunning = async () => {
      // * 关闭弹窗
      this.isSyncModalVisible = false;
    };
    await btnSyncCancelRunning();
    this.isSyncCancelBtnLoading = false;
  }
  async btnsf8zsrCallback() {
    // * click event callback
    this.isSyncSyncBtnLoading = true;
    const btnSyncSyncRunning = async () => {
      const eData = await this.effect.exportLocalProjectData();

      const [data, err]: any = await this.api.api_workspaceUpload(eData);
      if (err) {
        if (err.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.store.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }
      const { workspace } = data;
      this.store.setWorkspaceList([workspace, ...this.store.getWorkspaceList]);
      this.effect.updateWorkspace(workspace);

      // * 关闭弹窗
      this.isSyncModalVisible = false;
    };
    await btnSyncSyncRunning();
    this.isSyncSyncBtnLoading = false;
  }
  handleCheckConnectModalCancel(): void {
    // * 关闭弹窗
    this.isCheckConnectModalVisible = false;
  }
  async e4pgjfkCallback() {
    // * nzAfterClose event callback
  }
  async btnzls4ymCallback() {
    // * click event callback
    this.isCheckConnectCancelBtnLoading = true;
    const btnCheckConnectCancelRunning = async () => {
      // * 关闭弹窗
      this.isCheckConnectModalVisible = false;
    };
    await btnCheckConnectCancelRunning();
    this.isCheckConnectCancelBtnLoading = false;
  }
  async btn0mu0b2Callback() {
    // * click event callback
    this.isCheckConnectRetryBtnLoading = true;
    const btnCheckConnectRetryRunning = async () => {
      this.dataSource.checkRemoteAndTipModal();

      // * 关闭弹窗
      this.isCheckConnectModalVisible = false;
    };
    await btnCheckConnectRetryRunning();
    this.isCheckConnectRetryBtnLoading = false;
  }
  async textiqd22iCallback() {
    // * click event callback
    this.message.send({ type: 'open-setting', data: {} });

    // * 关闭弹窗
    this.isCheckConnectModalVisible = false;
    this.isOpenSettingModalVisible = false;
  }
  handleLoginModalCancel(): void {
    // * 关闭弹窗
    this.isLoginModalVisible = false;
  }
  async euu4ezrCallback() {
    // * nzAfterClose event callback
    {
      // * auto clear form
      this.validateLoginForm.reset();
    }
  }
  async btnvz94ljCallback() {
    // * click event callback
    this.isLoginBtnBtnLoading = true;
    const btnLoginBtnRunning = async () => {
      const isOk = this.validateLoginForm.valid;

      if (!isOk) {
        this.eMessage.error($localize`Please check you username or password`);
        return;
      }
      // * get login form values
      const formData = this.validateLoginForm.value;
      const [data, err]: any = await this.api.api_authLogin(formData);
      if (err) {
        this.eMessage.error($localize`Please check the account/password, the account must be a mobile phone number or email !`);
        if ([401, 403].includes(err.status)) {
          this.isLoginBtnBtnLoading = false;
          this.message.send({ type: 'clear-user', data: {} });
          if (this.store.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }
      this.store.setLoginInfo(data);

      // * 关闭弹窗
      this.isLoginModalVisible = false;

      this.message.send({ type: 'update-share-link', data: {} });
      {
        const [data, err]: any = await this.api.api_userReadProfile({});
        if (err) {
          if (err.status === 401) {
            this.message.send({ type: 'clear-user', data: {} });
            if (this.store.isLogin) {
              return;
            }
            this.message.send({ type: 'http-401', data: {} });
          }
          return;
        }
        this.store.setUserProfile(data);
      }
      this.effect.updateWorkspaceList();

      if (!data.isFirstLogin) {
        return;
      }

      // * 唤起弹窗
      this.isSyncModalVisible = true;
    };
    await btnLoginBtnRunning();
    this.isLoginBtnBtnLoading = false;
  }
  handleOpenSettingModalCancel(): void {
    // * 关闭弹窗
    this.isOpenSettingModalVisible = false;
  }
  async e95oi5lCallback() {
    // * nzAfterClose event callback
  }
  async textqdb64pCallback() {
    // * click event callback
    this.message.send({ type: 'open-setting', data: {} });

    // * 关闭弹窗
    this.isOpenSettingModalVisible = false;
  }
  handleAddWorkspaceModalCancel(): void {
    // * 关闭弹窗
    this.isAddWorkspaceModalVisible = false;
  }
  async ebdsz2aCallback() {
    // * nzAfterClose event callback
    {
      // * auto clear form
      this.validateWorkspaceNameForm.reset();
    }
  }
  async btn66ztjiCallback() {
    // * click event callback
    this.isCancelBtnLoading = true;
    const btnCancelRunning = async () => {
      // * 关闭弹窗
      this.isAddWorkspaceModalVisible = false;
    };
    await btnCancelRunning();
    this.isCancelBtnLoading = false;
  }
  async btnd4wbcjCallback() {
    // * click event callback
    this.isSaveBtnLoading = true;
    const btnSaveRunning = async () => {
      const { newWorkName: title } = this.validateWorkspaceNameForm.value;
      const [data, err]: any = await this.api.api_workspaceCreate({ title });
      if (err) {
        this.eMessage.error($localize`Add workspace Failed !`);
        if (err.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.store.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }
      this.eMessage.success($localize`Create new workspace successfully !`);

      // * 关闭弹窗
      this.isAddWorkspaceModalVisible = false;
      this.message.send({ type: 'update-share-link', data: {} });
      {
        this.effect.updateWorkspaceList();
        this.effect.updateWorkspace(data);
      }
    };
    await btnSaveRunning();
    this.isSaveBtnLoading = false;
  }
}
