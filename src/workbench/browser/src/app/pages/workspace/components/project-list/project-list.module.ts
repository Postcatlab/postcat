import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OperateProjectFormComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/components/operate-project-form.compoent';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';

import { ProjectListComponent } from './project-list.component';

@NgModule({
  imports: [NzEmptyModule, NzAvatarModule, NzCardModule, FormsModule, NzFormModule, SharedModule],
  declarations: [ProjectListComponent, OperateProjectFormComponent],
  exports: [ProjectListComponent]
})
export class ProjectListModule {}
