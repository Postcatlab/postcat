import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PageBlankComponent } from '../shared/components/page-blank/page-blank.component';
import { ExtensionAppIframeComponent } from 'eo/workbench/browser/src/app/shared/components/extension-app/extension-app-iframe.component';

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
        loadChildren: () => import('./extension/extension.module').then((m) => m.ExtensionModule),
      },
      {
        path: 'workspace',
        loadChildren: () => import('./workspace.module').then((m) => m.WorkspaceModule),
      },
      {
        path: 'share',
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
      {
        path: 'extensionSidebarView/:extName',
        component: ExtensionAppIframeComponent,
      },
      // {
      //   path: 'app-vue3',
      //   children: [
      //     {
      //       path: '**',
      //       component: Vue3Component,
      //     },
      //   ],
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
