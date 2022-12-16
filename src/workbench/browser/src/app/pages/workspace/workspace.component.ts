// import { ViewChild, ElementRef, Component, OnInit } from '@angular/core';
// import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
// import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
// import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
// import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
// import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
// import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
// import { NzModalService } from 'ng-zorro-antd/modal';

// @Component({
//   selector: 'eo-workspace',
//   template: ` <section class="py-5 px-10">
//     <h2 class="text-lg flex justify-between items-center">
//       <span i18n>Manage Workspace</span>
//     </h2>
//     <section class="" *ngIf="!store.isLocal && store.canEdit">
//       <nz-divider></nz-divider>
//       <h2 class="text-lg flex justify-between items-center">
//         <span class="font-bold" i18n>Edit Workspace</span>
//       </h2>
//       <form nz-form [formGroup]="validateWspNameForm" nzLayout="vertical">
//         <nz-form-item>
//           <nz-form-label [nzSpan]="24" nzRequired i18n>Name</nz-form-label>
//           <nz-form-control nzErrorTip="Please input your name;">
//             <input type="text" eo-ng-input formControlName="workspace" placeholder="" i18n-placeholder />
//           </nz-form-control>
//         </nz-form-item>

//         <section class="">
//           <button eo-ng-button [nzLoading]="isSaveBtnBtnLoading" class="" nzType="primary" (click)="btnogunjqCallback()" i18n>
//             Save
//           </button>
//         </section>
//       </form>
//       <nz-divider></nz-divider>
//       <h2 class="text-lg flex justify-between items-center">
//         <span class="font-bold" i18n>Delete Workspace</span>
//       </h2>
//       <section class="pb-4">
//         <span i18n> After deleting a workspace, all data in the workspace will be permanently deleted. </span>
//       </section>
//       <button eo-ng-button [nzLoading]="isDelWspBtnLoading" class="" nzType="primary" nzDanger (click)="btn5y8eslCallback()" i18n>
//         Delete
//       </button>
//     </section>
//   </section>`
// })
// export class WorkspaceComponent implements OnInit {
//   validateWspNameForm;
//   isSaveBtnBtnLoading;
//   isDelWspBtnLoading;
//   constructor(
//     public modal: NzModalService,
//     public eMessage: EoNgFeedbackMessageService,
//     public store: StoreService,
//     public message: MessageService,
//     public api: RemoteService,
//     public fb: UntypedFormBuilder,
//     private effect: EffectService
//   ) {
//     this.validateWspNameForm = UntypedFormGroup;
//     this.isSaveBtnBtnLoading = false;
//     this.isDelWspBtnLoading = false;
//   }
//   async ngOnInit(): Promise<void> {
//     // * Init WspName form
//     this.validateWspNameForm = this.fb.group({
//       workspace: [null, [Validators.required]]
//     });

//     const { title: currentWsp } = this.store.getCurrentWorkspace;
//     // * get WspName form values
//     this.validateWspNameForm.patchValue({
//       workspace: currentWsp
//     });
//   }
//   async btnogunjqCallback() {
//     // * click event callback
//     this.isSaveBtnBtnLoading = true;
//     const btnSaveBtnRunning = async () => {
//       const { id: currentWsp } = this.store.getCurrentWorkspace;
//       const { workspace: title } = this.validateWspNameForm.value;
//       const [data, err]: any = await this.api.api_workspaceEdit({
//         workspaceID: currentWsp,
//         title
//       });
//       if (err) {
//         this.eMessage.error($localize`Edit workspace failed`);
//         if (err.status === 401) {
//           this.message.send({ type: 'clear-user', data: {} });
//           if (this.store.isLogin) {
//             return;
//           }
//           this.message.send({ type: 'http-401', data: {} });
//         }
//         return;
//       }
//       this.eMessage.success($localize`Edit workspace successfully !`);
//       this.effect.updateWorkspaceList();
//     };
//     await btnSaveBtnRunning();
//     this.isSaveBtnBtnLoading = false;
//   }
//   async btn5y8eslCallback() {
//     // * click event callback
//     this.isDelWspBtnLoading = true;
//     const btnDelWspRunning = async () => {
//       this.isDelWspBtnLoading = false;

//       const confirm = () =>
//         new Promise(resolve => {
//           this.modal.confirm({
//             nzTitle: $localize`Deletion Confirmation?`,
//             nzContent: $localize`Are you sure you want to delete the workspace ?
// You cannot restore it once deleted!`,
//             nzOkDanger: true,
//             nzOkText: $localize`Delete`,
//             nzOnOk: () => resolve(true),
//             nzOnCancel: () => resolve(false)
//           });
//         });
//       const isOk = await confirm();
//       if (!isOk) {
//         return;
//       }

//       const { id: currentWsp } = this.store.getCurrentWorkspace;
//       const [data, err]: any = await this.api.api_workspaceDelete({
//         workspaceID: currentWsp
//       });
//       if (err) {
//         if (err.status === 401) {
//           this.message.send({ type: 'clear-user', data: {} });
//           if (this.store.isLogin) {
//             return;
//           }
//           this.message.send({ type: 'http-401', data: {} });
//         }
//         return;
//       }
//       this.eMessage.success($localize`Delete success !`);
//       await this.effect.updateWorkspace(this.store.getLocalWorkspace);
//       this.effect.updateWorkspaceList();
//     };
//     await btnDelWspRunning();
//     this.isDelWspBtnLoading = false;
//   }
// }
