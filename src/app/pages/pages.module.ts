import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';

import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PagesComponent],
  imports: [PagesRoutingModule, FormsModule, SharedModule],
  exports: []
})
export class PagesModule {}
