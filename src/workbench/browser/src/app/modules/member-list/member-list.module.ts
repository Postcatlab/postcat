import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzListModule } from 'ng-zorro-antd/list';

import { EoIconparkIconModule } from '../eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { MemberListComponent } from './member-list.component';

@NgModule({
  declarations: [MemberListComponent],
  imports: [CommonModule, NzListModule, EoNgDropdownModule, NzAvatarModule, EoIconparkIconModule, EoNgButtonModule],
  exports: [MemberListComponent]
})
export class MemberListModule {}
