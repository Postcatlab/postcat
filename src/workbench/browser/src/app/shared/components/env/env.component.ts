import { Component, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { EoMessageService } from '../../../eoui/message/eo-message.service';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { EoTableComponent } from '../../../eoui/table/eo-table/eo-table.component';
import { Change } from '../../store/env.state';
import { ApiService } from '../../services/storage/api.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'eo-env',
  templateUrl: './env.component.html',
  styleUrls: ['./env.component.scss'],
})
export class EnvComponent implements OnInit, OnDestroy {
  @ViewChild('table') table: EoTableComponent; // * child component ref
  @Output() private statusChange: EventEmitter<any> = new EventEmitter();
  varName = $localize`{{Variable Name}}`;
  modalTitle = $localize`:@@New Environment:New Environment`;
  isVisible = false;
  /** 是否打开下拉菜单 */
  isOpen = false;
  envInfo: any = {};
  envList: any[] = [];
  activeUuid = 0;
  envListColumns = [
    { title: $localize`Name`, key: 'name', isEdit: true },
    { title: $localize`Value`, key: 'value', isEdit: true },
    { title: $localize`:@@Description:Description`, key: 'description', isEdit: true },
    { title: $localize`Operate`, slot: 'action', width: '15%' },
  ];

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private message: EoMessageService,
    private store: Store
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
    this.changeStoreEnv(value);
  }

  async ngOnInit(): Promise<void> {
    this.envList = await this.getAllEnv();
    this.changeStoreEnv(localStorage.getItem('env:selected'));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async getAllEnv(projectID = 1) {
    const [res, err]: any = await this.api.api_envSearch({ projectID });
    if (err) {
      return;
    }
    return res.data;
  }

  closeEnv() {
    this.statusChange.emit();
  }

  async handleDeleteEnv($event, uuid: string) {
    $event?.stopPropagation();
    // * delete localstrage
    this.messageService.send({ type: 'deleteEnv', data: uuid });
    // * delete env in menu on left sidebar
    const [, err]: any = await this.api.api_envDelete({ uuid });
    if (err) {
      return;
    }
    this.envList = await this.getAllEnv();
    if (this.envUuid === Number(uuid)) {
      this.envUuid = this.activeUuid;
    }
  }
  handleDeleteParams(index) {
    // * delete params in table
    const data = JSON.parse(JSON.stringify(this.envInfo.parameters));
    this.envInfo.parameters = data.filter((it, i) => i !== index);
  }

  async handleEditEnv(uuid) {
    this.modalTitle = $localize`Edit Environment`;
    this.handleShowModal();
    // * switch env in menu on left sidebar
    const [res, err]: any = await this.api.api_envLoad({ uuid });
    if (err) {
      return;
    }
    this.envInfo = res.data ?? {};
    this.activeUuid = res.data?.uuid ?? null;
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

  async handleSaveEnv(uuid: string | number | undefined = undefined) {
    // * update list after call save api
    const { parameters, name, ...other } = this.envInfo;
    if (!name) {
      this.message.error($localize`Name is not allowed to be empty`);
      return;
    }
    const data = parameters?.filter((it) => it.name || it.value);
    if (uuid != null) {
      const [, err]: any = await this.api.api_envUpdate({ ...other, name, parameters: data, uuid });
      if (err) {
        this.message.error($localize`Failed to edit`);
        return;
      }
      this.message.success($localize`Edited successfully`);
      this.envList = await this.getAllEnv();
      if (this.envUuid === Number(uuid)) {
        this.envUuid = Number(uuid);
      }
      this.handleCancel();
      return;
    }
    const [res, error]: any = await this.api.api_envCreate(this.envInfo);
    if (error) {
      this.message.error($localize`Failed to add`);
      return;
    }
    this.message.success($localize`Added successfully`);
    this.activeUuid = Number(res.data.uuid);
    this.envList = await this.getAllEnv();
    this.handleCancel();
  }

  handleCancel(): void {
    this.isVisible = false;
    // this.envList = [];
    this.envInfo = {};
    this.messageService.send({ type: 'updateEnv', data: {} });
  }

  handleShowModal() {
    // this.handleAddEnv(null);
    this.isVisible = true;
    this.isOpen = false;
  }

  async handleEnvSelectStatus(event: boolean) {
    if (!event) {
      return;
    }
    this.activeUuid = this.envUuid;
    this.handleEditEnv(this.activeUuid);
    this.envList = await this.getAllEnv();
  }

  private async changeStoreEnv(uuid) {
    if (uuid == null) {
      this.store.dispatch(new Change(null));
      return;
    }
    this.envList = await this.getAllEnv();
    const data = this.envList.find((val) => val.uuid === Number(uuid));
    this.store.dispatch(new Change(data));
  }
}
