import { NgModule } from '@angular/core';
import { EoNgAutoCompleteModule } from 'eo-ng-auto-complete';
import { EoNgSwitchModule } from 'eo-ng-switch';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { EoNgTreeModule } from 'eo-ng-tree';
import { ExtensionDetailComponent } from 'eo/workbench/browser/src/app/pages/extension/detail/extension-detail.component';
import { DownloadCountFormaterPipe } from 'eo/workbench/browser/src/app/pages/extension/download-count-formater.pipe';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';

// import { ExtensionRoutingModule } from './extension-routing.module';
import { ShadowDomEncapsulationModule } from '../../modules/eo-ui/shadow/shadow-dom-encapsulation.module';
import { ExtensionSettingComponent } from './detail/components/extensions-settings.component';
import { ExtensionComponent } from './extension.component';
import { ExtensionListComponent } from './list/extension-list.component';

@NgModule({
  imports: [
    SharedModule,
    NzDescriptionsModule,
    NzInputNumberModule,
    NzCardModule,
    NzAvatarModule,
    EoNgTabsModule,
    EoNgSwitchModule,
    EoNgTreeModule,
    NzResultModule,
    ShadowDomEncapsulationModule,
    NzTagModule,
    EoNgAutoCompleteModule,
    NzSpaceModule
  ],
  declarations: [ExtensionComponent, ExtensionSettingComponent, ExtensionListComponent, ExtensionDetailComponent, DownloadCountFormaterPipe]
})
export class ExtensionModule {}
