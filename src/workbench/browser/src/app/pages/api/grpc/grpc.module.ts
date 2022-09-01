import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GrpcComponent } from './grpc.component';
import { GrpcRoutingModule } from './grpc-routing.module';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule, FormsModule, CommonModule, GrpcRoutingModule],
  declarations: [GrpcComponent],
})
export class GrpcModule {}
