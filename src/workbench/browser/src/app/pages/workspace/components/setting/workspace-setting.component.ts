import { Component, Input, OnInit } from '@angular/core';

import { SettingItem } from '../../../../modules/eo-ui/setting/setting.component';
import { WorkspaceDeleteComponent } from '../delete/workspace-delete.component';
import { WorkspaceEditComponent } from '../edit/workspace-edit.component';
import { WorkspaceMemberComponent } from '../member/workspace-member.component';

@Component({
  selector: 'eo-workspace-setting',
  template: ` <eo-setting [selectedModule]="selectedModule" [nzData]="treeNodes"></eo-setting>`,
  styleUrls: ['./workspace-setting.component.scss']
})
export class WorkspaceSettingComponent implements OnInit {
  constructor() {}
  @Input() selectedModule: string;
  treeNodes: SettingItem[] = [
    {
      title: $localize`General`,
      id: 'general',
      comp: WorkspaceEditComponent
    },
    {
      title: $localize`Member`,
      id: 'member',
      comp: WorkspaceMemberComponent
    },
    {
      title: $localize`Delete`,
      id: 'delete',
      comp: WorkspaceDeleteComponent
    }
  ];
  ngOnInit(): void {
    console.log(1);
  }
}
