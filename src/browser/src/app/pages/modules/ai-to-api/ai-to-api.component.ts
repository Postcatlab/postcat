import { Component, HostListener, Input, TemplateRef, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { debounce } from 'lodash-es';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AiToApiService } from 'pc/browser/src/app/pages/modules/ai-to-api/ai-to-api.service';
import { enExampleYaml } from 'pc/browser/src/app/pages/modules/ai-to-api/example-yaml/en-yaml';
import { zhExampleYaml } from 'pc/browser/src/app/pages/modules/ai-to-api/example-yaml/zh-yaml';
import { ApiEditComponent } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit.component';
import { DataSourceService } from 'pc/browser/src/app/services/data-source/data-source.service';
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

  constructor(
    private aiToApi: AiToApiService,
    private modalRef: NzModalRef,
    private msg: EoNgFeedbackMessageService,
    private dataSourceService: DataSourceService
  ) {}

  ngOnInit() {
    storageUtils.set('openAIToAPI', true);

    if (this.fromPage !== 'apiTest') return;
    this.generateAPI();
    // this.aiPrompt = this.apiTestAiPrompt;
  }

  generateAPI() {
    this.error = false;

    if (this.aiPrompt === '生成一个用户登录接口，密码需要进行 MD5 加密，返回用户 Token') {
      this.exampleGenerate(zhExampleYaml);

      return;
    } else if (this.aiPrompt === 'Generate a user login API, password needs to be encrypted with MD5, and return the user token') {
      this.exampleGenerate(enExampleYaml);

      return;
    }

    if (this.hasGenGenerated) {
      this.requestLoading = true;
      this.editShow = false;
      storageUtils.remove('api_data_will_be_save');
    }

    this.aiToApi.generateAPI(this.aiPrompt).subscribe({
      next: (res: any) => {
        if (res.code !== 0) {
          this.msg.error(res.message);
        }
        this.dataSourceService.checkRemoteCanOperate(() => {
          this.requestLoading = true;
          this.getAIAPI(res.data);
        });
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
                checkedApiData = checkedData.data;
              } else {
                this.error = true;
                break;
              }
              this.generateData(checkedApiData);
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
          console.error(err);
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

  generateData(data) {
    storageUtils.set('api_data_will_be_save', data);
    this.editShow = true;
    this.apiEditDom.afterTabActivated();
    this.hasGenGenerated = true;
  }

  exampleGenerate(exampleYaml) {
    this.requestLoading = true;

    const editData = (parseOpenAPI(JSON.parse(JSON.stringify(yaml.load(exampleYaml, null, 2)))) as any)[0].collections[0].children[0];

    setTimeout(() => {
      this.requestLoading = false;
      this.generateData(editData);
    }, 1000);
  }
}
