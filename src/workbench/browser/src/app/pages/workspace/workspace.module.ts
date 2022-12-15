import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkspaceComponent } from 'eo/workbench/browser/src/app/pages/workspace/workspace.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WorkspaceComponent
      }
    ]),
    NzCardModule,
    CommonModule,
    NzFormModule,
    SharedModule,
    NzUploadModule
  ]
})
export class WorkspaceModule {}
