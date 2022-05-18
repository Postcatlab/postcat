import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageNotFoundComponent,
  SelectThemeComponent,
  ToolbarComponent,
  SidebarComponent,
  NavbarComponent,
} from './components';
import { WebviewDirective } from './directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ApiParamsNumPipe } from './pipes/api-param-num.pipe';
import { ModalService } from './services/modal.service';
import { PageBlankComponent } from './components/page-blank/page-blank.component';
import { PageFeaturePreviewComponent } from './components/page-feature-preview/page-feature-preview.component';
import { RouterModule } from '@angular/router';

const COMPONENTS = [ToolbarComponent, SelectThemeComponent, SidebarComponent, NavbarComponent, PageNotFoundComponent];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NzDrawerModule,
    NzRadioModule,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    NzResultModule,
    NzDropDownModule,
    NzSpinModule,
  ],
  declarations: [WebviewDirective, ...COMPONENTS, ApiParamsNumPipe, PageBlankComponent, PageFeaturePreviewComponent],
  providers: [ModalService],
  exports: [WebviewDirective, ...COMPONENTS, ApiParamsNumPipe],
})
export class SharedModule {}
