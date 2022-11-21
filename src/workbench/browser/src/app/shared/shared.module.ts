import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent, ToolbarComponent, SidebarComponent } from './components';
import { ClickStopPropagationDirective } from './directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgCheckboxModule } from 'eo-ng-checkbox';
import { EoNgSelectModule } from 'eo-ng-select';
import { EoNgSwitchModule } from 'eo-ng-switch';
import { EoNgTreeModule } from 'eo-ng-tree';

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzResultModule } from 'ng-zorro-antd/result';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ApiParamsNumPipe } from './pipes/api-param-num.pipe';
import { PageBlankComponent } from './components/page-blank/page-blank.component';
import { RouterModule } from '@angular/router';
import { ShadowDomEncapsulationComponent } from 'eo/workbench/browser/src/app/shared/components/shadow/shadow-dom-encapsulation.component';
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/eoui/iconpark-icon/eo-iconpark-icon.module';
import { ApiScriptComponent } from './components/api-script/api-script.component';
import { EouiModule } from 'eo/workbench/browser/src/app/eoui/eoui.module';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { EnvListComponent } from 'eo/workbench/browser/src/app/shared/components/env-list/env-list.component';
import { SplitPanelComponent } from 'eo/workbench/browser/src/app/shared/components/split-panel/split.panel.component';
import { SplitXComponent } from 'eo/workbench/browser/src/app/shared/components/split-x/split-x.component';
import { EoMonacoEditorComponent } from 'eo/workbench/browser/src/app/shared/components/monaco-editor/monaco-editor.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { DownloadClienteComponent } from 'eo/workbench/browser/src/app/core/services/web/download-client.component';
import { LocalWorkspaceTipComponent } from './components/local-workspace-tip/local-workspace-tip.component';
import { ExtensionAppComponent } from './components/extension-app/extension-app.component';
import { NzSelectModule } from 'ng-zorro-antd/select';

const COMPONENTS = [
  ToolbarComponent,
  ShadowDomEncapsulationComponent,
  SidebarComponent,
  PageNotFoundComponent,
  ApiScriptComponent,
  SplitPanelComponent,
  SplitXComponent,
  EoMonacoEditorComponent,
  EnvListComponent,
  EoMonacoEditorComponent,
  DownloadClienteComponent,
  LocalWorkspaceTipComponent,
  ExtensionAppComponent,
];
const SHARED_UI_MODULE = [
  NzFormModule,
  NzDrawerModule,
  NzRadioModule,
  EoNgButtonModule,
  EoNgCheckboxModule,
  EoNgSelectModule,
  EoNgSwitchModule,
  EoNgTreeModule,
  NzToolTipModule,
  NzResultModule,
  EoNgDropdownModule,
  NzSpinModule,
  NzCardModule,
  NzNotificationModule,
  NzEmptyModule,
  NzMessageModule,
  NzDescriptionsModule,
  NzInputModule,
  NzCheckboxModule,
  EouiModule,
  NzTreeModule,
  NzAvatarModule,
  NzTabsModule,
  NzSkeletonModule,
  NzSelectModule,
  NzPopoverModule,
  NzCodeEditorModule,
  NzResizableModule,
  EoIconparkIconModule,
  NzInputNumberModule,
  NzSwitchModule,
  NzDividerModule,
  NzModalModule,
  NzTypographyModule,
  NzListModule,
  NzCollapseModule,
  NzTagModule,
  NzPopconfirmModule,
] as const;
const SHARED_MODULE = [CommonModule, FormsModule, RouterModule, ReactiveFormsModule] as const;

@NgModule({
  imports: [...SHARED_MODULE,...SHARED_UI_MODULE],
  declarations: [...COMPONENTS, ClickStopPropagationDirective, ApiParamsNumPipe, PageBlankComponent, EnvListComponent],
  providers: [],
  exports: [...SHARED_MODULE, ...COMPONENTS,...SHARED_UI_MODULE,  ClickStopPropagationDirective, ApiParamsNumPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
