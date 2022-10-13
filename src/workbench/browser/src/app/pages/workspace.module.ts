import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NzModalRef, NzModalService, NzModalModule } from 'ng-zorro-antd/modal'
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service'
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service'
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { ApiOverviewComponent } from 'eo/workbench/browser/src/app/pages/api/overview/api-overview.component'
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/eoui/iconpark-icon/eo-iconpark-icon.module'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzCardModule } from 'ng-zorro-antd/card'
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
    NzModalModule,
    EoIconparkIconModule,
    NzDividerModule,
    NzCardModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule
  ],
  declarations: [WorkspaceComponent, ApiOverviewComponent],
  exports: [],
  providers: [NzModalService, MessageService, RemoteService]
})
export class WorkspaceModule {}
