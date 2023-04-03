import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChatgptRobotComponent } from 'pc/browser/src/app/pages/components/chatgpt-robot/chatgpt-robot.component';

import { SharedModule } from '../../shared/shared.module';
import { ToolbarComponent } from './toolbar.component';

const COMPONENTS = [ToolbarComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, SharedModule],
  providers: [],
  exports: [...COMPONENTS]
})
export class ToolbarModule {}
