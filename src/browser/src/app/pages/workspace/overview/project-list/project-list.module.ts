import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { OperateProjectFormComponent } from 'pc/browser/src/app/pages/workspace/project/components/operate-project-form.compoent';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

import { ProjectListComponent } from './project-list.component';
import { ProjectListService } from './project-list.service';

@NgModule({
  imports: [
    NzEmptyModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectListComponent
      }
    ]),
    NzAvatarModule,
    NzCardModule,
    FormsModule,
    NzFormModule,
    SharedModule
  ],
  declarations: [ProjectListComponent, OperateProjectFormComponent],
  exports: [ProjectListComponent]
})
export class ProjectListModule {}
