import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DownloadClientComponent } from 'pc/browser/src/app/components/download-client/download-client.component';
import { EoMonacoEditorModule } from 'pc/browser/src/app/components/eo-ui/monaco-editor/monaco.module';
import { MockComponent } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/mock.component';
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
    EoMonacoEditorModule,
    DownloadClientComponent,
    NzResultModule,
    NzToolTipModule
  ]
})
export class MockModule {}
