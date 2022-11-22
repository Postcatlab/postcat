import { NgModule } from '@angular/core';
import { NavbarComponent } from 'eo/workbench/browser/src/app/pages/navbar/navbar.component';
import { SettingModule } from 'eo/workbench/browser/src/app/shared/components/setting/setting.module';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { ShareProjectModule } from '../share-project/share-project.module';

@NgModule({
  imports: [SettingModule,ShareProjectModule, SharedModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
