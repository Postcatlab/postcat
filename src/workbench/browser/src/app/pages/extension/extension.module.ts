import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtensionRoutingModule } from './extension-routing.module';
import { ExtensionService } from './extension.service';
import { ExtensionComponent } from './extension.component';
import { ExtensionListComponent } from './list/extension-list.component';
import { ExtensionDetailComponent } from './detail/extension-detail.component';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  imports: [NzInputModule,NzIconModule,ExtensionRoutingModule, CommonModule],
  providers:[ExtensionService],
  declarations: [ExtensionComponent, ExtensionListComponent, ExtensionDetailComponent],
})
export class ExtensionModule {}
