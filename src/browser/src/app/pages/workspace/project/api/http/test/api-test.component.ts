import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { EditTabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { ApiBodyType, ApiParamsType, RequestMethod } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { isInherited, NONE_AUTH_OPTION } from 'pc/browser/src/app/pages/workspace/project/api/constants/auth.model';
import { ContentTypeMap } from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-test-ui.component';
import { ContentType, testViewModel } from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-test.model';
import { ApiTestService } from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-test.service';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/project-api.service';
import { ApiTestUtilService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-test-util.service';
import { ApiTestHistory } from 'pc/browser/src/app/services/storage/db/models';
import { HeaderParam } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { getDifference, isEmptyObj, JSONParse } from 'pc/browser/src/app/shared/utils/index.utils';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';

type TestPage = 'blankTest' | 'historyTest' | 'caseTest' | 'apiTest';

@Component({
  selector: 'eo-api-http-test',
  template: `<eo-api-http-test-ui [model]="model" (modelChange)="uiModelChanges()"></eo-api-http-test-ui>`
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

  /**
   * Page is used to switch between different test pages
   */
  currentPage: TestPage = 'blankTest';

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private projectApi: ProjectApiService,
    private apiTest: ApiTestService,
    private apiTestUtil: ApiTestUtilService
  ) {}
  uiModelChanges() {
    console.log('uiModelChanges');
    this.modelChange.emit(this.model);
  }
  isFormChange(): boolean {
    if (!(this.initialModel?.request && this.model?.request)) {
      return false;
    }
    const origin = this.apiTestUtil.formatEditingApiData(this.initialModel.request);
    const after = this.apiTestUtil.formatEditingApiData(this.model.request);
    // console.log(
    //   'api test origin:',
    //   origin,
    //   'after:',
    //   after
    // );
    if (JSON.stringify(origin) !== JSON.stringify(after)) {
      // console.log('api test formChange true!', getDifference(origin, after));
      return true;
    }
    return false;
  }
  async afterTabActivated() {
    // console.log('afterTabActivated', this.model, this.initialModel);
    const isFromCache: boolean = this.model && !isEmptyObj(this.model);
    if (isFromCache) {
      return;
    }

    const result = {
      //Selet` Body
      requestTabIndex: 1,
      //Select Response
      responseTabIndex: 0,
      testResult: {}
    } as testViewModel;
    this.currentPage = this.getCurrentPage();
    switch (this.currentPage) {
      case 'blankTest': {
        const bodyType =
          typeof StorageUtil.get('api_test_body_type') === 'number' ? StorageUtil.get('api_test_body_type') : ApiBodyType.Raw;
        Object.assign(result, {
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
        });
        break;
      }
      case 'historyTest': {
        const uuid = this.route.snapshot.queryParams.uuid.replace('history_', '');
        const history: ApiTestHistory = await this.apiTest.getHistory(uuid);
        Object.assign(result, {
          request: history.request,
          testResult: history.response
        });
        break;
      }
      case 'apiTest': {
        const uuid = this.route.snapshot.queryParams.uuid;
        const request = await this.projectApi.get(uuid);
        result.request = this.apiTestUtil.getTestDataFromApi(request);
        break;
      }
    }
    //Set contentType
    const contentResult = this.getContentTypeInfo(result as Partial<testViewModel>);
    result.request.requestParams.headerParams = contentResult.headers;
    result.userSelectedContentType = contentResult.contentType;
    this.model = result as testViewModel;
    this.eoOnInit.emit(this.model);
  }
  async updateAuthInfo() {
    if (['blankTest', 'historyTest'].includes(this.currentPage)) {
      return;
    }
    const uuid = this.route.snapshot.queryParams.uuid;
    const result = await this.projectApi.get(uuid);
    if (!result) return;
    const newAuthInfo = {
      ...result.authInfo,
      authInfo: JSONParse(result.authInfo.authInfo)
    };
    if (!isEqual(this.model.request?.authInfo, newAuthInfo)) {
      this.model.request.authInfo = newAuthInfo;
    }
  }
  private getCurrentPage(): TestPage {
    const uuid = this.route.snapshot.queryParams.uuid;
    if (!uuid) return 'blankTest';
    if (this.router.url.includes('/case')) return 'caseTest';
    if (uuid?.includes('history_')) return 'historyTest';
    return 'apiTest';
  }
  private getContentTypeInfo(model: Partial<testViewModel>): { contentType: ContentType; headers: HeaderParam[] } {
    const result = {
      contentType: ContentTypeMap[ApiBodyType.JSON],
      headers: []
    };
    const bodyType = model?.request?.apiAttrInfo?.contentType;
    if (bodyType !== ApiBodyType.Binary) {
      switch (bodyType) {
        case ApiBodyType.Raw: {
          result.contentType = ContentTypeMap[ApiBodyType.JSON];
          break;
        }
        case ApiBodyType.FormData: {
          //If params has file，dataType must be multiple/form-data
          if (model?.request?.requestParams?.bodyParams?.some(val => val.dataType === ApiParamsType.file)) {
            result.contentType = 'multiple/form-data';
            break;
          }
          result.contentType = ContentTypeMap[ApiBodyType.FormData];
          break;
        }
      }
      result.headers = this.apiTestUtil.addOrReplaceContentType(result.contentType, result.headers);
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
