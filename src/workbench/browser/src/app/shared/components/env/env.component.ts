import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { StorageHandleResult, StorageHandleStatus } from '../../../../../../../platform/browser/IndexedDB';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EoTableComponent } from '../../../eoui/table/eo-table/eo-table.component';
import { Change } from '../../store/env.state';
import { StorageService } from '../../services/storage';

import { Subject } from 'rxjs';

@Component({
  selector: 'eo-env',
  templateUrl: './env.component.html',
  styleUrls: ['./env.component.scss'],
})
export class EnvComponent implements OnInit, OnDestroy {
  @ViewChild('table') table: EoTableComponent; // * child component ref
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
  constructor(private storage: StorageService, private message: NzMessageService, private store: Store) {}

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

  ngOnInit(): void {
    this.getAllEnv();
    this.changeStoreEnv(localStorage.getItem('env:selected'));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllEnv(uuid?: number) {
    const projectID = 1;
    this.storage.run('environmentLoadAllByProjectID', [projectID], (result: StorageHandleResult) => {
      if (result.status !== StorageHandleStatus.success) {
        this.envList = [];
        this.handleAddEnv(projectID);
        return;
      }
      this.envList = result.data;
      this.handleSwitchEnv(uuid ?? result.data[0].uuid);
    });
  }

  handleDeleteEnv(uuid: string) {
    // * delete env in menu on left sidebar
    this.storage.run('environmentRemove', [uuid], (result: StorageHandleResult) => {
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
    this.storage.run('environmentLoad', [uuid], (result: StorageHandleResult) => {
      if (result.status === StorageHandleStatus.success) {
        this.envInfo = result.data;
      }
      this.activeUuid = uuid;
    });
  }

  handleAddEnv(pid) {
    // * init form of env, create new env-id
    this.envInfo = {
      projectID: pid || 1,
      name: '',
      hostUri: '',
      parameters: [],
    };
    this.activeUuid = null;
  }

  handleSaveEnv(uuid: string | number | undefined = undefined) {
    // * update list after call save api
    const { parameters, name, ...other } = this.envInfo;
    if (!name) {
      this.message.error('Name is not allowed to be empty.');
      return;
    }
    const data = parameters.filter((it) => it.name && it.value);
    if (uuid) {
      this.storage.run(
        'environmentUpdate',
        [{ ...other, name, parameters: data }, uuid],
        (result: StorageHandleResult) => {
          if (result.status === StorageHandleStatus.success) {
            this.message.success('编辑成功');
            this.getAllEnv(this.activeUuid);
          } else {
            this.message.success('编辑失败');
          }
        }
      );
    } else {
      this.storage.run('environmentCreate', [{ ...other, name, parameters: data }], (result: StorageHandleResult) => {
        if (result.status === StorageHandleStatus.success) {
          this.message.success('新增成功');
          this.envInfo = result.data;
          this.activeUuid = Number(result.data.uuid);
          this.getAllEnv(result.data.uuid);
        } else {
          this.message.success('新增失败');
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.envList = [];
    this.envInfo = {};
  }

  handleShowModal() {
    this.isVisible = true;
    this.handleSwitchEnv(this.envUuid);
  }

  handleEnvSelectStatus(event) {
    if (event) {
      this.activeUuid = this.envUuid;
      this.handleSwitchEnv(this.activeUuid);
      this.getAllEnv();
    }
  }

  private changeStoreEnv(uuid) {
    if (uuid == null) {
      this.store.dispatch(new Change(null));
      return;
    }
    this.storage.run('environmentLoadAllByProjectID', [1], (result: StorageHandleResult) => {
      if (result.status === StorageHandleStatus.success) {
        const data = result.data.find((val) => val.uuid === Number(uuid));
        this.store.dispatch(new Change(data));
      }
    });
  }
}
