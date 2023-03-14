import { Component, OnInit } from '@angular/core';
import { autorun } from 'mobx';
import { OperateProjectFormComponent } from 'pc/browser/src/app/pages/workspace/project/components/operate-project-form.compoent';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';

import { EffectService } from '../../../../store/effect.service';
import { StoreService } from '../../../../store/state.service';
import { ProjectListService } from './project-list.service';

@Component({
  selector: 'eo-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projectList: any[] = [];

  constructor(
    public projectListService: ProjectListService,
    private apiService: ApiService,
    private store: StoreService,
    private effect: EffectService,
    private modalService: ModalService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getProjectList();
    autorun(() => {
      this.projectList = this.store.getProjectList;
    });
  }
  async getProjectList(): Promise<void> {
    await this.projectListService.getProjectList();
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
}
