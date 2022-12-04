import { Component, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
// import { EoTableComponent } from '../../eo-ui/table/eo-table/eo-table.component';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';

import { Subject } from 'rxjs';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';

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
  envInfo: any = {};
  envList: any[] = [];
  activeUuid = 0;
  envDataItem = { name: '', value: '', description: '' };
  envListColumns = [
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
    private storage: StorageService,
    private messageService: MessageService,
    private message: EoNgFeedbackMessageService,
    private store: StoreService,
    private effect: EffectService
  ) {}

  get envUuid(): number {
    return Number(localStorage.getItem('env:selected')) || 0;
  }
  set envUuid(value) {
    this.activeUuid = value;
    if (value) {
      localStorage.setItem('env:selected', value == null ? '' : value.toString());
    } else {
      localStorage.removeItem('env:selected');
    }
  }

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
          this.envInfo = result.data ?? {};
          const parameters = this.envInfo.parameters ?? [];
          //! Compatible some error data
          this.envInfo.parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
          this.activeUuid = result.data?.uuid ?? null;
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  handleAddEnv(pid = 1) {
    // * init form of env, create new env-id
    this.envInfo = {
      projectID: pid,
      name: '',
      hostUri: '',
      parameters: [],
    };
    this.modalTitle = $localize`:@@New Environment:New Environment`;
    this.activeUuid = null;
    this.handleShowModal();
  }

  handleSaveEnv(uuid: string | number | undefined = undefined) {
    // * update list after call save api
    const { name, ...other } = this.envInfo;
    if (!name) {
      this.message.error($localize`Name is not allowed to be empty`);
      return;
    }
    const parameters = this.envParamsComponent.getPureNzData()?.filter((it) => it.name || it.value);
    if (uuid != null) {
      this.storage.run('environmentUpdate', [{ ...other, name, parameters }, uuid], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.message.success($localize`Edited successfully`);
          if (this.envUuid === Number(uuid)) {
            this.envUuid = Number(uuid);
          }
          this.handleCancel();
        } else {
          this.message.error($localize`Failed to edit`);
        }
      });
    } else {
      this.storage.run(
        'environmentCreate',
        [Object.assign({}, this.envInfo, { parameters })],
        async (result: StorageRes) => {
          if (result.status === StorageResStatus.success) {
            this.message.success($localize`Added successfully`);
            this.activeUuid = Number(result.data.uuid);
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
    this.envInfo = {};
    this.effect.updateEnvList();
  }

  handleShowModal() {
    this.isVisible = true;
    this.isOpen = false;
  }

  handleEnvSelectStatus(event: boolean) {
    if (event) {
      this.activeUuid = this.envUuid;
      this.handleEditEnv(this.activeUuid);
    }
  }
}
