import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'api',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadChildren: () => import('./list/project-list.module').then(m => m.ProjectListModule)
  },
  {
    path: 'api',
    loadChildren: () => import('./api/api.module').then(m => m.ApiModule)
  },

  {
    path: 'member',
    loadChildren: () => import('./member/project-member.module').then(m => m.ProjectMemberModule)
  },

  {
    path: 'setting',
    loadChildren: () => import('./setting/project-setting.module').then(m => m.ProjectSettingModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
