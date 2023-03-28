import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { EditTabViewComponent, TabItem } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { WebService } from 'pc/browser/src/app/core/services';
import { ApiMockService } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/project-api.service';
import { ApiEffectService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-effect.service';
import { MockService } from 'pc/browser/src/app/services/mock.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { PROTOCOL } from 'pc/browser/src/app/shared/models/protocol.constant';
import { eoDeepCopy } from 'pc/browser/src/app/shared/utils/index.utils';

interface ModelType {
  name: string;
  response: any;
  url: string;
  createWay: string;
}

let itemData: any = {};

@Component({
  selector: 'pc-mock',
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.scss']
})
export class MockComponent implements EditTabViewComponent {
  @Input() model: ModelType;
  @Output() readonly eoOnInit = new EventEmitter<ModelType>();

  @Output() readonly modelChange = new EventEmitter<ModelType>();

  @Output() readonly afterSaved = new EventEmitter<ModelType>();

  apiData: ApiData;

  @Input() initialModel: ModelType;

  apiUuid: number | string;

  mock_id: number | string;
  isEdit: boolean = false;

  validateForm: FormGroup;

  hoverStr: string = 'The system creates a Mock that cannot be operated';

  titleTips = $localize`Postcat Client is required to use local mock.`;
  btnTitle = $localize`Use Client`;
  isInstalledClient: boolean = true;

  constructor(
    private apiHttp: ApiService,
    private mockService: MockService,
    private api: ProjectApiService,
    private apiMock: ApiMockService,
    private message: EoNgFeedbackMessageService,
    public web: WebService,
    private apiEffect: ApiEffectService,
    private route: ActivatedRoute
  ) {
    //TODO: 需要换成路由拿apiuuid和mockid
    this.apiUuid = this.route.snapshot.queryParams.apiUuid;
    // 'yd1qr8m51dq'
    this.mock_id = this.route.snapshot.queryParams.mockId;
    // this.mock_id = null
  }

  afterTabActivated(): void {
    if (this.model) {
      this.model = { ...this.model };
    } else {
      // TODO: 需要换成是否有mockid判断
      if (!this.mock_id) {
        this.isEdit = true;
        this.getApiDetail();
      } else {
        this.mockDetail(this.mock_id);
      }
    }
  }
  initTabModel() {
    this.eoOnInit.emit(this.model);
    this.modelChange.emit(this.model);
  }

  valueChange($event) {
    this.modelChange.emit(this.model);
  }

  editClick() {
    this.isEdit = !this.isEdit;
    // this.getApiDetail();
  }

  async mockDetail(mock_id?: string | number) {
    if (!this.model) this.model = {} as ModelType;
    const [res] = await this.apiHttp.api_mockDetail({ id: mock_id });
    itemData = res;
    this.model.url = this.getMockUrl(res);
    this.model.createWay = res.createWay;
    this.model.response = res.response;
    this.model.name = res.name;
    this.initTabModel();
  }

  isFormChange() {
    return this.model.response !== this.initialModel.response || this.model.name !== this.initialModel.name;
  }

  btnClick() {
    // this.mockDetail(5067);
    this.getApiDetail();
  }

  async getApiDetail() {
    if (!this.model) this.model = {} as ModelType;
    this.apiData = await this.api.get(this.apiUuid);
    const data = {
      name: 'NEW MOCK',
      response: this.apiMock.getMockResponseByAPI(this.apiData)
    };
    this.setValidateFormValue(data);
    this.initTabModel();
    this.addOrEditModal(data);
  }

  setValidateFormValue(res) {
    Object.keys(res).forEach(key => {
      this.model[key] = res[key] || '';
    });
  }
  private getMockUrl(mock) {
    // console.log(mock);
    // //Generate Mock URL
    // //TODO Mock URL = API Path
    // const url = new URL(
    //   this.mockPrefix
    //     .replace(/:\/{2,}/g, ':::')
    //     .replace(/\/{2,}/g, '/')
    //     .replace(/:{3}/g, '://'),
    //   'https://github.com/'
    // );
    // if (mock?.createWay === 'custom' && mock.id) {
    //   url.searchParams.set('mockID', `${mock.id}`);
    // }
    return 'decodeURIComponent(url.toString())';
  }

  // name edit no focus
  // async saveName() {
  //   const requestData = {
  //     ...itemData,
  //     name: this.model.name
  //   };
  //   await this.addOrEditModal(requestData);
  // }

  @HostListener('keydown.control.s', ['$event', "'shortcut'"])
  @HostListener('keydown.meta.s', ['$event', "'shortcut'"])
  keyDownSave($event) {
    $event?.preventDefault?.();
    if (!this.isEdit) this.saveInfo('response');
  }

  async saveInfo(key: string) {
    if (key === 'response' && !this.model.response) {
      this.message.error($localize`response cannot be empty`);
      return;
    }
    if (this.model[key] === itemData[key]) {
      if (key === 'name') {
        this.isEdit = false;
      }
      if (key === 'response') {
        this.message.info($localize`No change in data`);
      }
      return;
    }

    const requestData = {
      ...itemData,
      [key]: this.model[key]
    };
    await this.addOrEditModal(requestData);
    this.isEdit = false;
    itemData = requestData;
    this.afterSaved.emit(this.model);
  }
  // async saveResponse() {
  //   if(!this.model.response) {
  //     this.message.error($localize`response cannot be empty`);
  //     return
  //   }
  //   const requestData = {
  //     ...itemData,
  //     response: this.model.response
  //   };
  //   await this.addOrEditModal(requestData);
  // }

  async addOrEditModal(item, index?) {
    if (item.id) {
      await this.apiMock.updateMock(item);
      this.message.success($localize`Edited successfully`);
    } else {
      item.apiUuid = this.apiUuid;
      item.createWay = 'custom';
      const [data, err] = await this.apiMock.createMock(item);
      if (err) {
        this.message.error($localize`Failed to add`);
        return;
      }
      this.message.success($localize`Added successfully`);
      this.apiEffect.createMock();
    }
    // item.url = this.getMockUrl(item);
  }

  async jumpToClient() {
    const isInstalled = await this.web.protocolCheck();
    if (!isInstalled) {
      this.isInstalledClient = false;
    } else {
      this.isInstalledClient = true;
      window.location.href = PROTOCOL;
    }
  }

  async handleDeleteMockItem() {
    await this.apiMock.deleteMock(itemData.id);
    this.message.success($localize`Delete Succeeded`);
    this.apiEffect.deleteMockDetail();
  }
}
