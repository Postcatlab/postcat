import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TraceService } from 'pc/browser/src/app/services/trace.service';

import { SettingService } from '../../../../components/system-setting/settings.service';
import { ModalService } from '../../../../services/modal.service';
import { EffectService } from '../../../../store/effect.service';
import { StoreService } from '../../../../store/state.service';
import { OperateProjectFormComponent } from '../../project/components/operate-project-form.compoent';
type ListType = 'list' | 'card';
@Injectable({
  providedIn: 'root'
})
export class ProjectListService {
  listType: ListType;
  initLoading = true;
  constructor(
    private setting: SettingService,
    private modalService: ModalService,
    private store: StoreService,
    private effect: EffectService,
    private router: Router,
    private trace: TraceService
  ) {
    this.listType = this.setting.get('workbench.list.type') || 'list';
  }
  setListType(type: ListType) {
    this.listType = type;
    this.setting.set('workbench.list.type', type);
  }
  async getProjectList() {
    this.initLoading = true;
    this.store.setProjectList([]);
    const [data]: any = await this.effect.updateProjects(this.store.getCurrentWorkspaceUuid);
    this.initLoading = false;
    return data;
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
        const workspace_type = this.store.isLocal ? 'local' : 'cloud';
        this.trace.report('add_project_success', { workspace_type });

        // * update project list
        this.getProjectList();

        //* jump to project list
        const path = '/home/workspace/overview/projects';
        if (this.router.url !== path) {
          this.router.navigate([path]);
        }
        modal.destroy();
      }
    });
  }
}
