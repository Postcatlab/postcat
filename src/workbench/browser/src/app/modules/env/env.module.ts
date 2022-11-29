import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EnvComponent } from './env/env.component';
import { EnvListComponent } from './env-list/env-list.component';

import { EoTableProModule } from '../eo-ui/table-pro/table-pro.module';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';

const ANTDMODULES = [EoTableProModule];
@NgModule({
  declarations: [EnvComponent, EnvListComponent],
  imports: [FormsModule, CommonModule, SharedModule, ...ANTDMODULES],
  exports: [EnvComponent, EnvListComponent],
})
export class EnvModule {}
