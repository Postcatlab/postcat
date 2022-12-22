import { Component, OnInit } from '@angular/core';
import { OperateProjectFormComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/components/operate-project-form.compoent';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { SettingService } from '../../../../modules/system-setting/settings.service';
import { EffectService } from '../../../../shared/store/effect.service';
type ListType = 'list' | 'card';

@Component({
  selector: 'eo-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  listType: ListType = this.setting.get('workbench.list.type') || 'list';
  initLoading = true; // bug
  projectList: any[] = [];

  get WorkspaceID() {
    return this.storeSerive.getCurrentWorkspaceID;
  }

  constructor(
    private storage: StorageService,
    private store: StoreService,
    private setting: SettingService,
    private effect: EffectService,
    private storeSerive: StoreService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.getProjectList();
  }

  async getProjectList() {
    const [data]: any = await this.effect.updateProjects(this.WorkspaceID);
    this.projectList = data || [];
    this.initLoading = false;
  }

  editProject(item: any): void {
    const model = {
      name: item.name
    };
    const modal = this.modalService.create({
      nzTitle: $localize`Edit Project`,
      nzContent: OperateProjectFormComponent,
      nzComponentParams: {
        model
      },
      nzOnOk: async () => {
        this.storage.run('projectUpdate', [this.WorkspaceID, model, item.uuid], (result: StorageRes) => {
          if (result.status === StorageResStatus.success) {
            this.getProjectList();
            modal.destroy();
          }
        });
      }
    });
  }
  changeProject(item) {
    this.store.setCurrentProjectID(item.uuid);
  }
  delProject(item: any): void {
    const modal = this.modalService.confirm({
      nzTitle: 'Are you sure delete this project?',
      nzOkText: $localize`Delete`,
      nzOkDanger: true,
      nzOnOk: async () => {
        this.storage.run('projectRemove', [this.WorkspaceID, item.uuid], (result: StorageRes) => {
          if (result.status === StorageResStatus.success) {
            this.getProjectList();
            modal.destroy();
          }
        });
      }
    });
  }

  setListType(type: ListType) {
    this.listType = type;
    this.setting.set('workbench.list.type', type);
  }

  createProject() {
    const model = {
      name: ''
    };
    const modal = this.modalService.create({
      nzTitle: $localize`New Project`,
      nzContent: OperateProjectFormComponent,
      nzComponentParams: {
        model
      },
      nzOnOk: async () => {
        this.storage.run('projectCreate', [this.storeSerive.getCurrentWorkspace.id, model], (result: StorageRes) => {
          if (result.status === StorageResStatus.success) {
            this.getProjectList();
            modal.destroy();
          }
        });
      }
    });
  }
}
