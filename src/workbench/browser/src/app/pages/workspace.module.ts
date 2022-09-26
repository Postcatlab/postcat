import { NgModule } from '@angular/core'

import { CommonModule } from '@angular/common'
import { NzButtonModule } from 'ng-zorro-antd/button'

import { WorkspaceRoutingModule } from './workspace-routing.module'
import { WorkspaceComponent } from './workspace.component'

@NgModule({
  imports: [WorkspaceRoutingModule, CommonModule, NzButtonModule],
  declarations: [WorkspaceComponent],
  exports: [],
  providers: []
})
export class WorkspaceModule {}
