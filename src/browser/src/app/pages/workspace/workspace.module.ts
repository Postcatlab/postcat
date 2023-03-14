import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { EoSettingModule } from '../../components/eo-ui/setting/setting.module';
import { SharedModule } from '../../shared/shared.module';
import { WorkspaceComponent } from './workspace.component';

@NgModule({
  declarations: [WorkspaceComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'project',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadChildren: () => import('./overview/workspace-overview.module').then(m => m.WorkspaceOverviewModule)
      },
      {
        path: '',
        component: WorkspaceComponent,
        children: [
          {
            path: 'project',
            loadChildren: () => import('./project/project.module').then(m => m.ProjectModule)
          }
        ]
      }
    ]),
    NzCardModule,
    NzFormModule,
    EoSettingModule,
    SharedModule,
    NzUploadModule,
    NzAvatarModule
  ]
})
export class WorkspaceModule {
  constructor() {}
}
