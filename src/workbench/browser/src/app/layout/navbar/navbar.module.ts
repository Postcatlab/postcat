import { NgModule } from '@angular/core';
import { SettingModule } from '../../modules/setting/setting.module';
import { ShareProjectModule } from '../../pages/share-project/share-project.module';
import { SharedModule } from '../../shared/shared.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [SettingModule, ShareProjectModule, SharedModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
