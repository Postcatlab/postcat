import { NgModule } from '@angular/core'

import { CommonModule } from '@angular/common'
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { FormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'

import { MemberRoutingModule } from './member-routing.module'
import { MemberComponent } from './member.component'

@NgModule({
  imports: [
    MemberRoutingModule,
    CommonModule,
    NzModalModule,
    NzInputModule,
    FormsModule,
    NzButtonModule
  ],
  declarations: [MemberComponent],
  exports: [],
  providers: [NzModalService]
})
export class MemberModule {}
