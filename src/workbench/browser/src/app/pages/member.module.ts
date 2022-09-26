import { NgModule } from '@angular/core'

import { CommonModule } from '@angular/common'
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal'
import { NzButtonModule } from 'ng-zorro-antd/button'

import { MemberRoutingModule } from './member-routing.module'
import { MemberComponent } from './member.component'

@NgModule({
  imports: [MemberRoutingModule, CommonModule, NzModalModule, NzButtonModule],
  declarations: [MemberComponent],
  exports: [],
  providers: [NzModalService]
})
export class MemberModule {}
