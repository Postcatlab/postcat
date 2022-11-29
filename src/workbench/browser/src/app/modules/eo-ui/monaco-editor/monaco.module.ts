import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EoMonacoEditorComponent } from './monaco-editor.component';

@NgModule({
  declarations: [EoMonacoEditorComponent],
  imports: [CommonModule],
  exports: [EoMonacoEditorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EoMonacoEditorModule {}
