import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PageBlankComponent } from '../shared/components/page-blank/page-blank.component';
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'api',
        pathMatch: 'full',
      },
      {
        path: 'blank',
        component: PageBlankComponent,
      },
      {
        path: 'api',
        loadChildren: () => import('./api/api.module').then((m) => m.ApiModule),
      },
      {
        path: 'workspace',
        loadChildren: () => import('./workspace.module').then((m) => m.WorkspaceModule),
      },
      {
        path: 'share',
        // redirectTo: 'api',
        // pathMatch: 'full',
        loadChildren: () => import('./share.module').then((m) => m.ShareModule),
      },
      {
        path: 'member',
        loadChildren: () => import('./member.module').then((m) => m.MemberModule),
      },
      {
        path: 'extension',
        loadChildren: () => import('./extension/extension.module').then((m) => m.ExtensionModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
