import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from '../../pages/workspace/workspace.service';
import { DataSourceService } from '../../shared/services/data-source/data-source.service';
import { MessageService } from '../../shared/services/message';
import { StatusService } from '../../shared/services/status.service';

@Component({
  selector: 'eo-select-workspace',
  template: ` <div
    class="flex items-center"
    eo-ng-dropdown
    [nzDropdownMenu]="workspaceMenu"
  >
    <eo-iconpark-icon
      class="mr-[5px]"
      name="link-cloud-{{ workspace.currentWorkspace?.id !== -1 ? 'sucess' : 'faild' }}"
    >
    </eo-iconpark-icon>
    {{ workspace.currentWorkspace.title }}
    <eo-iconpark-icon class="ml-[3px]" name="down"></eo-iconpark-icon>
    <eo-ng-dropdown-menu #workspaceMenu>
      <ul class="ml-[-11px]" nz-menu>
        <div class="flex py-[5px] px-[12px]">
          <input
            eo-ng-input
            type="text"
            class="flex-1 px-3 eo-search-input"
            i18n-placeholder
            placeholder="Search Workspace"
            [(ngModel)]="searchValue"
          />
          <button
            eoNgFeedbackTooltip
            i18n-nzTooltipTitle
            nzTooltipTitle="New Workspace"
            nzType="primary"
            eo-ng-button
            (click)="addWorkspace()"
            class="ml-3 flex items-center"
          >
            <eo-iconpark-icon name="plus"></eo-iconpark-icon>
          </button>
        </div>
        <li
          style="color: #000"
          nz-menu-item
          (click)="changeWorkspace(item)"
          [nzSelected]="workspace.currentWorkspace?.id === item.id"
          *ngFor="let item of searchWorkspace"
        >
          <eo-iconpark-icon class="mr-[5px]" name="link-cloud-{{ item.id !== -1 ? 'sucess' : 'faild' }}">
          </eo-iconpark-icon>
          {{ item.title }}
        </li>
      </ul>
    </eo-ng-dropdown-menu>
  </div>`,
})
export class SelectWorkspaceComponent implements OnInit {
  searchValue: string;

  constructor(
    public status: StatusService,
    private dataSourceService: DataSourceService,
    private message: MessageService,
    public workspace: WorkspaceService
  ) {
    if (this.workspace.currentWorkspace?.id !== -1) {
      this.workspace.getWorkspaceInfo(this.workspace.currentWorkspace.id);
    }
  }

  ngOnInit(): void {}
  changeWorkspace(item) {
    this.workspace.setCurrentWorkspace(item);
  }
  async addWorkspace() {
    this.dataSourceService.checkRemoteCanOperate(() => {
      this.message.send({ type: 'addWorkspace', data: {} });
    });
  }

  get searchWorkspace() {
    if (!this.searchValue) {
      return this.workspace.workspaceList;
    }
    const searchText = this.searchValue.toLocaleLowerCase();
    return this.workspace.workspaceList.filter((val) => val.title.toLocaleLowerCase().includes(searchText));
  }
}
