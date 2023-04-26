import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { EoNgInputModule } from 'eo-ng-input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { EoIconparkIconModule } from 'pc/browser/src/app/components/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { AiToApiService } from 'pc/browser/src/app/pages/modules/ai-to-api/ai-to-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NzTagModule, EoNgButtonModule, EoNgInputModule, EoIconparkIconModule],
  selector: 'pc-ai-input-group',
  templateUrl: './ai-input-group.component.html',
  styleUrls: ['./ai-input-group.component.scss']
})
export class AiInputGroupComponent {
  @ViewChild('AIToAPITitle') AIToAPITitle: TemplateRef<HTMLDivElement>;
  primaryColor = 'var(--primary-color)';

  @Input() aiPrompt = '';

  @Output() readonly aiPromptChange = new EventEmitter<string>();

  @Input() requestLoading = false;

  @Output() readonly requestLoadingChange = new EventEmitter<boolean>();

  @Input() hasGenGenerated = false;

  @Output() readonly hasGenGeneratedChange = new EventEmitter<boolean>();

  @Output() readonly emitGenerateAPI = new EventEmitter();
  @Output() readonly closeInputEmit = new EventEmitter();

  @Input() fromPage = 'ai';

  showHowUse = false;
  constructor(private message: EoNgFeedbackMessageService, private AiToApiService: AiToApiService) {}
  getAiBtnText() {
    return this.hasGenGenerated ? '重新生成' : 'AI 生成';
  }

  generateAPI() {
    if (!this.aiPrompt) {
      this.message.info('请输入AI Prompt');
      return;
    }
    if (this.fromPage === 'apiTest') {
      this.AiToApiService.openAIToAPIModal(this.AIToAPITitle, 'apiTest', this.aiPrompt);
    }

    this.emitGenerateAPI.emit();
  }

  inputChange() {
    console.log(this.aiPrompt);
    this.aiPromptChange.emit(this.aiPrompt);
  }

  closeInput() {
    this.closeInputEmit.emit();
  }

  showHowUseAi() {
    this.showHowUse = true;
  }
}
