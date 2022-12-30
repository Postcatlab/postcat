import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EoNgAutoCompleteModule } from 'eo-ng-auto-complete';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgCheckboxModule } from 'eo-ng-checkbox';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { EoNgFeedbackAlertModule, EoNgFeedbackTooltipModule, EoNgFeedbackMessageModule } from 'eo-ng-feedback';
import { EoNgInputModule } from 'eo-ng-input';
import { EoNgRadioModule } from 'eo-ng-radio';
import { EoNgSelectModule } from 'eo-ng-select';
import { DownloadClienteComponent } from 'eo/workbench/browser/src/app/shared/components/download-client.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { EoIconparkIconModule } from '../modules/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { ExtensionAppComponent } from './components/extension-app/extension-app.component';
import { ClickStopPropagationDirective, FormFocusDirective } from './directives';

const COMPONENTS = [DownloadClienteComponent, ExtensionAppComponent];
const DIRECTIVES = [ClickStopPropagationDirective, FormFocusDirective];
const SHARED_UI_MODULE = [
  NzFormModule,
  EoNgButtonModule,
  EoNgCheckboxModule,
  EoNgSelectModule,
  EoNgInputModule,
  EoNgDropdownModule,
  EoNgRadioModule,
  EoNgAutoCompleteModule,
  EoNgFeedbackMessageModule,
  EoNgFeedbackAlertModule,
  EoNgFeedbackTooltipModule,
  EoIconparkIconModule,
  NzSkeletonModule,
  NzTypographyModule,
  NzPopoverModule,
  NzDividerModule,
  NzSpinModule,
  NzEmptyModule,
  NzModalModule,
  NzListModule,
  NzPopconfirmModule
] as const;
const SHARED_MODULE = [CommonModule, FormsModule, RouterModule, ReactiveFormsModule] as const;

@NgModule({
  imports: [...SHARED_MODULE, ...SHARED_UI_MODULE],
  declarations: [...COMPONENTS, ...DIRECTIVES],
  providers: [],
  exports: [...SHARED_MODULE, ...COMPONENTS, ...SHARED_UI_MODULE, ...DIRECTIVES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
