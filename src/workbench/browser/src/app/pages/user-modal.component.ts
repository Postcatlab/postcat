import { ViewChild, ElementRef, Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { interval, Subject } from 'rxjs';
import { distinct, takeUntil } from 'rxjs/operators';

import { ModalService } from '../shared/services/modal.service';
import { StorageRes, StorageResStatus } from '../shared/services/storage/index.model';
import { StorageService } from '../shared/services/storage/storage.service';

@Component({
  selector: 'eo-user-modal',
  template: ` <nz-modal
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
          <form nz-form [formGroup]="validateLoginForm" nzLayout="vertical">
            <nz-form-item>
              <nz-form-label i18n nzFor="username">Email</nz-form-label>
              <nz-form-control i18n-nzErrorTip nzErrorTip="Please input your email">
                <input
                  type="text"
                  #usernameLoginRef
                  eo-ng-input
                  id="username"
                  formControlName="username"
                  placeholder="Enter Email"
                  i18n-placeholder
                />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label i18n nzFor="password">Password</nz-form-label>
              <nz-form-control [nzErrorTip]="passwordErrorTpl">
                <input type="password" eo-ng-input formControlName="password" id="password" placeholder="Enter password" i18n-placeholder />
                <ng-template #passwordErrorTpl let-control>
                  <ng-container *ngIf="control.hasError('required')" i18n> Please input your password </ng-container>

                  <ng-container *ngIf="control.hasError('minlength')" i18n> Min length is 6 </ng-container>
                </ng-template>
              </nz-form-control>
            </nz-form-item>

            <section class="">
              <button
                eo-ng-button
                [nzLoading]="isLoginBtnBtnLoading"
                [disabled]="!validateLoginForm.valid"
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
      [(nzVisible)]="isAddWorkspaceModalVisible"
      (nzOnCancel)="handleAddWorkspaceModalCancel()"
      (nzAfterClose)="ebdsz2aCallback()"
      nzTitle="Add Workspace"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <form nz-form [formGroup]="validateWorkspaceNameForm" nzLayout="vertical">
          <nz-form-item>
            <nz-form-label i18n nzFor="newWorkName">Workspace Name</nz-form-label>
            <nz-form-control nzErrorTip="Please input your new work name">
              <input
                type="text"
                #newWorkNameWorkspaceNameRef
                eo-ng-input
                id="newWorkName"
                formControlName="newWorkName"
                placeholder="Workspace Name"
                i18n-placeholder
              />
            </nz-form-control>
          </nz-form-item>
        </form>
      </ng-container>
      <div *nzModalFooter>
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
          Confirm
        </button>
      </div>
    </nz-modal>`
})
export class UserModalComponent implements OnInit, OnDestroy {
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
    public modal: ModalService,
    public fb: UntypedFormBuilder,
    private storage: StorageService,
    private router: Router,
    private web: WebService
  ) {
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
          // * auto focus
          setTimeout(() => {
            this.usernameLoginRef?.nativeElement.focus();
          }, 300);

          return;
        }

        if (type === 'server-fail') {
          if (this.store.isLocal) {
            return;
          }
          this.eMessage.error($localize`Oops, server fail`);
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

    if (this.store.getCurrentWorkspaceID === -1) {
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
  async e7odmm4Callback() {
    // * nzAfterClose event callback
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
    this.message.send({
      type: 'open-setting',
      data: {
        module: 'data-storage'
      }
    });

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
      this.store.clearAuth();
      // * get login form values
      const formData = this.validateLoginForm.value;
      const [data, err]: any = await this.api.api_authLogin(formData);
      if (err) {
        this.eMessage.error($localize`Please check the account/password, the account must be a email !`);
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

      if (!data.isFirstLogin) {
        return;
      }
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
    this.message.send({
      type: 'open-setting',
      data: {
        module: 'data-storage'
      }
    });

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
      const localProjects = this.store.getProjectList;
      const [data, err]: any = await this.api.api_workspaceCreate({ title });
      if (err) {
        this.eMessage.error($localize`New workspace Failed !`);
        if (err.status === 401) {
          this.message.send({ type: 'clear-user', data: {} });
          if (this.store.isLogin) {
            return;
          }
          this.message.send({ type: 'http-401', data: {} });
        }
        return;
      }
      this.eMessage.success($localize`New workspace successfully !`);
      // * 关闭弹窗
      this.isAddWorkspaceModalVisible = false;
      this.message.send({ type: 'update-share-link', data: {} });
      {
        await this.effect.updateWorkspaces();
        await this.effect.changeWorkspace(data.id);
      }
      if (this.store.getWorkspaceList.length === 2) {
        const modal = this.modal.create({
          stayWhenRouterChange: true,
          nzTitle: $localize`Upload local data to the cloud`,
          nzContent: $localize`You have created a cloud workspace, do you need to upload the local data to the new workspace to facilitate team collaboration?<br>
          If you do not upload it now, you can also manually export the project data and import it into a new workspace later.`,
          nzFooter: [
            {
              label: $localize`Cancel`,
              onClick: () => {
                modal.destroy();
              }
            },
            {
              label: $localize`Upload`,
              type: 'primary',
              onClick: () => {
                return new Promise(resolve => {
                  const importProject = (project, index) => {
                    this.storage.run(
                      'projectCreate',
                      [
                        this.store.getCurrentWorkspace.id,
                        {
                          name: project.name
                        }
                      ],
                      (result: StorageRes) => {
                        if (result.status === StorageResStatus.success) {
                          this.effect.exportLocalProjectData(project.uuid).then(data => {
                            console.log(data, project.uuid);
                            this.storage.run('projectImport', [result.data?.uuid, data], (result: StorageRes) => {
                              if (result.status === StorageResStatus.success) {
                                if (index === localProjects.length - 1) {
                                  this.router.navigate(['**']).then(() => {
                                    this.router.navigate(['/home/workspace/overview']);
                                  });
                                  resolve(true);
                                }
                                modal.destroy();
                              } else {
                                if (index === localProjects.length - 1) {
                                  resolve(false);
                                }
                              }
                            });
                          });
                        } else {
                          if (index === localProjects.length - 1) {
                            resolve(false);
                          }
                        }
                      }
                    );
                  };
                  localProjects.forEach((project, index) => {
                    importProject(project, index);
                  });
                });
              }
            }
          ]
        });
      }
    };
    await btnSaveRunning();
    this.isSaveBtnLoading = false;
  }
}
