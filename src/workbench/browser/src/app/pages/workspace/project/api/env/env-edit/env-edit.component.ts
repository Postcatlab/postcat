import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { fromEvent, Subject, takeUntil } from 'rxjs';

import { ColumnItem } from '../../../../../../modules/eo-ui/table-pro/table-pro.model';
import { Environment, StorageRes, StorageResStatus } from '../../../../../../shared/services/storage/index.model';
import { StorageService } from '../../../../../../shared/services/storage/storage.service';
import { EffectService } from '../../../../../../shared/store/effect.service';
import { StoreService } from '../../../../../../shared/store/state.service';
import { eoDeepCopy } from '../../../../../../utils/index.utils';

export type EnvironmentView = Partial<Environment>;
@Component({
  selector: 'eo-env-edit',
  templateUrl: './env-edit.component.html',
  styleUrls: ['./env-edit.component.scss']
})
export class EnvEditComponent implements OnDestroy {
  @Input() model: EnvironmentView;
  @Input() initialModel: EnvironmentView;
  @Output() readonly modelChange = new EventEmitter<EnvironmentView>();
  @Output() readonly eoOnInit = new EventEmitter<EnvironmentView>();
  @Output() readonly afterSaved = new EventEmitter<EnvironmentView>();
  varName = $localize`{{Variable Name}}`;
  envDataItem = { name: '', value: '', description: '' };
  envListColumns: ColumnItem[] = [
    { title: $localize`Name`, type: 'input', key: 'name' },
    { title: $localize`Value`, type: 'input', key: 'value' },
    { title: $localize`:@@Description:Description`, type: 'input', key: 'description' },
    {
      title: $localize`Operate`,
      type: 'btnList',
      width: 170,
      right: true,
      btns: [
        {
          action: 'delete'
        }
      ]
    }
  ];
  validateForm: FormGroup;
  @ViewChild('envParams')
  envParamsComponent: any;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private storage: StorageService,
    private effect: EffectService,
    private fb: FormBuilder,
    private message: EoNgFeedbackMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService
  ) {
    this.initShortcutKey();
    this.initForm();
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
          this.saveEnv();
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
  saveEnv() {
    const uuid = Number(this.route.snapshot.queryParams.uuid);
    if (!this.checkForm()) {
      return;
    }
    const formdata = this.formatEnvData(this.model);
    formdata.projectID = this.store.getCurrentProjectID;
    this.initialModel = eoDeepCopy(formdata);
    const operateMUI = {
      edit: {
        method: 'environmentUpdate',
        params: [formdata, uuid],
        success: $localize`Edited successfully`,
        error: $localize`Failed to edit`
      },
      add: {
        method: 'environmentCreate',
        params: [formdata],
        success: $localize`Added successfully`,
        error: $localize`Failed to add`
      }
    };
    const operateName = uuid ? 'edit' : 'add';
    const operate = operateMUI[operateName];
    this.storage.run(operate.method, operate.params, async (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.message.success(operate.success);
        this.effect.updateEnvList();
        console.log(operateName);
        if (operateName === 'add') {
          this.router.navigate(['home/workspace/project/api/env/edit'], {
            queryParams: { pageID: this.route.snapshot.queryParams.pageID, uuid: result.data.uuid }
          });
        }
        this.afterSaved.emit(this.initialModel);
      } else {
        this.message.error(operate.error);
      }
    });
  }
  async init() {
    const id = Number(this.route.snapshot.queryParams.uuid);
    if (!id) {
      this.model = {
        name: '',
        hostUri: '',
        parameters: []
      };
      this.initialModel = eoDeepCopy(this.model);
    } else {
      if (!this.model) {
        const [res, err]: any = await this.getEnv(id);
        this.model = res;
        this.initialModel = eoDeepCopy(this.model);
      }
    }
    this.initForm();
    this.eoOnInit.emit(this.model);
  }
  private initForm() {
    this.validateForm = this.fb.group({
      name: [this.model?.name || '', [Validators.required]],
      hostUri: [this.model?.hostUri || '']
    });
  }
  emitChange($event) {
    this.modelChange.emit(this.model);
  }
  isFormChange() {
    const hasChanged = JSON.stringify(this.formatEnvData(this.model)) !== JSON.stringify(this.formatEnvData(this.initialModel));
    return hasChanged;
  }
  getEnv(uuid) {
    return new Promise(resolve => {
      this.storage.run('environmentLoad', [uuid], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          const envData = result.data ?? {};
          const parameters = envData.parameters ?? [];
          //! Compatible some error data
          envData.parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
          resolve([envData, null]);
        }
        resolve([null, result.status]);
      });
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
