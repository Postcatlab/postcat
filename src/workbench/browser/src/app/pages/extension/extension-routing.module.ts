import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



import { ExtensionDetailComponent } from './detail/extension-detail.component';
import { ExtensionListComponent } from './list/extension-list.component';
import { ExtensionComponent } from './extension.component';

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
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtensionRoutingModule {}
