import { Component, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { OperateProjectFormComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/components/operate-project-form.compoent';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
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
  listType: ListType;
  initLoading = true;
  projectList: any[] = [];

  get WorkspaceID() {
    return this.store.getCurrentWorkspaceUuid;
  }

  constructor(
    private apiService: ApiService,
    private setting: SettingService,
    private effect: EffectService,
    private store: StoreService,
    private modalService: ModalService
  ) {
    this.listType = this.setting.get('workbench.list.type') || 'list';
  }

  async ngOnInit(): Promise<void> {
    await this.getProjectList();
  }

  async getProjectList() {
    const [data]: any = await this.effect.updateProjects(this.WorkspaceID);
    this.projectList = data || [];
    this.initLoading = false;
  }

  editProject(item: any): void {
    const model = {
      ...item,
      name: item.name
    };
    const modal = this.modalService.create({
      nzTitle: $localize`Edit Project`,
      nzContent: OperateProjectFormComponent,
      nzComponentParams: {
        model
      },
      nzOnOk: async () => {
        await this.effect.updateProject(model);
        this.getProjectList();
        modal.destroy();
      }
    });
  }
  changeProject(item) {
    this.effect.switchProject(item.projectUuid);
  }
  delProject(item: any): void {
    const modal = this.modalService.confirm({
      nzTitle: $localize`Are you sure delete this project?`,
      nzOkText: $localize`Delete`,
      nzOkDanger: true,
      nzOnOk: async () => {
        const [, err] = await this.apiService.api_projectDelete({ projectUuids: [item.projectUuid] });
        if (err) {
          return;
        }
        // * update project list
        this.getProjectList();
        modal.destroy();
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
        if (!model.name) {
          return;
        }
        await this.effect.createProject([model]);

        // * update project list
        this.getProjectList();
        modal.destroy();
      }
    });
  }
}
