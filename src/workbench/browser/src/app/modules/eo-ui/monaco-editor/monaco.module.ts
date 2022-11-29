import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EoMonacoEditorComponent } from './monaco-editor.component';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

@NgModule({
  declarations: [EoMonacoEditorComponent],
  imports: [CommonModule, NzCodeEditorModule],
  exports: [EoMonacoEditorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EoMonacoEditorModule {}
