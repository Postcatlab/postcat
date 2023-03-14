import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { TabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { fromEvent, Subject, takeUntil } from 'rxjs';

import { ColumnItem } from '../../../../../../components/eo-ui/table-pro/table-pro.model';
import { Environment } from '../../../../../../services/storage/index.model';
import { eoDeepCopy, JSONParse } from '../../../../../../shared/utils/index.utils';
import { ApiEffectService } from '../../store/api-effect.service';
import { ApiStoreService } from '../../store/api-state.service';

export type EnvironmentView = Partial<Environment>;
@Component({
  selector: 'eo-env-edit',
  templateUrl: './env-edit.component.html',
  styleUrls: ['./env-edit.component.scss']
})
export class EnvEditComponent implements OnDestroy, TabViewComponent {
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
  isSaving = false;
  validateForm: FormGroup;
  @ViewChild('envParams')
  envParamsComponent: any;
  private destroy$: Subject<void> = new Subject<void>();
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
  private async createEnv(form, ux = 'ui') {
    const [data, err] = await this.effect.addEnv(form);
    if (err) {
      this.message.error(err.code == 131000001 ? $localize`Environment name length needs to be less than 32` : $localize`Failed to add`);
      return;
    }
    this.trace.report('add_environment_success', { trigger_way: ux });
    this.message.success($localize`Added successfully`);
    // * Would not refresh page
    this.router.navigate(['home/workspace/project/api/env/edit'], {
      queryParams: { pageID: this.route.snapshot.queryParams.pageID, uuid: data.id }
    });
    return data;
  }
  private async editEnv(form) {
    const [data, err] = await this.effect.updateEnv(form);
    if (err) {
      this.message.error(err.code == 131000001 ? $localize`Environment name length needs to be less than 32` : $localize`Failed to edit`);
      return;
    }
    this.message.success($localize`Edited successfully`);
    return data;
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
    const data = isEdit ? await this.editEnv(formdata) : await this.createEnv(formdata, ux);
    this.isSaving = false;
    this.afterSaved.emit(this.initialModel);
    if (!this.store.getEnvUuid) {
      this.store.setEnvUuid(data.id || formdata.id);
    }
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
  async getEnv(id: number) {
    const [result, err] = await this.api.api_environmentDetail({
      id
    });
    if (err) {
      return [null, err];
    } else {
      const envData = result ?? {};
      const parameters = envData.parameters ?? [];
      envData.parameters = JSONParse(parameters);
      return [envData];
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
