import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EoNgButtonModule } from 'eo-ng-button';

import { EoMonacoEditorModule } from '../eo-ui/monaco-editor/monaco.module';
import { DebugThemeComponent } from './debug-theme/debug-theme.component';
import { PcConsoleComponent } from './pc-console/pc-console.component';
@NgModule({
  declarations: [PcConsoleComponent, DebugThemeComponent],
  imports: [CommonModule, EoNgButtonModule, EoMonacoEditorModule],
  exports: [PcConsoleComponent]
})
export class PcConsoleModule {}
