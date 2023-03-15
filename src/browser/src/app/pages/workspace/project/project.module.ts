import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ProjectRoutingModule } from 'pc/browser/src/app/pages/workspace/project/project-routing.module';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

@NgModule({
  imports: [ProjectRoutingModule, NzAvatarModule, NzCardModule, FormsModule, NzFormModule, SharedModule],
  declarations: []
})
export class ProjectModule {}
