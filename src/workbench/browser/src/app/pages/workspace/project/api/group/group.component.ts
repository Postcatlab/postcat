import { Component, EventEmitter, Input, OnDestroy, AfterViewInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { TabViewComponent } from 'eo/workbench/browser/src/app/modules/eo-ui/tab/tab.model';
import {
  inheritAuth,
  noAuth
} from 'eo/workbench/browser/src/app/shared/components/authorization-extension-form/authorization-extension-form.component';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { TraceService } from 'eo/workbench/browser/src/app/shared/services/trace.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { fromEvent, Subject, takeUntil } from 'rxjs';

import { eoDeepCopy, JSONParse } from '../../../../../utils/index.utils';
import { ApiEffectService } from '../service/store/api-effect.service';
import { ApiStoreService } from '../service/store/api-state.service';

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
  isEdit = false;
  topSaveBar: HTMLDivElement;

  get authType() {
    return this.model.depth > 1 ? inheritAuth : noAuth;
  }

  isSaving = false;

  validateForm: FormGroup;
  @ViewChild('groupNameInputRef') groupNameInputRef: ElementRef<HTMLInputElement>;
  envParamsComponent: any;
  private destroy$: Subject<void> = new Subject<void>();
  topSaveBarObserver: IntersectionObserver;
  constructor(
    private api: ApiService,
    private effect: ApiEffectService,
    private store: ApiStoreService,
    public globalStore: StoreService,
    private fb: FormBuilder,
    private message: EoNgFeedbackMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private trace: TraceService
  ) {
    this.init();
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
          this.saveEnv('shortcut');
        }
      });
  }
  formatEnvData(data) {
    const result = eoDeepCopy(data);
    const parameters = this.envParamsComponent.getPureNzData()?.filter(it => it.name || it.value);
    return { ...result, parameters };
  }
  private checkForm(): boolean {
    if (this.validateForm.status === 'INVALID') {
      return false;
    }
    return true;
  }
  async saveEnv(ux = 'ui') {
    const isEdit = !!this.route.snapshot.queryParams.uuid;
    if (!this.checkForm()) {
      return;
    }
    this.isSaving = true;
    const formdata = this.formatEnvData(this.model);
    this.initialModel = eoDeepCopy(formdata);
    formdata.parameters = JSON.stringify(formdata.parameters);
    this.isSaving = false;
    this.afterSaved.emit(this.initialModel);
  }
  async init() {
    const { groupId, parentId } = this.route.snapshot.queryParams;
    const id = Number(groupId);
    if (!id) {
      this.model = {
        type: 1,
        name: '',
        parentId: Number(parentId)
      } as any;
      this.initialModel = eoDeepCopy(this.model);
      this.isEdit = true;
    } else {
      if (!this.model) {
        const [res, err]: any = await this.api.api_groupDetail({ id });
        this.model = res;
        this.initialModel = eoDeepCopy(this.model);
      }
    }
    this.initForm();
    this.eoOnInit.emit(this.model);
  }
  private initForm() {
    this.validateForm = this.fb.group({
      name: [this.model?.name || '', [Validators.required]]
    });
  }
  emitChange($event) {
    this.modelChange.emit(this.model);
  }
  isFormChange() {
    const hasChanged = JSON.stringify(this.formatEnvData(this.model)) !== JSON.stringify(this.formatEnvData(this.initialModel));
    return hasChanged;
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
    const { name, id, ...rest } = this.model;
    if (name.trim() === '') {
      return;
    }
    if (this.model.id) {
      await this.effect.updateGroup({ name, id });
    } else {
      const [data] = await this.effect.createGroup([{ name, ...rest }]);
      if (data) {
        this.model = data;
      }
    }

    this.isEdit = false;
  }
}
