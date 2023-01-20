import { Component, ViewChild, OnDestroy, Input, Output, EventEmitter, OnInit, ViewChildren, TemplateRef, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiBodyType, RequestMethod } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { ApiEditService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/edit/api-edit.service';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { generateRestFromUrl } from 'eo/workbench/browser/src/app/utils/api';
import { getExpandGroupByKey } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { autorun, toJS } from 'mobx';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ApiParamsNumPipe } from '../../../../../../modules/api-shared/api-param-num.pipe';
import { eoDeepCopy, isEmptyObj, enumsToArr } from '../../../../../../utils/index.utils';
import { ApiEditUtilService } from './api-edit-util.service';
import { ApiEditBodyComponent } from './body/api-edit-body.component';

@Component({
  selector: 'eo-api-edit-edit',
  templateUrl: './api-edit.component.html',
  styleUrls: ['./api-edit.component.scss']
})
export class ApiEditComponent implements OnDestroy {
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
  validateForm: FormGroup;
  groups: any[];
  initTimes = 0;
  expandKeys: string[];
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
    private message: EoNgFeedbackMessageService,
    private effect: EffectService,
    private apiEdit: ApiEditService,
    private store: StoreService
  ) {
    this.initShortcutKey();
    this.initBasicForm();
  }
  /**
   * Init Api Data
   *
   * @param type Reset means force update apiData
   */
  async init() {
    this.initTimes++;
    const id = this.route.snapshot.queryParams.uuid;
    const groupId = Number(this.route.snapshot.queryParams.groupId);
    if (!this.model || isEmptyObj(this.model)) {
      this.model = {} as ApiData;
      const initTimes = this.initTimes;
      const result = await this.apiEdit.getApi({
        id,
        groupId
      });
      //!Prevent await async ,replace current  api data
      if (initTimes >= this.initTimes) {
        this.model = result;
      }
    }
    //* Rest need generate from url from initial model
    this.resetRestFromUrl(this.model.uri);
    //Storage origin api data
    if (!this.initialModel) {
      if (!id) {
        // New API/New API from other page such as test page
        this.initialModel = this.apiEdit.getPureApi({ groupId });
      } else {
        this.initialModel = eoDeepCopy(this.model);
      }
    }
    this.getApiGroup();
    this.initBasicForm();
    this.watchBasicForm();
    this.validateForm.patchValue(this.model);
    this.eoOnInit.emit(this.model);
    setTimeout(() => {
      //TODO optimize
      this.editBody.init();
      this.resEditBody.init();
    }, 0);
  }

  initShortcutKey() {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: KeyboardEvent) => {
        const { ctrlKey, metaKey, code } = event;
        // 判断 Ctrl+S
        if ([ctrlKey, metaKey].includes(true) && code === 'KeyS') {
          console.log('Ctrl + s');
          // 或者 return false;
          event.preventDefault();
          this.saveApi();
        }
      });
  }

  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }
  openGroup() {}
  async saveApi() {
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
    let formData: any = this.getFormdata();
    const busEvent = formData.apiUuid ? 'editApi' : 'addApi';
    const title = busEvent === 'editApi' ? $localize`Edited successfully` : $localize`Added successfully`;
    formData = this.apiEditUtil.formatUIApiDataToStorage(formData);
    pcConsole.log('saveAPI', formData);
    const [result, err] = await this.apiEdit.editApi(formData);
    if (err) {
      this.message.error($localize`Failed Operation`);
      return;
    }
    // Add success
    this.message.success(title);
    this.initialModel = this.apiEditUtil.formatEditingApiData(this.getFormdata());
    if (busEvent === 'addApi') {
      this.router.navigate(['/home/workspace/project/api/http/detail'], {
        queryParams: {
          pageID: Number(this.route.snapshot.queryParams.pageID),
          uuid: result?.apiUuid
        }
      });
    }
    this.effect.getGroupList();
    this.afterSaved.emit(this.initialModel);
  }
  emitChangeFun() {
    this.modelChange.emit(this.getFormdata());
  }
  /**
   * Judge has edit manualy
   */
  isFormChange(): boolean {
    if (!(this.initialModel && this.model)) {
      return false;
    }
    console.log(
      'api edit origin:',
      this.apiEditUtil.formatEditingApiData(this.initialModel),
      'after:',
      this.apiEditUtil.formatEditingApiData(this.getFormdata())
    );
    const originText = JSON.stringify(this.apiEditUtil.formatEditingApiData(this.initialModel));
    const afterText = JSON.stringify(this.apiEditUtil.formatEditingApiData(this.getFormdata()));
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
  getApiGroup() {
    autorun(() => {
      this.groups = this.store.getGroupTree;
      if (!this.model.groupId) {
        this.model.groupId = this.model.groupId || this.store.getRootGroup.id;
        if (this.initialModel) {
          this.initialModel.groupId = this.model.groupId;
        }
      }
      setTimeout(() => {
        //@ts-ignore
        const existGroup = this.apiGroup?.getTreeNodeByKey(this.model.groupId);
        this.expandKeys = getExpandGroupByKey(this.apiGroup, this.model.groupId);
        if (!existGroup) {
          this.model.groupId = this.store.getRootGroup.id;
        }
      }, 0);
    });
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
    pcConsole.log('initBasicForm', controls);
  }
  private getFormdata(): ApiData {
    const result = {
      ...this.model,
      name: this.validateForm.value.name,
      uri: this.validateForm.value.uri,
      groupId: this.validateForm.value.groupId
    };
    result.apiAttrInfo.requestMethod = this.validateForm.value.requestMethod;
    return result;
  }
  private watchBasicForm() {
    this.validateForm.valueChanges.subscribe(x => {
      // Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      setTimeout(() => {
        this.emitChangeFun();
      }, 0);
    });
    //watch uri
    this.validateForm
      .get('uri')
      ?.valueChanges.pipe(debounceTime(800), takeUntil(this.destroy$))
      .subscribe(url => {
        this.resetRestFromUrl(url);
      });
  }
}
