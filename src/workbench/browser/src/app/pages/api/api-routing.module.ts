import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiComponent } from './api.component';
import { ApiOverviewComponent } from './overview/api-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ApiComponent,
    children: [
      {
        path: '',
        redirectTo: 'test',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: ApiOverviewComponent,
      },
      {
        path: 'detail',
        loadChildren: () => import('./detail/api-detail.module').then((m) => m.ApiDetailModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./edit/api-edit.module').then((m) => m.ApiEditModule),
      },
      {
        path: 'test',
        loadChildren: () => import('./test/api-test.module').then((m) => m.ApiTestModule),
      },
      {
        path: 'mock',
        loadChildren: () => import('./mock/api-mock.module').then((m) => m.ApiMockModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiRoutingModule {}
