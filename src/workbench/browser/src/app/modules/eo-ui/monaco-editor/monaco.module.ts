import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EoMonacoEditorComponent } from './monaco-editor.component';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { FormsModule } from '@angular/forms';
import { EoIconparkIconModule } from '../iconpark-icon/eo-iconpark-icon.module';

@NgModule({
  declarations: [EoMonacoEditorComponent],
  imports: [CommonModule,FormsModule,EoIconparkIconModule, NzCodeEditorModule],
  exports: [EoMonacoEditorComponent],
  schemas: [],
})
export class EoMonacoEditorModule {}
