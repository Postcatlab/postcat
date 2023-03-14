import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiComponent } from './api.component';

const routes: Routes = [
  {
    path: '',
    component: ApiComponent,
    children: [
      {
        path: '',
        redirectTo: 'http',
        pathMatch: 'full'
      },
      {
        path: 'http',
        children: [
          {
            path: '',
            redirectTo: 'test',
            pathMatch: 'full'
          },
          {
            path: 'detail',
            loadChildren: () => import('./http/detail/api-detail.module').then(m => m.ApiDetailModule)
          },
          {
            path: 'edit',
            loadChildren: () => import('./http/edit/api-edit.module').then(m => m.ApiEditModule)
          },
          {
            path: 'test',
            loadChildren: () => import('./http/test/api-test.module').then(m => m.ApiTestModule)
          },
          {
            path: 'mock',
            loadChildren: () => import('./http/mock/api-mock.module').then(m => m.ApiMockModule)
          }
        ]
      },
      {
        path: 'ws',
        children: [
          {
            path: 'test',
            loadChildren: () => import('./websocket/websocket.module').then(m => m.WebsocketModule)
          }
        ]
      },
      {
        path: 'env',
        loadChildren: () => import('./env/env.module').then(m => m.EnvModule)
      },
      {
        path: 'group',
        loadChildren: () => import('./group/group.module').then(m => m.GroupModule)
      }
      // {
      //   path: 'grpc',
      //   loadChildren: () => import('./grpc/grpc.module').then((m) => m.GrpcModule),
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiRoutingModule {}
