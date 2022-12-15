import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OperateProjectFormComponent } from 'eo/workbench/browser/src/app/pages/project/components/operate-project-form.compoent';
import { ProjectRoutingModule } from 'eo/workbench/browser/src/app/pages/project/project-routing.module';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';

import { ProjectComponent } from './project.component';

@NgModule({
  imports: [ProjectRoutingModule, NzAvatarModule, NzCardModule, FormsModule, NzFormModule, SharedModule],
  declarations: [ProjectComponent, OperateProjectFormComponent]
})
export class ProjectModule {}
