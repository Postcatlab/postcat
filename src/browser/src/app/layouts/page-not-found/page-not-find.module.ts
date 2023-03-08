import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EoNgButtonModule } from 'eo-ng-button';
import { NzResultModule } from 'ng-zorro-antd/result';

import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, EoNgButtonModule, NzResultModule]
})
export class PageNotFindModule {}
