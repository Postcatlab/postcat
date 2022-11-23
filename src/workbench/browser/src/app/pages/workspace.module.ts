import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/modules/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { EoNgButtonModule } from 'eo-ng-button';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { ApiOverviewComponent } from './workspace/overview/api-overview.component';

@NgModule({
  imports: [
    WorkspaceRoutingModule,
    CommonModule,
    NzModalModule,
    EoIconparkIconModule,
    NzDividerModule,
    NzCardModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    EoNgButtonModule,
  ],
  declarations: [WorkspaceComponent,ApiOverviewComponent],
  exports: [],
  providers: [NzModalService],
})
export class WorkspaceModule {}
