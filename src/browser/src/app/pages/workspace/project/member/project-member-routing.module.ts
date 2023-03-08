import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectMemberComponent } from './project-member.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectMemberComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectMemberRoutingModule {}
