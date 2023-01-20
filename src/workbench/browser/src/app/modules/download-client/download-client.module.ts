import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgDropdownModule } from 'eo-ng-dropdown';

import { EoIconparkIconModule } from '../eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { DownloadClientComponent } from './download-client.component';

@NgModule({
  imports: [CommonModule, EoIconparkIconModule, EoNgButtonModule, EoNgDropdownModule],
  declarations: [DownloadClientComponent],
  exports: [DownloadClientComponent]
})
export class DownloadClientModule {}
