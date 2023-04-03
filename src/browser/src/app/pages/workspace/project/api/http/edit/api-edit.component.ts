import { Component, ViewChild, OnDestroy, Input, Output, EventEmitter, HostListener, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { isEqual } from 'lodash-es';
import { autorun } from 'mobx';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { EditTabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { PageUniqueName } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import {
  afterScriptCompletions,
  AFTER_DATA,
  beforeScriptCompletions,
  BEFORE_DATA
} from 'pc/browser/src/app/pages/workspace/project/api/components/api-script/constant';
import {
  ApiBodyType,
  BASIC_TABS_INFO,
  IMPORT_MUI,
  RequestMethod,
  TabsConfig
} from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiEditService } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit.service';
import { generateRestFromUrl, syncUrlAndQuery } from 'pc/browser/src/app/pages/workspace/project/api/utils/api.utils';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { getExpandGroupByKey, PCTree } from 'pc/browser/src/app/shared/utils/tree/tree.utils';
import { Subject } from 'rxjs';

import { isEmptyObj, enumsToArr, waitNextTick, getDifference } from '../../../../../../shared/utils/index.utils';
import { ApiParamsNumPipe } from '../../pipe/api-param-num.pipe';
import { ApiEffectService } from '../../store/api-effect.service';
import { ApiStoreService } from '../../store/api-state.service';
import { ApiEditUtilService } from './api-edit-util.service';
import { ApiEditBodyComponent } from './body/api-edit-body.component';

@Component({
  selector: 'pc-api-http-edit',
  templateUrl: './api-edit.component.html',
  styleUrls: ['./api-edit.component.scss']
})
export class ApiEditComponent implements OnDestroy, EditTabViewComponent {
  @ViewChild('editBody') editBody: ApiEditBodyComponent;
  @ViewChild('resEditBody') resEditBody: ApiEditBodyComponent;
  @Input() model: ApiData;
  /**
   * Intial model from outside,check form is change
   * * Usually restored from tab
   */
  @Input() initialModel: ApiData;
  @Output() readonly modelChange = new EventEmitter<ApiData>();
  @Output() readonly eoOnInit = new EventEmitter<ApiData>();
  @Output() readonly afterSaved = new EventEmitter<ApiData>();
  @ViewChild('apiGroup') apiGroup: NzTreeSelectComponent;
  // showEnvTips = false;
  validateForm: FormGroup = new FormGroup({
    groupId: new FormControl('')
  });
  isSaving = false;
  groups: NzTreeNode[];
  expandKeys: string[] = [];
  REQUEST_METHOD = enumsToArr(RequestMethod);
  nzSelectedIndex = 1;
  reactions = [];

  BEFORE_DATA = BEFORE_DATA;
  AFTER_DATA = AFTER_DATA;
  beforeScriptCompletions = beforeScriptCompletions;
  afterScriptCompletions = afterScriptCompletions;
  private destroy$: Subject<void> = new Subject<void>();
  get TYPE_API_BODY(): typeof ApiBodyType {
    return ApiBodyType;
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiEditUtil: ApiEditUtilService,
    private fb: FormBuilder,
    public globalStore: StoreService,
    private feedback: EoNgFeedbackMessageService,
    private effect: ApiEffectService,
    private apiEdit: ApiEditService,
    private store: ApiStoreService,
    private trace: TraceService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {
    this.initBasicForm();
    //Get group list
    this.reactions.push(
      autorun(() => {
        if (!this.store.getRootGroup) return;
        this.groups = this.store.getFolderList;
      })
    );
  }
  /**
   * Init Api Data
   *
   * @param type Reset means force update apiData
   */
  public async afterTabActivated() {
    const isFromCache: boolean = this.model && !isEmptyObj(this.model);
    const id = this.route.snapshot.queryParams.uuid;

    //Get api data from request
    if (!isFromCache) {
      const groupId = Number(this.route.snapshot.queryParams.groupId);
      this.model = await this.apiEdit.getApi({
        id
      });
      this.model.groupId = this.model.groupId || groupId;
      this.resetRestFromUrl(this.model.uri);
    }

    //Reset ui form
    this.initBasicForm();
    this.watchBasicForm();
    this.setGroupInfo();
    this.validateForm.patchValue(this.model);
    waitNextTick().then(() => {
      this.editBody?.init();
      this.resEditBody?.init();
      //Reset group prevent view delay
      if (this.groups?.length) {
        this.groups = [...this.groups];
      }
    });

    //Only trigger onInit when first time
    if (isFromCache) return;
    this.eoOnInit.emit(this.model);
  }
  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }
  blurUri() {
    this.updateParamsbyUri();
  }
  private updateParamsbyUri() {
    const url = this.validateForm.controls['uri'].value;
    this.model.requestParams.queryParams = syncUrlAndQuery(url, this.model.requestParams.queryParams, {
      nowOperate: 'url',
      method: 'keepBoth'
    }).query;

    this.resetRestFromUrl(url);
  }

  openGroup() {
    this.expandKeys = getExpandGroupByKey(this.apiGroup, this.model.groupId);
  }
  async beforeTabClose() {
    await this.saveAPI();
  }
  @HostListener('keydown.control.s', ['$event', "'shortcut'"])
  @HostListener('keydown.meta.s', ['$event', "'shortcut'"])
  async saveAPI($event?, ux = 'ui') {
    $event?.preventDefault?.();
    //manual set dirty in case user submit directly without edit
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    this.isSaving = true;
    let formData: ApiData = this.apiEditUtil.formatUIApiDataToStorage(this.model);
    await (formData.apiUuid ? this.editAPI(formData, ux) : this.addAPI(formData, ux));
    this.isSaving = false;
  }
  async addAPI(formData, ux) {
    const [result, err] = await this.effect.addAPI(formData);
    if (err) {
      this.feedback.error($localize`Added failed`);
      return;
    }
    this.feedback.success($localize`Added successfully`);
    this.trace.report('add_api_document_success', {
      trigger_way: ux,
      workspace_type: this.globalStore.isLocal ? 'local' : 'cloud',
      param_type: IMPORT_MUI[this.model.apiAttrInfo.contentType] || ''
    });
    this.router.navigate([this.tabsConfig.pathByName[PageUniqueName.HttpDetail]], {
      queryParams: {
        pageID: Number(this.route.snapshot.queryParams.pageID),
        uuid: result?.apiUuid
      }
    });
    this.afterSaved.emit(this.model);
  }
  async editAPI(formData, ux) {
    const [result, err] = await this.apiEdit.editApi(formData);
    if (err) {
      this.feedback.error($localize`Edited failed`);
      return;
    }
    this.feedback.success($localize`Edited API successfully`);
    this.afterSaved.emit(this.model);
  }
  emitChangeFun() {
    this.modelChange.emit(this.model);
  }
  /**
   * Judge has edit manualy
   */
  isFormChange(): boolean {
    if (!(this.initialModel && this.model)) {
      return false;
    }
    const origin = this.apiEditUtil.formatEditingApiData(this.initialModel);
    const after = this.apiEditUtil.formatEditingApiData(this.model);

    console.log('api edit origin:', origin, 'after:', after);

    if (!isEqual(origin, after)) {
      console.log('api edit formChange true!', getDifference(origin, after));
      return true;
    }
    return false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.reactions.forEach(reaction => reaction());
  }
  /**
   * Rest need generate from url from initial model
   *
   * @param url
   */
  private resetRestFromUrl(url: string) {
    //Need On push reset params
    this.model.requestParams.restParams = [...generateRestFromUrl(url, this.model.requestParams.restParams)];
  }
  /**
   *
   * Get valid group id
   *
   * @returns valid group id
   */
  getValidGroupID() {
    const groupID = this.model?.groupId || Number(this.route.snapshot.queryParams.groupId);

    //Default from path or root group id
    if (!groupID) {
      return this.store.getRootGroup.id;
    }

    //If group has be deleted,reset to root group
    const groupObj = new PCTree(this.groups);
    const existGroup = groupObj.findTreeNodeByID(groupID);
    if (!existGroup) {
      return this.store.getRootGroup.id;
    }
    return groupID;
  }
  setGroupInfo() {
    if (!this.store.getRootGroup || !this.groups.length) return;
    this.model.groupId = this.getValidGroupID();
    this.validateForm.patchValue({
      groupId: this.model.groupId
    });
    this.expandKeys = getExpandGroupByKey(this.apiGroup, this.model.groupId);
  }
  /**
   * Init basic form,such as url,method
   */
  private initBasicForm() {
    //Prevent init error
    if (!this.model) {
      this.model = {} as ApiData;
    }
    const controls = {
      requestMethod: [this.model?.apiAttrInfo?.requestMethod, [Validators.required]],
      groupId: [this.model.groupId || 0, [Validators.required]]
    };
    ['uri', 'name'].forEach(name => {
      controls[name] = [this.model[name] || '', [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
  private watchBasicForm() {
    this.validateForm.valueChanges.subscribe(x => {
      // Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      Promise.resolve().then(() => {
        //Reset model
        Object.assign(this.model, {
          uri: x.uri,
          name: x.name,
          groupId: x.groupId
        });
        this.model.apiAttrInfo.requestMethod = x.requestMethod;

        this.emitChangeFun();
      });
    });
    // this.validateForm.get('uri').valueChanges.subscribe(uri => {
    //   this.showEnvTips = false;
    //   try {
    //     const url = new URL(uri);
    //     if (url.host) {
    //       this.showEnvTips = true;
    //       console.log(this.showEnvTips);
    //     }
    //   } catch (e) {}
    // });
  }
}
