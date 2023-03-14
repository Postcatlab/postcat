import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupComponent } from 'pc/browser/src/app/pages/workspace/project/api/group/group.component';

import { ShareComponent } from './view/share-project.component';

const routes: Routes = [
  {
    path: '',
    component: ShareComponent,
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
            path: 'detail',
            loadChildren: () => import('../workspace/project/api/http/detail/api-detail.module').then(m => m.ApiDetailModule)
          },
          {
            path: 'test',
            loadChildren: () => import('../workspace/project/api/http/test/api-test.module').then(m => m.ApiTestModule)
          }
        ]
      },
      {
        path: 'ws',
        children: [
          {
            path: 'test',
            loadChildren: () => import('../workspace/project/api/websocket/websocket.module').then(m => m.WebsocketModule)
          }
        ]
      },
      {
        path: 'group',
        children: [
          {
            path: 'edit',
            component: GroupComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareRoutingModule {}
