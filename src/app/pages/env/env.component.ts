import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Environment } from '../../shared/services/environment/environment.model';
import { EnvironmentService } from '../../shared/services/environment/environment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { uuid as uid } from '../../utils/index';
import { MessageService } from '../../shared/services/message';
import { EoTableComponent } from '../../eoui/table/eo-table/eo-table.component';
import { Change, EnvState } from '../../shared/store/env.state';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'eo-env',
  templateUrl: './env.component.html',
  styleUrls: ['./env.component.scss'],
})
export class EnvComponent implements OnInit, OnDestroy {
  @ViewChild('table') table: EoTableComponent; // * child component ref
  // @Select(EnvState) env$: Observable<any>;
  varName = `{{变量名}}`;
  isVisible = false;
  envInfo: any = {};
  envList: any[] = [];
  activeUuid = 0;
  envListColumns = [
    { title: '变量名', key: 'name', isEdit: true },
    { title: '变量值', key: 'value', isEdit: true },
    { title: '参数说明', key: 'description', isEdit: true },
    { title: '操作', slot: 'action', width: '15%' },
  ];

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private envService: EnvironmentService,
    private message: NzMessageService,
    private messageService: MessageService,
    private store: Store
  ) {}

  get envUuid(): number {
    return this.activeUuid || 0;
  }
  set envUuid(value) {
    this.activeUuid = value || 0;
    this.handleSwitchEnv(this.activeUuid);
    this.changeStoreEnv(this.activeUuid);
    localStorage.setItem('env:selected', this.activeUuid.toString());
  }

  ngOnInit(): void {
    this.getAllEnv();
    // this.envUuid = Number(localStorage.getItem('env:selected'));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllEnv() {
    this.envService.loadAll().subscribe((result: Array<Environment>) => {
      if (result.length === 0) {
        this.envList = [];
        this.handleAddEnv(null);
        return;
      }
      this.envList = result;
      this.envUuid = Number(localStorage.getItem('env:selected'));
    });
  }

  handleDeleteEnv(uuid: string) {
    // * delete env in menu on left sidebar
    this.envService.remove(uuid).subscribe((result: boolean) => {
      this.getAllEnv();
    });
  }
  handleDeleteParams(index) {
    // * delete params in table
    const data = JSON.parse(JSON.stringify(this.envInfo.parameters));
    this.envInfo.parameters = data.filter((it, i) => i !== index);
  }
  handleSwitchEnv(uuid) {
    // * switch env in menu on left sidebar
    this.envService.load(uuid).subscribe((result: Environment) => {
      const { parameters, ...other } = result;
      const list = JSON.parse(JSON.stringify(parameters));
      this.envInfo = { ...other, parameters: [...list, { name: '', value: '', description: '' }] };
    });
    this.activeUuid = uuid;
  }

  handleAddEnv(pid) {
    // * init form of env, create new env-id
    this.envInfo = {
      projectID: pid || uid(),
      name: '',
      hostUri: '',
      parameters: [{ name: '', value: '', description: '' }],
    };
    this.activeUuid = null;
  }

  handleSaveEnv() {
    // * update list after call save api
    const { parameters, ...other } = this.envInfo;
    const data = parameters.filter((it) => it.name && it.value);
    this.envService.create({ ...other, parameters: data }).subscribe((result: Environment) => {
      this.envInfo = result;
      this.activeUuid = Number(result.uuid);
      this.handleSwitchEnv(result.uuid);
      this.getAllEnv();
    });
  }

  handleTableChange(data) {
    const list = data.filter((it) => it.name || it.value || it.description);
    // this.table.pushData({ name: '', value: '', description: '' });
    // console.log(data);
    this.envInfo.parameters = [...list, { name: '', value: '', description: '' }];
  }

  handleUpdateEnv(uuid: string | number) {
    // * update env
    const { parameters, ...other } = this.envInfo;
    const data = parameters.filter((it) => it.name && it.value);
    this.envService.update({ ...other, parameters: data }, uuid).subscribe((result: Environment) => {
      this.message.success('Save suceess');
      // console.log('update =>', result);
      this.getAllEnv();
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.envList = [];
    this.envInfo = {};
  }

  handleShowModal() {
    this.isVisible = true;
  }

  handleEnvSelectStatus(event) {
    if (event) {
      this.getAllEnv();
    }
  }

  private changeStoreEnv(uuid) {
    const data = this.envList.find((val) => val.uuid === uuid);
    this.store.dispatch(new Change(data));
  }
}
