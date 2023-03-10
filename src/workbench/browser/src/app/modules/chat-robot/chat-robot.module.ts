import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgInputModule } from 'eo-ng-input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

import { EoIconparkIconModule } from '../eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { ChatRobotComponent } from './chat-robot-container/chat-robot.component';
import { ChatRobotFormComponent } from './chat-robot-form/chat-robot-form.component';
import { ChatRobotMessageComponent } from './chat-robot-message/chat-robot-message.component';
import { ChatRobotService } from './chat-robot.service';
@NgModule({
  declarations: [ChatRobotComponent, ChatRobotMessageComponent, ChatRobotFormComponent],
  providers: [ChatRobotService],
  imports: [CommonModule, EoNgInputModule, EoIconparkIconModule, NzAvatarModule, EoNgButtonModule, FormsModule],
  exports: [ChatRobotComponent, ChatRobotMessageComponent, ChatRobotFormComponent]
})
export class ChatRobotModule {}
