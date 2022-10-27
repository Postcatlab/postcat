import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareComponent } from './share.component';

const routes: Routes = [
  {
    path: ':id',
    component: ShareComponent,
    children: [
      {
        path: 'http',
        children: [
          {
            path: 'detail',
            loadChildren: () => import('../pages/api/http/detail/api-detail.module').then((m) => m.ApiDetailModule),
          },
          {
            path: 'test',
            loadChildren: () => import('../pages/api/http/test/api-test.module').then((m) => m.ApiTestModule),
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
export class ShareRoutingModule {}
