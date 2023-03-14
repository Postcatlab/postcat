import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebsocketComponent } from './websocket.component';

const routes: Routes = [
  {
    path: '',
    component: WebsocketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsocketRoutingModule {}
