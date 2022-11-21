import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PageBlankComponent } from '../shared/components/page-blank/page-blank.component';
import { ExtensionAppComponent } from 'eo/workbench/browser/src/app/shared/components/extension-app/extension-app.component';
import { Vue3Component } from 'eo/workbench/browser/src/app/pages/vue3/vue3.component';

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
        loadChildren: () => import('./share-project/share-project.module').then((m) => m.ShareProjectModule),
      },
      {
        path: 'member',
        loadChildren: () => import('./member.module').then((m) => m.MemberModule),
      },
      {
        path: 'extension',
        loadChildren: () => import('./extension/extension.module').then((m) => m.ExtensionModule),
      },
      {
        path: 'extensionSidebarView/:extName',
        component: ExtensionAppComponent,
      },
      {
        path: 'app-vue3',
        children: [
          {
            path: '**',
            component: Vue3Component,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
