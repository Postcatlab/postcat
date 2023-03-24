import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoMonacoEditorModule } from 'pc/browser/src/app/components/eo-ui/monaco-editor/monaco.module';
import { MockComponent } from 'pc/browser/src/app/pages/workspace/project/api/http/mocknew/mock.component';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

@NgModule({
  declarations: [MockComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MockComponent
      }
    ]),
    CommonModule,
    SharedModule,
    EoMonacoEditorModule
  ]
})
export class MockModule {}
