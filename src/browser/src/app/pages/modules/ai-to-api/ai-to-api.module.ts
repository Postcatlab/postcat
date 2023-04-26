import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgInputModule } from 'eo-ng-input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { EoIconparkIconModule } from 'pc/browser/src/app/components/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { AiInputGroupComponent } from 'pc/browser/src/app/pages/components/ai-input-group/ai-input-group.component';
import { AiToApiComponent } from 'pc/browser/src/app/pages/modules/ai-to-api/ai-to-api.component';
import { ApiEditUtilService } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit-util.service';
import { ApiEditModule } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit.module';
import { ApiEditService } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit.service';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/service/project-api.service';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

@NgModule({
  declarations: [AiToApiComponent],
  imports: [
    CommonModule,
    NzTagModule,
    EoNgInputModule,
    SharedModule,
    EoNgButtonModule,
    ApiEditModule,
    NzModalModule,
    NzIconModule,
    NzResultModule,
    AiInputGroupComponent
  ],
  providers: [ApiEditUtilService, ApiEditService],
  exports: [AiToApiComponent]
})
export class AiToApiModule {}
