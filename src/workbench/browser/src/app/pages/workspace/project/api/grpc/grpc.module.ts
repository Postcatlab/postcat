import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';

import { GrpcRoutingModule } from './grpc-routing.module';
import { GrpcComponent } from './grpc.component';

@NgModule({
  imports: [SharedModule, FormsModule, CommonModule, GrpcRoutingModule],
  declarations: [GrpcComponent]
})
export class GrpcModule {}
