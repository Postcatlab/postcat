import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgFeedbackTooltipModule } from 'eo-ng-feedback';
import { EoNgInputModule } from 'eo-ng-input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { EoIconparkIconModule } from 'pc/browser/src/app/components/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { AiInputGroupComponent } from 'pc/browser/src/app/pages/components/ai-input-group/ai-input-group.component';
import { AiToApiComponent } from 'pc/browser/src/app/pages/modules/ai-to-api/ai-to-api.component';
import { API_TABS } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import { BASIC_TABS_INFO, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiEditUtilService } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit-util.service';
import { ApiEditModule } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit.module';
import { ApiEditService } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit.service';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/service/project-api.service';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';
const tabs = API_TABS.map(val => ({ ...val, pathname: `/home/workspace/project/api${val.pathname}` }));
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
    AiInputGroupComponent,
    NzAlertModule,
    EoNgFeedbackTooltipModule,
    NzToolTipModule
  ],
  providers: [
    {
      provide: BASIC_TABS_INFO,
      useValue: {
        BASIC_TABS: tabs,
        pathByName: tabs.reduce((acc, curr) => ({ ...acc, [curr.uniqueName]: curr.pathname }), {})
      } as TabsConfig
    },
    ApiEditUtilService,
    ApiEditService
  ],
  exports: [AiToApiComponent]
})
export class AiToApiModule {}
