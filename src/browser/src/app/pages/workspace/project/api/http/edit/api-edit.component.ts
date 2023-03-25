import { Component, ViewChild, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun } from 'mobx';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { EditTabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { ApiBodyType, IMPORT_MUI, RequestMethod } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ApiEditService } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit.service';
import { generateRestFromUrl, syncUrlAndQuery } from 'pc/browser/src/app/pages/workspace/project/api/utils/api.utils';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { getExpandGroupByKey, PCTree } from 'pc/browser/src/app/shared/utils/tree/tree.utils';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { eoDeepCopy, isEmptyObj, enumsToArr, waitNextTick } from '../../../../../../shared/utils/index.utils';
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
    private trace: TraceService
  ) {
    this.initBasicForm();
    //Get group list
    autorun(() => {
      if (!this.store.getRootGroup) return;
      this.groups = this.store.getFolderList;
    });
  }
  /**
   * Init Api Data
   *
   * @param type Reset means force update apiData
   */
  public async afterTabActivated() {
    const id = this.route.snapshot.queryParams.uuid;
    const groupId = Number(this.route.snapshot.queryParams.groupId);
    if (!this.model || isEmptyObj(this.model)) {
      this.model = {} as ApiData;
      this.model = await this.apiEdit.getApi({
        id,
        groupId
      });
    }

    //* Rest need generate from url from initial model
    this.resetRestFromUrl(this.model.uri);
    this.setGroupInfo();

    this.initBasicForm();
    this.watchBasicForm();
    this.validateForm.patchValue(this.model);

    this.eoOnInit.emit(this.model);
    waitNextTick().then(() => {
      this.editBody.init();
      this.resEditBody.init();
      this.expandKeys = getExpandGroupByKey(this.apiGroup, id);
    });
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
    const [result, err] = await this.apiEdit.addApi(formData);
    if (err) {
      this.feedback.error($localize`Added Operation`);
      return;
    }
    this.feedback.success($localize`Added successfully`);
    this.store.addApiSuccess(this.route.snapshot.queryParams.groupId);
    this.trace.report('add_api_document_success', {
      trigger_way: ux,
      workspace_type: this.globalStore.isLocal ? 'local' : 'cloud',
      param_type: IMPORT_MUI[this.model.apiAttrInfo.contentType] || ''
    });
    this.router.navigate(['/home/workspace/project/api/http/detail'], {
      queryParams: {
        pageID: Number(this.route.snapshot.queryParams.pageID),
        uuid: result?.apiUuid
      }
    });
    this.afterSaved.emit(this.model);
    this.effect.getGroupList();
  }
  async editAPI(formData, ux) {
    const [result, err] = await this.apiEdit.editApi(formData);
    if (err) {
      this.feedback.error($localize`Edited Operation`);
      return;
    }
    this.afterSaved.emit(this.model);
    this.effect.getGroupList();
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
    // console.log(
    //   'api edit origin:',
    //   this.apiEditUtil.formatEditingApiData(this.initialModel),
    //   'after:',
    //   this.apiEditUtil.formatEditingApiData(this.getFormdata())
    // );
    const originText = JSON.stringify(this.apiEditUtil.formatEditingApiData(this.initialModel));
    const afterText = JSON.stringify(this.apiEditUtil.formatEditingApiData(this.model));
    // console.log(`\n\n${originText}\n\n${afterText}`);
    if (originText !== afterText) {
      // console.log('api edit formChange true!', originText.split(afterText)[0]);
      return true;
    }
    return false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
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
    //Default root group id
    if (!this.model.groupId) {
      return this.store.getRootGroup.id;
    }

    //If group has be deleted,reset to root group
    const groupObj = new PCTree(this.groups);
    const existGroup = groupObj.findGroupByID(this.model.groupId);
    if (!existGroup) {
      return this.store.getRootGroup.id;
    }
  }
  setGroupInfo() {
    if (!this.store.getRootGroup) return;
    this.model.groupId = this.getValidGroupID();
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
        Object.assign(this.model, x);
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
