import { Component, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { isEqual } from 'lodash-es';
import { EditTabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { Environment } from 'pc/browser/src/app/services/storage/db/models';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { Subject } from 'rxjs';

import { ColumnItem } from '../../../../../../components/eo-ui/table-pro/table-pro.model';
import { eoDeepCopy, isEmptyObj, JSONParse } from '../../../../../../shared/utils/index.utils';
import { ApiEffectService } from '../../store/api-effect.service';
import { ApiStoreService } from '../../store/api-state.service';

export type EnvironmentView = Partial<Environment>;
@Component({
  selector: 'eo-env-edit',
  templateUrl: './env-edit.component.html',
  styleUrls: ['./env-edit.component.scss']
})
export class EnvEditComponent implements OnDestroy, EditTabViewComponent {
  @Input() model: EnvironmentView;
  @Input() initialModel: EnvironmentView;
  @Output() readonly modelChange = new EventEmitter<EnvironmentView>();
  @Output() readonly eoOnInit = new EventEmitter<EnvironmentView>();
  @Output() readonly afterSaved = new EventEmitter<EnvironmentView>();
  varName = $localize`{{Variable Name}}`;
  envDataItem = { name: '', value: '', description: '' };
  envListColumns: ColumnItem[] = [
    { title: $localize`Name`, type: 'input', key: 'name', maxlength: 65535 },
    { title: $localize`Value`, type: 'input', key: 'value', maxlength: 65535 },
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
    private feedback: EoNgFeedbackMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private trace: TraceService
  ) {
    this.initForm();
  }
  formatEnvData(data) {
    const result = eoDeepCopy(data);
    const parameters = this.envParamsComponent?.getPureNzData()?.filter(it => it.name || it.value);
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
      this.feedback.error(err.code === 131000001 ? $localize`Environment name length needs to be less than 32` : $localize`Failed to add`);
      return;
    }
    this.trace.report('add_environment_success', { trigger_way: ux });
    this.feedback.success($localize`Added successfully`);
    // * Would not refresh page
    this.router.navigate(['home/workspace/project/api/env/edit'], {
      queryParams: { pageID: this.route.snapshot.queryParams.pageID, uuid: data.id }
    });
    return data;
  }
  private async editEnv(form) {
    const [data, err] = await this.effect.updateEnv(form);
    if (err) {
      this.feedback.error(err.code === 131000001 ? $localize`Environment name length needs to be less than 32` : $localize`Failed to edit`);
      return;
    }
    this.feedback.success($localize`Edited successfully`);
    return data;
  }
  @HostListener('keydown.control.s', ['$event', "'shortcut'"])
  @HostListener('keydown.meta.s', ['$event', "'shortcut'"])
  async saveEnv($event?, ux = 'ui') {
    $event?.preventDefault?.();
    const isEdit = !!this.route.snapshot.queryParams.uuid;
    if (!this.checkForm()) {
      return;
    }
    this.isSaving = true;
    const formdata = this.formatEnvData(this.model);
    formdata.parameters = JSON.stringify(formdata.parameters);
    const data = isEdit ? await this.editEnv(formdata) : await this.createEnv(formdata, ux);
    this.isSaving = false;
    this.afterSaved.emit(this.model);
    if (!this.store.getEnvUuid) {
      this.store.setEnvUuid(data.id || formdata.id);
    }
  }
  async afterTabActivated() {
    console.log('afterTabActivated');
    const isFromCache: boolean = this.model && !isEmptyObj(this.model);
    if (isFromCache) {
      return;
    }
    const id = Number(this.route.snapshot.queryParams.uuid);
    if (!id) {
      //Add env
      this.model = {
        name: '',
        hostUri: '',
        parameters: []
      };
    } else {
      //Edit env
      const [res, err]: any = await this.getEnv(id);
      this.model = res;
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
    // console.log(JSON.stringify(this.formatEnvData(this.model)), JSON.stringify(this.formatEnvData(this.initialModel)));
    const hasChanged = !isEqual(this.formatEnvData(this.model), this.formatEnvData(this.initialModel));
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
