import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { FormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service'
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service'
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service'
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service'
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service'
import { distinct } from 'rxjs/operators'
import { interval } from 'rxjs'
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service'
import { ManageAccessComponent } from 'eo/workbench/browser/src/app/shared/components/manage-access/manage-access.component'
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module'

import { MemberRoutingModule } from './member-routing.module'
import { MemberComponent } from './member.component'

@NgModule({
  imports: [
    MemberRoutingModule,
    CommonModule,
    NzModalModule,
    NzInputModule,
    FormsModule,
    NzButtonModule,
    SharedModule
  ],
  declarations: [MemberComponent, ManageAccessComponent],
  exports: [],
  providers: [NzModalService, MessageService, RemoteService]
})
export class MemberModule {}
