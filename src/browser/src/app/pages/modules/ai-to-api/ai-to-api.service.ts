import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AiToApiComponent } from 'pc/browser/src/app/pages/modules/ai-to-api/ai-to-api.component';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { RemoteService } from 'pc/browser/src/app/services/storage/remote.service';

@Injectable({
  providedIn: 'root'
})
export class AiToApiService {
  constructor(private modalService: ModalService, private remote: RemoteService, private http: HttpClient) {}

  openAIToAPIModal(titleTem, fromPage?, aiPrompt?) {
    this.modalService.create({
      nzTitle: titleTem,
      nzContent: AiToApiComponent,
      nzComponentParams: {
        fromPage: fromPage || 'ai',
        aiPrompt
      },
      nzClosable: false,
      nzAutofocus: false,
      nzFooter: null,
      nzWidth: '650px',
      nzMaskClosable: false
    });
  }

  generateAPI(description: string) {
    return this.http.post('/api/auto/api', {
      description
    });
  }

  getAIAPI(code: string) {
    return this.http.get(`/api/auto/api?code=${code}`);
  }
}
