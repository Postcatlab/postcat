import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExtensionRoutingModule } from './extension-routing.module';
import { ExtensionService } from './extension.service';
import { ExtensionComponent } from './extension.component';
import { ExtensionListComponent } from './list/extension-list.component';
import { ExtensionDetailComponent } from './detail/extension-detail.component';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';


@NgModule({
  imports: [FormsModule,NzTabsModule,NzTagModule,NzDescriptionsModule,NzInputModule,NzButtonModule,NzIconModule,ExtensionRoutingModule, CommonModule],
  providers:[ExtensionService],
  declarations: [ExtensionComponent, ExtensionListComponent, ExtensionDetailComponent],
})
export class ExtensionModule {}
