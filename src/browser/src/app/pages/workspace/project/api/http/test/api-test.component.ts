import { Component, Output, EventEmitter, Input, TemplateRef, ViewChild, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { isEqual } from 'lodash-es';
import { EditTabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { PageUniqueName } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import {
  ApiBodyType,
  ApiParamsType,
  BASIC_TABS_INFO,
  RequestMethod,
  TabsConfig
} from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { isInherited, NONE_AUTH_OPTION } from 'pc/browser/src/app/pages/workspace/project/api/constants/auth.model';
import { ApiTestUiComponent, ContentTypeMap } from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-test-ui.component';
import {
  ContentType,
  TestPage,
  testViewModel,
  WHAT_TEXT_TYPE_MAP
} from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-test.model';
import { ApiTestUtilService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-test-util.service';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/service/project-api.service';
import { ApiTestResData } from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/test-server.model';
import { ApiEffectService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-effect.service';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { ApiTestHistory } from 'pc/browser/src/app/services/storage/db/models';
import { HeaderParam } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { eoDeepCopy, getDifference, isEmptyObj, JSONParse, whatTextType } from 'pc/browser/src/app/shared/utils/index.utils';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';

interface TestInstance {
  saveTips: string;
  getModel: () => Promise<testViewModel>;
  save: () => void;
  saveName?: () => void;
  delete?: () => {};
}
@Component({
  selector: 'eo-api-http-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss']
})
export class ApiTestComponent implements EditTabViewComponent {
  @Input() model: testViewModel;
  /**
   * Intial model from outside,check form is change
   * * Usually restored from tab
   */
  @Input() initialModel: testViewModel;
  @Output() readonly eoOnInit = new EventEmitter<testViewModel>();
  @Output() readonly modelChange = new EventEmitter<testViewModel>();
  @Output() readonly afterSaved = new EventEmitter<testViewModel>();
  @Output() readonly afterTested = new EventEmitter<{
    id: string;
    url: string;
    model: {
      testStartTime: number;
      testResult: ApiTestResData;
    };
  }>();
  @ViewChild('saveButtonTmp', { read: TemplateRef, static: true }) saveButtonTmp: TemplateRef<HTMLDivElement>;
  @ViewChild('testUIComponent') testUIComponent: ApiTestUiComponent;
  isNameEdit = false;
  isSaving = false;
  name: string;
  /**
   * Page is used to switch between different test pages
   */
  currentPage = TestPage.Blank;
  /**
   * Context is used to generate current page
   */
  instance: TestInstance = {
    saveTips: $localize`Save`,
    getModel: () => new Promise<testViewModel>(resolve => {}),
    save: () => {}
  };
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private effect: ApiEffectService,
    private projectApi: ProjectApiService,
    private feedback: EoNgFeedbackMessageService,
    private api: ApiService,
    private apiTestUtil: ApiTestUtilService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {}
  uiModelChange($event) {
    //? prevent model reset slow than modelChange
    this.model = $event;
    this.modelChange.emit($event);
  }
  valueChange() {
    this.modelChange.emit(this.model);
  }
  isFormChange(): boolean {
    if (this.currentPage === TestPage.API) {
      return false;
    }
    if (!(this.initialModel?.request && this.model?.request)) {
      return false;
    }
    const origin = this.apiTestUtil.formatEditingApiData(this.initialModel.request);
    const after = this.apiTestUtil.formatEditingApiData(this.model.request);

    // console.log('api test origin:', origin, 'after:', after);

    if (!isEqual(origin, after)) {
      // console.log('api test formChange true!', getDifference(origin, after));
      return true;
    }
    return false;
  }
  /**
   * Save api test data to api
   * ? Maybe support saving test case in future
   */
  @HostListener('keydown.control.s', ['$event', "'shortcut'"])
  @HostListener('keydown.meta.s', ['$event', "'shortcut'"])
  async save($event?, ux = 'ui') {
    $event?.preventDefault?.();
    if (!this.testUIComponent.checkForm() || this.isNameEdit) {
      return;
    }
    this.isSaving = true;
    await this.instance.save();
    this.isSaving = false;
  }
  delete() {
    this.instance.delete();
  }
  saveName() {
    this.instance.saveName();
  }
  private getCurrentInstance(currentPage): TestInstance {
    let result;
    const defaultModel = {
      //Selet` Body
      requestTabIndex: 1,
      //Select Response
      responseTabIndex: 0,
      testResult: {}
    } as testViewModel;
    switch (currentPage) {
      case TestPage.Blank: {
        result = {
          saveTips: $localize`Save as API`,
          getModel: () => {
            const bodyType =
              typeof StorageUtil.get('api_test_body_type') === 'number' ? StorageUtil.get('api_test_body_type') : ApiBodyType.Raw;
            return {
              ...defaultModel,
              userSelectedContentType: ContentTypeMap[bodyType],
              request: {
                uri: '',
                authInfo: {
                  authInfo: {},
                  authType: NONE_AUTH_OPTION.name,
                  isInherited: isInherited.notInherit
                },
                apiAttrInfo: {
                  contentType: bodyType,
                  requestMethod: RequestMethod.POST,
                  beforeInject: '',
                  afterInject: ''
                },
                scriptList: [
                  { scriptType: 1, data: '' },
                  { scriptType: 2, data: '' }
                ],
                requestParams: {
                  queryParams: [],
                  headerParams: [],
                  restParams: [],
                  bodyParams: [
                    {
                      binaryRawData: ''
                    }
                  ]
                }
              },
              testResult: {}
            };
          },
          save: () => {
            this.saveAsAPI();
          }
        };
        break;
      }
      case TestPage.History: {
        result = {
          saveTips: $localize`Save as API`,
          getModel: async () => {
            const uuid = this.route.snapshot.queryParams.uuid.replace('history_', '');
            const history: ApiTestHistory = await this.effect.getHistory(uuid);
            if (history.request.authInfo) {
              history.request.authInfo.isInherited = isInherited.notInherit;
            }
            return { ...defaultModel, request: this.apiTestUtil.getTestDataFromApi(history.request), testResult: history.response };
          },
          save: () => {
            this.saveAsAPI();
          }
        };
        break;
      }
      case TestPage.API: {
        result = {
          saveTips: $localize`Save as Case`,
          getModel: async () => {
            const uuid = this.route.snapshot.queryParams.uuid;
            const apiData = await this.projectApi.get(uuid);
            return { ...defaultModel, request: this.apiTestUtil.getTestDataFromApi(apiData) };
          },
          save: () => {
            //Save as case
            StorageUtil.set('test_data_will_be_save', this.model.request, 2000);
            this.router.navigate([this.tabsConfig.pathByName[PageUniqueName.HttpCase]], {
              queryParams: { apiUuid: this.model.request.apiUuid, pageID: this.route.snapshot.queryParams.pageID }
            });
          }
        };
        break;
      }
      case TestPage.Case: {
        const apiCaseUuid = Number(this.route.snapshot.queryParams.uuid) || this.route.snapshot.queryParams.uuid;
        result = {
          saveTips: $localize`Save`,
          getModel: async () => {
            const apiUuid = this.route.snapshot.queryParams.apiUuid;
            let viewModel: testViewModel;
            if (!apiCaseUuid) {
              //* Add Case
              let caseData = StorageUtil.get('test_data_will_be_save');
              let isFromTestPage = false;
              if (caseData) {
                isFromTestPage = true;
                //Add Case from Test page
                StorageUtil.remove('test_data_will_be_save');
                caseData.name = $localize`New Case`;
              } else {
                //Add directly
                caseData = await this.projectApi.get(apiUuid);
                if (!caseData) return;
              }
              caseData.name = $localize`New Case`;
              const [res, err] = await this.effect.addCase(caseData);
              if (err) {
                this.feedback.error($localize`Failed to create Case`);
                return;
              }

              //Add successfully
              caseData = res;
              this.feedback.success($localize`Created Case successfully`);
              this.router.navigate([this.tabsConfig.pathByName[PageUniqueName.HttpCase]], {
                queryParams: { apiUuid, uuid: res.apiCaseUuid, pageID: this.route.snapshot.queryParams.pageID }
              });
              setTimeout(() => {
                this.isNameEdit = true;
              }, 200);
              if (isFromTestPage) {
                viewModel = { ...defaultModel, request: caseData };
              } else {
                viewModel = { ...defaultModel, request: this.apiTestUtil.getTestDataFromApi(caseData) };
              }
              return viewModel;
            } else {
              //* Edit Case
              const [res, err] = await this.effect.detailCase(apiCaseUuid);
              if (err) {
                this.feedback.error($localize`Can't find the Case`);
                return;
              }
              return { ...defaultModel, request: this.apiTestUtil.getTestDataFromApi(res) };
            }
          },
          save: async () => {
            const [data, err] = await this.effect.updateCase(this.model.request);
            if (err) {
              this.feedback.error($localize`Edit Case Failed`);
              return;
            }
            this.afterSaved.emit(this.model);
            this.feedback.success($localize`Edited Case successfully`);
          },
          saveName: async () => {
            if (!this.name) return;
            //No change
            if (this.name === this.model.request.name) {
              this.isNameEdit = false;
              return;
            }

            const [data, err] = await this.effect.updateCase({
              name: this.name,
              apiCaseUuid: apiCaseUuid
            });

            if (err) {
              this.feedback.error($localize`Edited Case Name Failed`);
              this.isNameEdit = false;
              return;
            }

            this.feedback.success($localize`Edited Case Name successfully`);
            this.model.request.name = this.name;
            this.afterSaved.emit(this.model);
            this.isNameEdit = false;
          },
          delete: async () => {
            await this.effect.deleteCase(apiCaseUuid);
          }
        };
        break;
      }
    }
    return result;
  }
  async afterTabActivated() {
    // console.log('afterTabActivated', this.model, this.initialModel);
    this.currentPage = this.getCurrentPage();
    this.instance = this.getCurrentInstance(this.currentPage);

    const isFromCache: boolean = this.model && !isEmptyObj(this.model);
    if (isFromCache) {
      this.name ??= this.model.request.name;
      return;
    }
    const result = await this.instance.getModel();
    if (!result) this.eoOnInit.emit(null);
    //Set contentType
    const contentResult = this.getContentTypeInfo(result as Partial<testViewModel>);
    result.request.requestParams.headerParams = contentResult.headers;
    result.userSelectedContentType = contentResult.contentType;
    this.model = result as testViewModel;
    this.name ??= this.model.request.name;
    this.eoOnInit.emit(this.model);
  }
  private getCurrentPage(): TestPage {
    const uuid = this.route.snapshot.queryParams.uuid;
    if (this.router.url.includes(this.tabsConfig.pathByName[PageUniqueName.HttpCase])) return TestPage.Case;

    if (!uuid) return TestPage.Blank;
    if (uuid?.includes('history_')) return TestPage.History;
    return TestPage.API;
  }
  private saveAsAPI() {
    const apiData = this.apiTestUtil.formatUIApiDataToStorage({
      request: this.model.request,
      response: this.model.testResult
    });
    StorageUtil.set('api_data_will_be_save', apiData, 2000);
    this.router.navigate([this.tabsConfig.pathByName[PageUniqueName.HttpEdit]], {
      queryParams: {
        pageID: Number(this.route.snapshot.queryParams.pageID)
      }
    });
  }
  private getContentTypeInfo(model: Partial<testViewModel>): { contentType: ContentType; headers: HeaderParam[] } {
    const result = {
      contentType: ContentTypeMap[ApiBodyType.Raw],
      headers: []
    };
    const bodyType = model?.request?.apiAttrInfo?.contentType;
    if (bodyType !== ApiBodyType.Binary) {
      switch (bodyType) {
        case ApiBodyType.Raw: {
          const textType = whatTextType(model.request.requestParams?.bodyParams[0]?.binaryRawData || '');
          result.contentType = WHAT_TEXT_TYPE_MAP[textType];
          break;
        }
        case ApiBodyType.FormData: {
          //If params has file，dataType must be multipart/form-data
          if (model?.request?.requestParams?.bodyParams?.some(val => val.dataType === ApiParamsType.file)) {
            result.contentType = 'multipart/form-data';
            break;
          }
          result.contentType = ContentTypeMap[ApiBodyType.FormData];
          break;
        }
      }
      result.headers = this.apiTestUtil.addOrReplaceContentType(result.contentType, model.request?.requestParams?.headerParams);
      return result;
    }

    //Binary unset request header
    const headerIndex = model?.request.requestParams.headerParams.findIndex(val => val.name.toLowerCase() === 'content-type');
    if (headerIndex === -1) return;
    model?.request.requestParams.headerParams.splice(headerIndex, 1);
    result.headers = model?.request.requestParams.headerParams;
    return result;
  }
}
