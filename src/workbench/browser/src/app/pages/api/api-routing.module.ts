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
        redirectTo: 'http',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: ApiOverviewComponent,
      },
      {
        path: 'http',
        children: [
          {
            path: 'detail',
            loadChildren: () => import('./http/detail/api-detail.module').then((m) => m.ApiDetailModule),
          },
          {
            path: 'edit',
            loadChildren: () => import('./http/edit/api-edit.module').then((m) => m.ApiEditModule),
          },
          {
            path: 'test',
            loadChildren: () => import('./http/test/api-test.module').then((m) => m.ApiTestModule),
          },
          {
            path: 'mock',
            loadChildren: () => import('./http/mock/api-mock.module').then((m) => m.ApiMockModule),
          },
        ],
      },
      {
        path: 'ws',
        children: [
          {
            path: 'test',
            loadChildren: () => import('./websocket/websocket.module').then((m) => m.WebsocketModule),
          },
        ]
      },
      // {
      //   path: 'grpc',
      //   loadChildren: () => import('./grpc/grpc.module').then((m) => m.GrpcModule),
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiRoutingModule {}
