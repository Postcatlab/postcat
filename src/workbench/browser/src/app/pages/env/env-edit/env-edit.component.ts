import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';

import { ColumnItem } from '../../../modules/eo-ui/table-pro/table-pro.model';
import { Environment, StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { EffectService } from '../../../shared/store/effect.service';
import { eoDeepCopy } from '../../../utils/index.utils';

@Component({
  selector: 'eo-env-edit',
  templateUrl: './env-edit.component.html',
  styleUrls: ['./env-edit.component.scss']
})
export class EnvEditComponent {
  @Input() model: Partial<Environment>;
  @Input() initialModel: Partial<Environment>;
  @Output() readonly modelChange = new EventEmitter<Partial<Environment>>();
  @Output() readonly eoOnInit = new EventEmitter<Partial<Environment>>();
  envList: any[] = [];
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

  @ViewChild('envParams')
  envParamsComponent: any;
  constructor(
    private storage: StorageService,
    private effect: EffectService,
    private message: EoNgFeedbackMessageService,
    private route: ActivatedRoute
  ) {}

  saveEnv(uuid: string | number | undefined = undefined) {
    // * update list after call save api
    const { name, ...other } = this.model;
    if (!name) {
      this.message.error($localize`Name is not allowed to be empty`);
      return;
    }
    const parameters = this.envParamsComponent.getPureNzData()?.filter(it => it.name || it.value);
    if (uuid != null) {
      this.storage.run('environmentUpdate', [{ ...other, name, parameters }, uuid], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.message.success($localize`Edited successfully`);
        } else {
          this.message.error($localize`Failed to edit`);
        }
      });
    } else {
      this.storage.run('environmentCreate', [{ ...this.model, parameters }], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.message.success($localize`Added successfully`);
        } else {
          this.message.error($localize`Failed to add`);
        }
      });
    }
  }
  async init() {
    const id = Number(this.route.snapshot.queryParams.uuid);
    console.log('this.model', this.model);
    if (!id) {
      this.model = {
        name: '',
        hostUri: '',
        parameters: []
      };
    } else {
      const [res, err]: any = await this.getEnv(id);
      console.log('getEnv', res);
      this.model = res;
    }
    this.initialModel = eoDeepCopy(this.model);
    this.eoOnInit.emit(this.model);
  }
  emitChange($event) {
    console.log(this.model);
    this.modelChange.emit(this.model);
  }
  isFormChange() {
    return true;
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
}
