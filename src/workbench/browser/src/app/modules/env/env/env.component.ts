import { Component, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
// import { EoTableComponent } from '../../eo-ui/table/eo-table/eo-table.component';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';

import { Subject } from 'rxjs';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { ColumnItem } from '../../eo-ui/table-pro/table-pro.model';

@Component({
  selector: 'eo-env',
  templateUrl: './env.component.html',
  styleUrls: ['./env.component.scss'],
})
export class EnvComponent implements OnInit, OnDestroy {
  // @ViewChild('table') table: EoTableComponent; // * child component ref
  @Output() private statusChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('envParams')
  envParamsComponent: any;

  varName = $localize`{{Variable Name}}`;
  modalTitle = $localize`:@@New Environment:New Environment`;
  isVisible = false;
  /** 是否打开下拉菜单 */
  isOpen = false;
  envCache: any = {};
  envList: any[] = [];
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
          action: 'delete',
        },
      ],
    },
  ];

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public store: StoreService,
    private storage: StorageService,
    private message: EoNgFeedbackMessageService,
    private effect: EffectService
  ) {}

  ngOnInit(): void {}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeEnv() {
    this.statusChange.emit();
  }

  handleDeleteEnv($event, uuid: string) {
    $event?.stopPropagation();
    // * delete localstrage
    this.effect.deleteEnv(uuid);
  }
  handleEditEnv(uuid) {
    this.modalTitle = $localize`Edit Environment`;
    this.handleShowModal();
    // * switch env in menu on left sidebar
    return new Promise((resolve) => {
      this.storage.run('environmentLoad', [uuid], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.envCache = result.data ?? {};
          const parameters = this.envCache.parameters ?? [];
          //! Compatible some error data
          this.envCache.parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  handleAddEnv(pid = 1) {
    // * init form of env, create new env-id
    this.envCache = {
      projectID: pid,
      name: '',
      hostUri: '',
      parameters: [],
    };
    this.modalTitle = $localize`:@@New Environment:New Environment`;
    this.handleShowModal();
  }

  handleSaveEnv(uuid: string | number | undefined = undefined) {
    // * update list after call save api
    const { name, ...other } = this.envCache;
    if (!name) {
      this.message.error($localize`Name is not allowed to be empty`);
      return;
    }
    const parameters = this.envParamsComponent.getPureNzData()?.filter((it) => it.name || it.value);
    if (uuid != null) {
      this.storage.run('environmentUpdate', [{ ...other, name, parameters }, uuid], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.message.success($localize`Edited successfully`);
          this.handleCancel();
        } else {
          this.message.error($localize`Failed to edit`);
        }
      });
    } else {
      this.storage.run(
        'environmentCreate',
        [Object.assign({}, this.envCache, { parameters })],
        async (result: StorageRes) => {
          if (result.status === StorageResStatus.success) {
            this.message.success($localize`Added successfully`);
            this.handleCancel();
          } else {
            this.message.error($localize`Failed to add`);
          }
        }
      );
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.envCache = {};
    this.effect.updateEnvList();
  }

  handleShowModal() {
    this.isVisible = true;
    this.isOpen = false;
  }
}
