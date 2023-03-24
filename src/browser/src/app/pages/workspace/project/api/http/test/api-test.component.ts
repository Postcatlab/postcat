import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditTabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { ApiBodyType, ApiParamsType, RequestMethod } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { NONE_AUTH_OPTION } from 'pc/browser/src/app/pages/workspace/project/api/components/authorization-extension-form/authorization-extension-form.component';
import {
  ContentType,
  CONTENT_TYPE_BY_ABRIDGE,
  FORMDATA_CONTENT_TYPE_BY_ABRIDGE,
  testViewModel
} from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-test.model';
import { isEmptyObj } from 'pc/browser/src/app/shared/utils/index.utils';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';

type TestPage = 'blankTest' | 'historyTest' | 'caseTest' | 'apiTest';
/**
 * Default Content Type
 */
const contentTypeMap: { [key in ApiBodyType]?: ContentType } = {
  [ApiBodyType.FormData]: 'application/x-www-form-urlencoded',
  [ApiBodyType.Raw]: 'text/plain',
  [ApiBodyType.JSON]: 'application/json',
  [ApiBodyType.JSONArray]: 'application/json',
  [ApiBodyType.XML]: 'application/xml',
  [ApiBodyType.Binary]: '' as ContentType
} as const;

@Component({
  selector: 'eo-api-http-test',
  template: `<eo-api-http-test-ui (model)="(model)"></eo-api-http-test-ui>`
})
export class ApiTestComponent implements EditTabViewComponent {
  @Input() model: testViewModel;
  @Output() readonly eoOnInit = new EventEmitter<testViewModel>();
  @Output() readonly modelChange = new EventEmitter<testViewModel>();

  /**
   * Page is used to switch between different test pages
   */
  currentPage: TestPage = 'blankTest';

  constructor(public route: ActivatedRoute, private router: Router) {}

  afterTabActivated() {
    const isFromCache: boolean = !this.model || isEmptyObj(this.model);
    if (isFromCache) {
      return;
    }
    const currentPage = this.getCurrentPage();
    switch (currentPage) {
      case 'blankTest': {
        const bodyType =
          typeof StorageUtil.get('api_test_body_type') === 'number' ? StorageUtil.get('api_test_body_type') : ApiBodyType.Raw;
        const headerParams = [];
        const contentType = contentTypeMap[bodyType];
        this.model = {
          //Selet Body
          requestTabIndex: 1,
          //Select Response
          responseTabIndex: 0,
          userSelectedContentType: contentType,
          request: {
            authInfo: {
              authInfo: {},
              authType: NONE_AUTH_OPTION.name,
              isInherited: 0
            },
            apiAttrInfo: {
              contentType: bodyType,
              requestMethod: RequestMethod.POST,
              beforeInject: '',
              afterInject: ''
            },
            requestParams: {
              queryParams: [],
              headerParams: headerParams,
              restParams: [],
              bodyParams: [
                {
                  binaryRawData: ''
                }
              ]
            }
          },
          testResult: {}
        } as testViewModel;
        break;
      }
      case 'apiTest': {
        break;
      }
    }
  }
  private getCurrentPage(): TestPage {
    const uuid = this.route.snapshot.queryParams.uuid;
    if (!uuid) return 'blankTest';
    if (this.router.url.includes('/case')) return 'caseTest';
    if (uuid?.includes('history_')) return 'historyTest';
    return 'apiTest';
  }
}
