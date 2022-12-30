import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectRoutingModule } from 'eo/workbench/browser/src/app/pages/workspace/project/project-routing.module';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  imports: [ProjectRoutingModule, NzAvatarModule, NzCardModule, FormsModule, NzFormModule, SharedModule],
  declarations: []
})
export class ProjectModule {}
