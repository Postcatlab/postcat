import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtensionAppComponent } from 'pc/browser/src/app/shared/components/extension-app/extension-app.component';

import { RedirectProjectID } from '../../services/redirect.services';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'api',
    pathMatch: 'full'
  },
  {
    path: 'api',
    canActivate: [RedirectProjectID],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./api/api.module').then(m => m.ApiModule)
  },
  {
    path: 'member',
    canActivate: [RedirectProjectID],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./member/project-member.module').then(m => m.ProjectMemberModule)
  },

  {
    path: 'setting',
    canActivate: [RedirectProjectID],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./setting/project-setting.module').then(m => m.ProjectSettingModule)
  },
  {
    path: 'extensionSidebarView/:extName',
    component: ExtensionAppComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [RedirectProjectID],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
