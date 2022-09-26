import { NgModule } from '@angular/core'

import { CommonModule } from '@angular/common'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { ReactiveFormsModule } from '@angular/forms'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzButtonModule } from 'ng-zorro-antd/button'

import { WorkspaceRoutingModule } from './workspace-routing.module'
import { WorkspaceComponent } from './workspace.component'

@NgModule({
  imports: [
    WorkspaceRoutingModule,
    CommonModule,
    NzDividerModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule
  ],
  declarations: [WorkspaceComponent],
  exports: [],
  providers: []
})
export class WorkspaceModule {}
