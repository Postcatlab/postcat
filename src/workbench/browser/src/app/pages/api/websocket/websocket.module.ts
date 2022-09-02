import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { Ng1Module } from '../../../ng1/ng1.module';
import { ApiEditUtilService } from '../http/edit/api-edit-util.service';

import { WebsocketComponent } from './websocket.component';
import { WebsocketRoutingModule } from './websocket.routing.module';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';

const ANTDS = [NzButtonModule, NzInputModule, NzSelectModule, NzTabsModule];

@NgModule({
  imports: [WebsocketRoutingModule, FormsModule, Ng1Module, ReactiveFormsModule, CommonModule, SharedModule, ...ANTDS],
  declarations: [WebsocketComponent],
  exports: [WebsocketComponent],
  providers: [ApiEditUtilService],
})
export class WebsocketModule {}
