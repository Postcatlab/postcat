import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { EoMonacoEditorComponent } from 'pc/browser/src/app/components/eo-ui/monaco-editor/monaco-editor.component';
import { EditTabViewComponent, TabItem } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { WebService } from 'pc/browser/src/app/core/services';
import { SYSTEM_MOCK_NAME } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiMockService } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/service/project-api.service';
import { ApiEffectService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-effect.service';
import { MockService } from 'pc/browser/src/app/services/mock.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { PROTOCOL } from 'pc/browser/src/app/shared/models/protocol.constant';
import storageUtils from 'pc/browser/src/app/shared/utils/storage/storage.utils';

interface ModelType {
  id?: number;
  name: string;
  uri?: string;
  description?: string;
  createTime?: number;
  updateTime?: number;
  projectUuid?: string;
  apiUuid?: string;
  createWay: string;
  response: string;
  url: string;
}

@Component({
  selector: 'pc-mock',
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.scss']
})
export class MockComponent implements EditTabViewComponent {
  @ViewChild(EoMonacoEditorComponent, { static: false }) eoEditor?: EoMonacoEditorComponent;
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

  mockPrefix: string;

  creatWayIsSystem: boolean;

  isHover: 'hover' | null;

  isSaving: boolean;

  constructor(
    private apiHttp: ApiService,
    private mockService: MockService,
    private api: ProjectApiService,
    private apiMock: ApiMockService,
    private message: EoNgFeedbackMessageService,
    public web: WebService,
    private apiEffect: ApiEffectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.model = {
      createWay: '',
      name: '',
      response: '',
      url: ''
    };
  }

  async afterTabActivated(): Promise<any> {
    //TODO: 需要换成路由拿apiuuid和mockid
    this.apiUuid = this.route.snapshot.queryParams.apiUuid;
    // this.apiUuid = 'yd1qr8m51dq';
    this.mock_id = Number(this.route.snapshot.queryParams.uuid);
    // this.mock_id = null
    if (this.model) return;
    if (storageUtils.get('mock-edit')) {
      this.isEdit = true;
      storageUtils.remove('mock-edit');
    }
    this.mockDetail(this.mock_id);
  }

  valueChange($event) {
    this.modelChange.emit(this.model);
  }

  editClick() {
    this.isEdit = !this.isEdit;
  }

  async mockDetail(mock_id?: number) {
    if (!this.model)
      this.model = {
        name: '',
        url: '',
        response: ''
      } as ModelType;
    const [res] = await this.apiHttp.api_mockDetail({ id: mock_id });
    this.model = res;
    const apiData = await this.getApiDetail(res.apiUuid);
    this.mockPrefix = this.apiMock.getMockPrefix(apiData);
    if (res.createWay === 'system') {
      this.model.name = SYSTEM_MOCK_NAME;
      this.model.response = this.apiMock.getMockResponseByAPI(apiData);
    }
    this.model.url = this.getMockUrl(res);
    this.eoEditor?.formatCode();
    this.creatWayIsSystem = this.model.createWay === 'system';
    this.isHover = this.model?.createWay === 'system' ? 'hover' : null;
    this.eoOnInit.emit(this.model);
  }

  isFormChange() {
    return this.model.response !== this.initialModel.response || this.model.name !== this.initialModel.name;
  }

  async getApiDetail(apiUuid) {
    if (!this.model) this.model = {} as ModelType;
    return await this.api.get(apiUuid);
  }

  private getMockUrl(mock) {
    //Generate Mock URL
    //TODO Mock URL = API Path
    const url = new URL(
      this.mockPrefix
        .replace(/:\/{2,}/g, ':::')
        .replace(/\/{2,}/g, '/')
        .replace(/:{3}/g, '://'),
      'https://github.com/'
    );
    if (mock?.createWay === 'custom' && mock.id) {
      url.searchParams.set('mockID', `${mock.id}`);
    }
    return decodeURIComponent(url.toString());
  }

  @HostListener('keydown.control.s', ['$event', "'shortcut'"])
  @HostListener('keydown.meta.s', ['$event', "'shortcut'"])
  keyDownSave($event) {
    $event?.preventDefault?.();
    if (!this.isEdit) this.saveInfo('response');
  }

  async saveInfo(key: string) {
    // if (key === 'response' && !this.model.response) {
    //   this.message.error($localize`response cannot be empty`);
    //   return;
    // }
    this.isSaving = true;
    if (this.model[key] === this.initialModel[key]) {
      if (key === 'name') {
        this.isEdit = false;
      }
      if (key === 'response') {
        this.message.info($localize`No change in data`);
      }
      this.isSaving = false;
      return;
    }

    const requestData = {
      ...this.initialModel,
      [key]: this.model[key]
    };
    await this.addOrEditModal(requestData);
    this.isEdit = false;
    this.isSaving = false;
    this.afterSaved.emit(this.model);
    if (key === 'name') {
      this.apiEffect.editMock();
    }
  }

  async addOrEditModal(item, index?) {
    await this.apiMock.updateMock(item);
    this.model = item;
    this.afterSaved.emit(this.model);
    this.message.success($localize`Edited successfully`);
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
    await this.apiMock.toDelete(this.model.id);
  }
}
