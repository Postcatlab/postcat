import { Component, EventEmitter, Input, OnDestroy, AfterViewInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { TabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import {
  AuthInfo,
  AuthorizationExtensionFormComponent,
  inheritAuth
} from 'pc/browser/src/app/pages/workspace/project/api/components/authorization-extension-form/authorization-extension-form.component';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { Group } from 'pc/browser/src/app/services/storage/db/models';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { fromEvent, Subject, takeUntil } from 'rxjs';

import { eoDeepCopy, JSONParse } from '../../../../../shared/utils/index.utils';
import { ApiEffectService } from '../store/api-effect.service';

@Component({
  selector: 'eo-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnDestroy, AfterViewInit, TabViewComponent {
  @Input() model: Group;
  @Input() initialModel: Group;
  @Output() readonly modelChange = new EventEmitter<Group>();
  @Output() readonly eoOnInit = new EventEmitter<Group>();
  @Output() readonly afterSaved = new EventEmitter<Group>();

  authInfoModel: AuthInfo = {
    authType: '',
    authInfo: {}
  };
  isEdit = false;
  topSaveBar: HTMLDivElement;

  isSaving = false;
  validateForm: FormGroup;
  @ViewChild('authExtForm') authExtForm: AuthorizationExtensionFormComponent;
  @ViewChild('groupNameInputRef') groupNameInputRef: ElementRef<HTMLInputElement>;
  envParamsComponent: any;
  private destroy$: Subject<void> = new Subject<void>();
  topSaveBarObserver: IntersectionObserver;
  constructor(
    private api: ApiService,
    private effect: ApiEffectService,
    public globalStore: StoreService,
    private fb: FormBuilder,
    private message: EoNgFeedbackMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private trace: TraceService
  ) {
    this.initShortcutKey();
    this.initForm();
  }
  ngAfterViewInit(): void {
    // 目标元素
    this.topSaveBar = document.querySelector('eo-group .top-save-bar');
    this.topSaveBarObserver = new IntersectionObserver(
      ([e]) => {
        e.target.classList.toggle('is-pinned', e.intersectionRatio < 1);
      },
      {
        threshold: [1]
      }
    );
    // 监听
    this.topSaveBarObserver.observe(this.topSaveBar);
  }
  initShortcutKey() {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: KeyboardEvent) => {
        const { ctrlKey, metaKey, code } = event;
        // 判断 Ctrl+S
        if ([ctrlKey, metaKey].includes(true) && code === 'KeyS') {
          // 或者 return false;
          event.preventDefault();
          this.saveGroupInfo('shortcut');
        }
      });
  }
  private checkForm(): boolean {
    if (this.validateForm.status === 'INVALID') {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }
    return true;
  }
  async saveGroupInfo(ux = 'ui') {
    if (!this.checkForm() || !this.authExtForm.checkForm() || this.isEdit) {
      return;
    }
    this.isSaving = true;
    this.initialModel = eoDeepCopy(this.model);
    const params = {
      id: this.model.id,
      type: this.model.type,
      authInfo: {
        authType: this.authInfoModel.authType,
        authInfo: this.authExtForm.validateForm?.value ? JSON.stringify(this.authExtForm.validateForm.value) : {}
      }
    };
    if (params.id) {
      await this.effect.updateGroup(params);
      this.message.success($localize`Edit Group Info successfully`);
      this.isSaving = false;
      this.afterSaved.emit(this.initialModel);
      this.trace.report('save_auth_success');
    } else {
      this.checkForm();
    }
  }
  async init() {
    const queryParams = this.route.snapshot.queryParams;
    const { uuid, parentId } = queryParams;
    const id = Number(uuid);
    this.authExtForm?.init?.();
    if (!id) {
      const [data] = await this.effect.createGroup([
        {
          type: 1,
          name: $localize`:@@AddGroup:New Group`,
          parentId: Number(parentId)
        }
      ]);
      if (data) {
        this.model = data;
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: { ...queryParams, uuid: data.id } });
      }
      this.initialModel = eoDeepCopy(this.model);
      this.isEdit = true;
    } else {
      if (!this.model) {
        const [res, err]: any = await this.api.api_groupDetail({ id });
        console.log('res', structuredClone(res));
        this.model = res;
        this.initialModel = eoDeepCopy(this.model);
      }
    }
    if (this.model?.authInfo?.authType === inheritAuth.name) {
      this.model.authInfo.authInfo = '';
    }
    if (this.initialModel.authInfo) {
      this.initialModel.authInfo.authInfo = JSONParse(this.initialModel.authInfo.authInfo);
    }
    this.authInfoModel = {
      ...this.model.authInfo,
      authInfo: JSONParse(this.model.authInfo?.authInfo) || {}
    };
    this.initForm();
    this.eoOnInit.emit(this.model);
  }
  private initForm() {
    this.validateForm = this.fb.group({
      name: [this.model?.name || '', [Validators.required]]
    });
  }
  emitChange($event?) {
    this.modelChange.emit({
      ...this.model,
      name: this.validateForm.value.name,
      authInfo: this.authInfoModel
    });
  }
  isFormChange() {
    const formData = this.authExtForm.validateForm?.value;
    const authInfoChanged =
      formData && Object.entries<any>(formData).some(([key, value]) => value !== this.initialModel.authInfo?.authInfo?.[key]);
    const authTypeChanged = this.model.authInfo?.authType !== this.initialModel.authInfo?.authType;
    const nameIsChange = this.model.name !== this.validateForm.value.name;
    return authInfoChanged || authTypeChanged || nameIsChange;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.topSaveBarObserver.unobserve(this.topSaveBar);
  }

  startEditGroupName() {
    this.isEdit = true;
    setTimeout(() => {
      this.groupNameInputRef.nativeElement.focus();
    });
  }

  async changeGroupName() {
    const name = this.validateForm.value.name;
    const { id, ...rest } = this.model;
    if (!this.checkForm()) {
      return;
    }
    if (name === this.model.name) {
      this.isEdit = false;
      return;
    }
    if (this.model.id) {
      await this.effect.updateGroup({ name, id });
      this.model.name = name;
      this.message.success($localize`Edit Group Name successfully`);
    } else {
      const [data] = await this.effect.createGroup([{ ...this.model, name }]);
      if (data) {
        this.model = data;
      }
      this.message.success($localize`Create Group successfully`);
    }

    this.isEdit = false;
    this.emitChange();
  }
}
