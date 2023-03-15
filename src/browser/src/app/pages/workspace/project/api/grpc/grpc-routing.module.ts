import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrpcComponent } from './grpc.component';

const routes: Routes = [
  {
    path: '',
    component: GrpcComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrpcRoutingModule {}
