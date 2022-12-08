import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzResultModule } from 'ng-zorro-antd/result';

import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, NzResultModule],
})
export class PageNotFindModule {}
