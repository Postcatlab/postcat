import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtensionDetailComponent } from './detail/extension-detail.component';
import { ExtensionListComponent } from './list/extension-list.component';
import { ExtensionComponent } from './extension.component';
import { Vue3Component } from 'eo/workbench/browser/src/app/pages/vue3/vue3.component';

const routes: Routes = [
  {
    path: '',
    component: ExtensionComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ExtensionListComponent,
      },
      {
        path: 'detail',
        component: ExtensionDetailComponent,
        children: [
          {
            path: 'custom-tab',
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
export class ExtensionRoutingModule {}
