import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { EoSettingModule } from '../../modules/eo-ui/setting/setting.module';
import { SharedModule } from '../../shared/shared.module';
import { WorkspaceDeleteComponent } from './components/delete/workspace-delete.component';
import { WorkspaceEditComponent } from './components/edit/workspace-edit.component';
import { WorkspaceMemberComponent } from './components/member/workspace-member.component';
import { WorkspaceSettingComponent } from './components/setting/workspace-setting.component';

@NgModule({
  declarations: [WorkspaceSettingComponent, WorkspaceEditComponent, WorkspaceMemberComponent, WorkspaceDeleteComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'project',
        pathMatch: 'full'
      },
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule)
      }
    ]),
    NzCardModule,
    NzFormModule,
    EoSettingModule,
    SharedModule,
    NzUploadModule
  ]
})
export class WorkspaceModule {}
