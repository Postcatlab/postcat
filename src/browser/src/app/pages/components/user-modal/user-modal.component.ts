import { ViewChild, ElementRef, Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ElectronService, WebService } from 'pc/browser/src/app/core/services';
import { DataSourceService } from 'pc/browser/src/app/services/data-source/data-source.service';
import { MessageService } from 'pc/browser/src/app/services/message/message.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { LocalService } from 'pc/browser/src/app/services/storage/local.service';
import { RemoteService } from 'pc/browser/src/app/services/storage/remote.service';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { EffectService } from 'pc/browser/src/app/store/effect.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { interval, Subject } from 'rxjs';
import { distinct, takeUntil } from 'rxjs/operators';

import { ModalService } from '../../../services/modal.service';

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
      [nzWidth]="450"
      [(nzVisible)]="isLoginModalVisible"
      (nzOnCancel)="handleLoginModalCancel()"
      (nzAfterClose)="euu4ezrCallback()"
      nzTitle=""
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <section class="my-3 px-5 pt-10">
          <form nz-form [formGroup]="validateLoginForm" nzLayout="vertical">
            <nz-form-item>
              <nz-form-control i18n-nzErrorTip nzErrorTip="Please input your email">
                <input
                  nzSize="large"
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
              <nz-form-control [nzErrorTip]="passwordErrorTpl">
                <input
                  type="password"
                  eo-ng-input
                  formControlName="password"
                  nzSize="large"
                  id="password"
                  placeholder="Enter password"
                  i18n-placeholder
                />
                <ng-template #passwordErrorTpl let-control>
                  <ng-container *ngIf="control.hasError('required')" i18n> Please input your password </ng-container>
                  <ng-container *ngIf="control.hasError('minlength')" i18n> Min length is 6 </ng-container>
                </ng-template>
              </nz-form-control>
            </nz-form-item>

            <section>
              <button
                eo-ng-button
                [nzLoading]="isLoginBtnBtnLoading"
                [disabled]="!validateLoginForm.valid"
                type="submit"
                class="h-10 mt-2"
                nzType="primary"
                nzBlock
                nzSize="large"
                (click)="btnvz94ljCallback()"
                i18n
              >
                Sign In/Up
              </button>
              <third-login (done)="closeLoginModal()"></third-login>
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
      nzTitle="New Workspace"
      i18n-nzTitle
    >
      <ng-container *nzModalContent>
        <form nz-form [formGroup]="validateWorkspaceNameForm" nzLayout="vertical">
          <nz-form-item>
            <nz-form-label i18n nzFor="newWorkName">Workspace Name</nz-form-label>
            <nz-form-control i18n-nzErrorTip nzErrorTip="Please input your new workspace name">
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
  // * 0=邮箱 1=手机号 2=wx 3=qq 4=飞书 5=github 6=帐号 7=跳转登录
  hash = new Map().set(0, 'Email').set(1, 'Phone').set(2, 'Wecaht').set(3, 'QQ').set(4, 'Feishu').set(5, 'Github').set(6, 'Account');
  constructor(
    public store: StoreService,
    public message: MessageService,
    public api: ApiService,
    public eMessage: EoNgFeedbackMessageService,
    public effect: EffectService,
    public dataSource: DataSourceService,
    public modal: ModalService,
    public fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private web: WebService,
    private remote: RemoteService,
    private localService: LocalService,
    private electron: ElectronService,
    private trace: TraceService
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
    if (this.store.isClientFirst) {
      this.trace.report('first_open_client');
    }
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
          // * auto focus
          setTimeout(() => {
            this.newWorkNameWorkspaceNameRef?.nativeElement.focus();
          }, 300);
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
    // * pc
    this.electron?.ipcRenderer?.on('thirdLoginCallback', async (event, args) => {
      if (!args.isSuccess) return;
      const code = args.code;
      if (code == null) {
        return;
      }
      await this.thirdLogin(code);
      this.closeLoginModal();
    });

    // * web
    const { code } = this.route.snapshot.queryParams;
    if (code == null) {
      return;
    }
    await this.thirdLogin(code);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  async thirdLogin(code) {
    const [data, err] = await this.api.api_userThirdLoginResult({ code });
    // console.log('data', data);
    if (err) {
      this.store.clearAuth();
      return;
    }
    this.trace.setUserID(data.userId);
    // (0, '登录').set(1, '注册');
    if (data.type == 0) {
      // * login
      this.trace.report('login_success', { login_way: this.hash.get(data.loginWay) });
    }
    if (data.type == 1) {
      // * register
      this.trace.report('register_success');
      this.trace.setUser({ register_way: this.hash.get(data.loginWay) });
    }
    this.store.setLoginInfo(data);
    this.effect.updateWorkspaceList();
    {
      // * set user info
      const [data, err]: any = await this.api.api_userReadInfo({});
      if (err) {
        return;
      }
      this.store.setUserProfile(data);
    }
  }
  closeLoginModal() {
    this.isLoginModalVisible = false;
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
    // * auto clear form
    this.validateLoginForm.reset();
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
      formData.username = formData.username?.trim();
      const [data, err]: any = await this.api.api_userLogin(formData);
      if (err) {
        if (err.code === 131000001) {
          this.eMessage.error($localize`Username must a email`);
          return;
        }
        this.eMessage.error($localize`Please check you username or password`);
        return;
      }
      this.trace.setUserID(data.userId);

      // (0, '登录').set(1, '注册');
      if (data.type == 0) {
        // * login
        this.trace.report('login_success', { login_way: this.hash.get(data.loginWay) });
      }
      if (data.type == 1) {
        // * register
        this.trace.report('register_success');
        this.trace.setUser({ register_way: this.hash.get(data.loginWay) });
      }
      this.store.setLoginInfo(data);
      this.effect.updateWorkspaceList();
      // * 关闭弹窗
      this.isLoginModalVisible = false;
      {
        const [data, err]: any = await this.api.api_userReadInfo({});
        if (err) {
          return;
        }
        this.store.setUserProfile(data);
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
    // * auto clear form
    this.validateWorkspaceNameForm.reset();
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
      const { newWorkName: titles } = this.validateWorkspaceNameForm.value;
      const localProjects = this.store.getProjectList;
      // ! Attention: data is array
      const [data, err]: any = await this.remote.api_workspaceCreate({ titles: [titles] });
      if (err) {
        this.eMessage.error($localize`New workspace Failed !`);
        return;
      }
      this.eMessage.success($localize`New workspace successfully !`);
      this.trace.report('add_workspace_success');
      const workspace = data.at(0);
      // * 关闭弹窗
      this.isAddWorkspaceModalVisible = false;
      {
        await this.effect.updateWorkspaceList();
        await this.effect.switchWorkspace(workspace.workSpaceUuid);
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
              onClick: async () => {
                // const importProject = (project, index) => {
                //   this.storage.run(
                //     'projectCreate',
                //     [
                //       this.store.getCurrentWorkspace.workSpaceUuid,
                //       {
                //         name: project.name
                //       }
                //     ],
                //     (result: StorageRes) => {
                //       if (result.status === StorageResStatus.success) {
                //         this.effect.exportLocalProjectData(project.uuid).then(data => {
                //           console.log(data, project.uuid);
                //           this.storage.run('projectImport', [result.data?.uuid, data], (result: StorageRes) => {
                //             if (result.status === StorageResStatus.success) {
                //               if (index === localProjects.length - 1) {

                //                 resolve(true);
                //               }
                //               modal.destroy();
                //             } else {
                //               if (index === localProjects.length - 1) {
                //                 resolve(false);
                //               }
                //             }
                //           });
                //         });
                //       } else {
                //         if (index === localProjects.length - 1) {
                //           resolve(false);
                //         }
                //       }
                //     }
                //   );
                // };
                // 创建远程项目
                const [remoteProjects, err] = await this.remote.api_projectCreate({
                  projectMsgs: localProjects.map(n => ({
                    name: n.name
                  }))
                });
                if (err) {
                  this.eMessage.error($localize`Create Project Failed !`);
                  return;
                }

                // 遍历本地项目, 挨个导出并导入的远程
                const arr = localProjects.map(async (localProject, index) => {
                  const remoteProject = remoteProjects[index];
                  // 导出本地数据
                  const [exportResult] = await this.localService.api_projectExportProject({ projectUuid: localProject.uuid });

                  exportResult.projectUuid = remoteProject.projectUuid;
                  exportResult.workSpaceUuid = this.store.getCurrentWorkspaceUuid;

                  await this.api.api_projectImport(exportResult);
                });

                await Promise.all(arr);

                // this.effect.updateProjects(workSpaceUuid);

                modal.destroy();

                await this.router.navigate(['**']);

                this.router.navigate(['/home/workspace/overview/projects']);
                // localProjects.forEach((project, index) => {
                //   importProject(project, index);
                // });
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
