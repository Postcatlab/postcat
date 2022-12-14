import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { EoNgFeedbackMessageModule } from 'eo-ng-feedback';
import { EoNgInputModule } from 'eo-ng-input';
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/modules/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { OperateProjectFormComponent } from 'eo/workbench/browser/src/app/pages/project/components/operate-project-form.compoent';
import { ProjectRoutingModule } from 'eo/workbench/browser/src/app/pages/project/project-routing.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { ProjectComponent } from './project.component';

@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    EoNgButtonModule,
    EoIconparkIconModule,
    NzListModule,
    NzGridModule,
    NzCardModule,
    NzSkeletonModule,
    EoNgFeedbackMessageModule,
    EoNgDropdownModule,
    NzAvatarModule,
    FormsModule,
    ReactiveFormsModule,
    EoNgInputModule,
    NzFormModule
  ],
  declarations: [ProjectComponent, OperateProjectFormComponent]
})
export class ProjectModule {}
