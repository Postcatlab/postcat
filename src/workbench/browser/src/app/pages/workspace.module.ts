import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ApiOverviewComponent } from 'eo/workbench/browser/src/app/pages/api/overview/api-overview.component';
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/eoui/iconpark-icon/eo-iconpark-icon.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';

@NgModule({
  imports: [
    WorkspaceRoutingModule,
    CommonModule,
    EoIconparkIconModule,
    NzDividerModule,
    NzCardModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
  ],
  declarations: [WorkspaceComponent, ApiOverviewComponent],
  exports: [],
  providers: [MessageService],
})
export class WorkspaceModule {}
