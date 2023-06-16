import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgFeedbackMessageService, EoNgFeedbackTooltipModule } from 'eo-ng-feedback';
import { EoNgInputModule } from 'eo-ng-input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { EoIconparkIconModule } from 'pc/browser/src/app/components/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { LanguageService } from 'pc/browser/src/app/core/services/language/language.service';
import { AiToApiService } from 'pc/browser/src/app/pages/modules/ai-to-api/ai-to-api.service';
import { memo } from 'pc/browser/src/app/shared/decorators/memo';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EoNgFeedbackTooltipModule,
    NzToolTipModule,
    NzTagModule,
    EoNgButtonModule,
    EoNgInputModule,
    EoIconparkIconModule
  ],
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

  aiTip = $localize`🤩To generate a document with AI, type "# prompt" and give it a try!`;

  showHowUse = false;
  constructor(private message: EoNgFeedbackMessageService, private AiToApiService: AiToApiService, public lang: LanguageService) {}

  @memo()
  getAiBtnText(hasGenGenerated) {
    return hasGenGenerated ? $localize`rebuild` : $localize`AI generate`;
  }

  generateAPI() {
    if (!this.aiPrompt) {
      this.message.info($localize`Please enter AI Prompt`);
      return;
    }
    if (this.fromPage === 'apiTest') {
      this.AiToApiService.openAIToAPIModal(this.AIToAPITitle, 'apiTest', this.aiPrompt);
    }

    this.emitGenerateAPI.emit();
  }

  inputChange(e) {
    this.aiPromptChange.emit(e);
  }

  closeInput() {
    this.closeInputEmit.emit();
  }

  showHowUseAi() {
    this.aiPrompt =
      this.lang.langHash === 'zh'
        ? '生成一个用户登录接口，密码需要进行 MD5 加密，返回用户 Token'
        : 'Generate a user login API, password needs to be encrypted with MD5, and return the user token';
  }
}
