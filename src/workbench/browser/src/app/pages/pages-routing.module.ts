import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PageBlankComponent } from '../shared/components/page-blank/page-blank.component';
import { PageFeaturePreviewComponent } from '../shared/components/page-feature-preview/page-feature-preview.component';
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
        component:PageBlankComponent
      },
      {
        path: 'preview',
        component:PageFeaturePreviewComponent
      },
      {
        path: 'api',
        loadChildren: () => import('./api/api.module').then((m) => m.ApiModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
