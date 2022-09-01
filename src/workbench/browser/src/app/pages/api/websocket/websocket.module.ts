import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';

import { WebsocketComponent } from './websocket.component';
import { WebsocketRoutingModule } from './websocket.routing.module';

const ANTDS = [NzButtonModule, NzInputModule];

@NgModule({
  imports: [WebsocketRoutingModule, FormsModule, ReactiveFormsModule, CommonModule, ...ANTDS],
  declarations: [WebsocketComponent],
  exports: [WebsocketComponent],
  providers: [],
})
export class WebsocketModule {}
