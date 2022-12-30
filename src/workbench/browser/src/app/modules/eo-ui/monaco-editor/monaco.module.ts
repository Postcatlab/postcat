import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

import { EoIconparkIconModule } from '../iconpark-icon/eo-iconpark-icon.module';
import { EoMonacoEditorComponent } from './monaco-editor.component';

@NgModule({
  declarations: [EoMonacoEditorComponent],
  imports: [CommonModule, FormsModule, EoIconparkIconModule, NzCodeEditorModule],
  exports: [EoMonacoEditorComponent],
  schemas: []
})
export class EoMonacoEditorModule {}
