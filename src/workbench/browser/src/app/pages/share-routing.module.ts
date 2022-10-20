import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareComponent } from './share.component';

const routes: Routes = [
  {
    path: '',
    component: ShareComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareRoutingModule {}
