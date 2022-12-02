import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { SharedModule } from '../../shared/shared.module';

const COMPONENTS = [ToolbarComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, SharedModule],
  providers: [],
  exports: [...COMPONENTS],
})
export class ToolbarModule {}
