import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditTabViewComponent, TabItem } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/api.service';
import { ApiMockService } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { MockService } from 'pc/browser/src/app/services/mock.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { eoDeepCopy } from 'pc/browser/src/app/shared/utils/index.utils';

interface ModelType {
  name: string;
  response: any;
  url: string;
  createWay: string;
}

@Component({
  selector: 'pc-mock',
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.scss']
})
export class MockComponent implements OnInit, EditTabViewComponent {
  @Input() model: ModelType;
  @Input() initialModel: ModelType;
  @Output() readonly eoOnInit = new EventEmitter<ModelType>();

  @Output() readonly modelChange = new EventEmitter<ModelType>();

  apiData: ApiData;

  apiUuid: number | string;

  mock_id: number | string;
  isEdit: boolean = false;

  validateForm: FormGroup;

  hoverStr: string = 'The system creates a Mock that cannot be operated';

  sign: string;

  constructor(
    private apiHttp: ApiService,
    private mockService: MockService,
    private fb: FormBuilder,
    private api: ProjectApiService,
    private apiMock: ApiMockService,
    private ref: ChangeDetectorRef
  ) {
    //TODO: 需要换成路由拿apiuuid和mockid
    this.apiUuid = 'yd1qr8m51dq';
    // 'yd1qr8m51dq'
    this.mock_id = 5065;
    this.model = {
      name: '',
      createWay: '',
      response: '',
      url: ''
    };
  }

  afterTabActivated(): void {
    throw new Error('Method not implemented.');
  }

  async ngOnInit() {
    //TODO: 需要换成是否有mockid判断
    if (false) {
      // this.getApiDetail();
    } else {
      this.mockDetail(this.mock_id);
    }
  }

  initTabModel() {
    this.eoOnInit.emit(this.model);
    this.modelChange.emit(this.model);
  }

  nameChange($event) {
    console.log(this.model);
    this.modelChange.emit(this.model);
  }

  editClick() {
    this.isEdit = !this.isEdit;
    // this.getApiDetail();
  }

  async mockDetail(mock_id?: string | number) {
    const [res] = await this.apiHttp.api_mockDetail({ id: mock_id });
    this.model.url = this.getMockUrl(res);
    this.model.createWay = res.createWay;
    this.model.response = res.response;
    this.model.name = res.name;
    this.initTabModel();
  }

  isFormChange() {
    return this.model.response !== this.initialModel.response;
  }

  btnClick() {
    // this.mockDetail(5067);
    this.getApiDetail();
  }

  async getApiDetail() {
    this.apiData = await this.api.get(this.apiUuid);
    const data = {
      name: 'NEW MOCK',
      response: this.apiMock.getMockResponseByAPI(this.apiData)
    };
    this.setValidateFormValue(data);
    this.initTabModel();
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

  changeName() {
    console.log(666);
  }
}
