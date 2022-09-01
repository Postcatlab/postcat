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
