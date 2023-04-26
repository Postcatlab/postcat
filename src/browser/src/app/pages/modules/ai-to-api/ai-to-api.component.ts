import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { debounce } from 'lodash-es';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AiToApiService } from 'pc/browser/src/app/pages/modules/ai-to-api/ai-to-api.service';
import { ApiEditComponent } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit.component';
import { parseAndCheckApiData } from 'pc/browser/src/app/services/storage/db/validate/validate';
import { parseOpenAPI } from 'pc/browser/src/app/shared/utils/parseOpenAPI';
import storageUtils from 'pc/browser/src/app/shared/utils/storage/storage.utils';

const yaml = require('js-yaml');
@Component({
  selector: 'pc-ai-to-api',
  templateUrl: './ai-to-api.component.html',
  styleUrls: ['./ai-to-api.component.scss']
})
export class AiToApiComponent {
  @ViewChild('apiEditDom', { static: true }) apiEditDom!: ApiEditComponent;
  @Input() aiPrompt = '';
  @Input() apiTestAiPrompt = '';

  @Input() requestLoading = false;

  @Input() hasGenGenerated = false;
  @Input() fromPage = '';

  saveLoading = false;
  error = false;

  testshow = false;

  editShow = false;

  constructor(private aiToApi: AiToApiService, private modalRef: NzModalRef) {}

  ngOnInit() {
    storageUtils.set('openAIToAPI', true);

    if (this.fromPage !== 'apiTest') return;
    this.generateAPI();
    // this.aiPrompt = this.apiTestAiPrompt;
  }

  generateAPI() {
    this.error = false;
    if (this.hasGenGenerated) {
      this.requestLoading = true;
      this.editShow = false;
      this.error = false;
      storageUtils.remove('api_data_will_be_save');
    }

    this.aiToApi.generateAPI(this.aiPrompt).subscribe({
      next: (res: any) => {
        this.requestLoading = true;
        this.getAIAPI(res.data);
      }
    });
  }

  getAIAPI(code: string) {
    this.aiToApi.getAIAPI(code).subscribe({
      next: (res: any) => {
        try {
          switch (true) {
            case res.code === 0:
              this.requestLoading = false;
              const editData = (parseOpenAPI(JSON.parse(JSON.stringify(yaml.load(res.data, null, 2)))) as any)[0].collections[0]
                .children[0];
              const checkedData = parseAndCheckApiData(editData);
              let checkedApiData = null;
              if (checkedData.validate) {
                checkedApiData = parseAndCheckApiData(editData).data;
              } else {
                this.error = true;
                return;
                break;
              }
              storageUtils.set('api_data_will_be_save', checkedApiData);
              this.editShow = true;
              this.apiEditDom.afterTabActivated();
              this.hasGenGenerated = true;
              break;
            case res.code === 232000008:
              debounce(() => {
                this.getAIAPI(code);
              }, 2000)();
              break;
            default:
              this.requestLoading = false;
              this.error = true;
          }
        } catch (err) {
          this.error = true;
        }
      }
    });
  }

  ngOnDestroy() {
    storageUtils.remove('openAIToAPI');
    storageUtils.remove('api_data_will_be_save');
  }

  changetestshow() {
    this.aiPrompt = '888';
    this.testshow = !this.testshow;
  }

  async saveApi() {
    this.saveLoading = true;

    await this.apiEditDom.saveAPI();

    this.saveLoading = false;

    this.modalRef.close();
  }

  cancel() {
    this.modalRef.close();
  }
}
