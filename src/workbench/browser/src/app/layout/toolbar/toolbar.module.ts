import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { SharedModule } from '../../shared/shared.module';
import { SelectThemeComponent } from './select-theme/select-theme.component';

const COMPONENTS = [ToolbarComponent, ToolbarComponent,SelectThemeComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule,SharedModule],
  providers: [],
  exports: [...COMPONENTS]
})
export class ToolbarModule {}
