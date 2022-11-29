import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found.component';
import { NzResultModule } from 'ng-zorro-antd/result';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, NzResultModule],
})
export class PageNotFindModule {}
