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
import { EoNgSwitchModule } from 'eo-ng-switch';
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
import { AuthorizationExtensionFormComponent } from 'pc/browser/src/app/pages/workspace/project/api/components/authorization-extension-form/authorization-extension-form.component';
import { ExtensionFeedbackComponent } from 'pc/browser/src/app/shared/components/extension-feedback/extension-feedback';
import { EoSchemaFormComponent } from 'pc/browser/src/app/shared/components/schema-form/schema-form.component';

import { EoIconparkIconModule } from '../components/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { DownloadClientModalComponent } from './components/download-client.component';
import { ExtensionAppComponent } from './components/extension-app/extension-app.component';
import { ClickStopPropagationDirective, FormFocusDirective } from './directives';
import { TraceDirective } from './directives/trace.directive';

const COMPONENTS = [
  DownloadClientModalComponent,
  ExtensionAppComponent,
  EoSchemaFormComponent,
  ExtensionFeedbackComponent,
  AuthorizationExtensionFormComponent
];
const DIRECTIVES = [ClickStopPropagationDirective, FormFocusDirective, TraceDirective];

const SHARED_UI_MODULE = [
  NzFormModule,
  EoNgButtonModule,
  EoNgDropdownModule,
  EoNgCheckboxModule,
  EoNgSwitchModule,
  EoNgSelectModule,
  EoNgInputModule,
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
];
const SHARED_MODULE = [CommonModule, FormsModule, RouterModule, ReactiveFormsModule];

@NgModule({
  imports: [...SHARED_MODULE, ...SHARED_UI_MODULE],
  declarations: [...COMPONENTS, ...DIRECTIVES],
  providers: [],
  exports: [...SHARED_MODULE, ...COMPONENTS, ...SHARED_UI_MODULE, ...DIRECTIVES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
