import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiComponent } from './api.component';
import { ApiDetailComponent } from './detail/api-detail.component';
import { ApiEditComponent } from './edit/api-edit.component';
import { ApiOverviewComponent } from './overview/api-overview.component';
import { ApiTestComponent } from './test/api-test.component';
import { ApiMockComponent } from './mock/api-mock.component';

const routes: Routes = [
  {
    path: '',
    component: ApiComponent,
    children: [
      {
        path: '',
        redirectTo: 'test',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: ApiOverviewComponent,
      },
      {
        path: 'detail',
        component: ApiDetailComponent,
      },
      {
        path: 'edit',
        component: ApiEditComponent,
      },
      {
        path: 'test',
        component: ApiTestComponent,
      },
      {
        path: 'mock',
        component: ApiMockComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiRoutingModule {}
