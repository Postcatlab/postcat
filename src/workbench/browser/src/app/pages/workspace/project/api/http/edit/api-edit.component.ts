import { Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiBodyType, RequestMethod } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { ApiEditService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/edit/api-edit.service';
import { ApiData, Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { generateRestFromUrl } from 'eo/workbench/browser/src/app/utils/api';
import { autorun, toJS } from 'mobx';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { ApiParamsNumPipe } from '../../../../../../modules/api-shared/api-param-num.pipe';
import { MessageService } from '../../../../../../shared/services/message';
import { eoDeepCopy, isEmptyObj, enumsToArr } from '../../../../../../utils/index.utils';
import { getExpandGroupByKey } from '../../../../../../utils/tree/tree.utils';
import { ApiEditUtilService } from './api-edit-util.service';

@Component({
  selector: 'eo-api-edit-edit',
  templateUrl: './api-edit.component.html',
  styleUrls: ['./api-edit.component.scss']
})
export class ApiEditComponent implements OnInit, OnDestroy {
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
  private changegroupId$: Subject<string | number> = new Subject();
  get TYPE_API_BODY(): typeof ApiBodyType {
    return ApiBodyType;
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiEditUtil: ApiEditUtilService,
    private fb: FormBuilder,
    private message: EoNgFeedbackMessageService,
    private messageService: MessageService,
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
    const groupId = Number(this.route.snapshot.queryParams.groupId || 0);
    if (!this.model || isEmptyObj(this.model)) {
      this.model = this.apiEdit.getPureApi({ groupId });
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
    pcConsole.log('api-edit', this.model);
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
    this.initBasicForm();
    this.watchBasicForm();
    this.changegroupId$.next(this.model.groupId);
    this.validateForm.patchValue(this.model);
    this.eoOnInit.emit(this.model);
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
  ngOnInit(): void {
    this.getApiGroup();
    this.changegroupId$.pipe(debounceTime(300), take(1)).subscribe(id => {
      /**
       * Expand Select Group
       */
      this.expandKeys = getExpandGroupByKey(this.apiGroup, this.model.groupId.toString());
    });
  }
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

    let formData: any = { ...this.model, ...this.validateForm.value };
    const busEvent = formData.uuid ? 'editApi' : 'addApi';
    const title = busEvent === 'editApi' ? $localize`Edited successfully` : $localize`Added successfully`;
    formData = this.apiEditUtil.formatUIApiDataToStorage(formData);
    pcConsole.log('saveAPI', formData);
    return;
    const [result, err] = await this.apiEdit.editApi(formData);
    if (err) {
      this.message.error($localize`Failed Operation`);
      return;
    }
    // Add success
    this.message.success(title);
    this.initialModel = this.apiEditUtil.formatEditingApiData({ ...this.model, ...this.validateForm.value });
    if (busEvent === 'addApi') {
      this.router.navigate(['/home/workspace/project/api/http/detail'], {
        queryParams: {
          pageID: Number(this.route.snapshot.queryParams.pageID),
          uuid: result.uuid
        }
      });
    }
    this.messageService.send({ type: `${busEvent}Success`, data: result });
    this.afterSaved.emit(this.initialModel);
  }
  emitChangeFun() {
    this.modelChange.emit(this.model);
  }
  /**
   * Judge has edit manualy
   */
  isFormChange(): boolean {
    if (!this.initialModel || !this.model) {
      return false;
    }
    // console.log(
    //   'api edit origin:',
    //   this.apiEditUtil.formatEditingApiData(this.initialModel),
    //   'after:',
    //   this.apiEditUtil.formatEditingApiData(this.model)
    // );
    const originText = JSON.stringify(this.apiEditUtil.formatEditingApiData(this.initialModel));
    const afterText = JSON.stringify(this.apiEditUtil.formatEditingApiData(this.model));
    // console.log(`\n\n${originText}\n\n${afterText}`);
    if (originText !== afterText) {
      // console.log('api edit formChange true!', originText.split(afterText));
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
    pcConsole.log(controls);
  }

  private watchBasicForm() {
    this.validateForm.valueChanges.subscribe(x => {
      // Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      setTimeout(() => {
        this.modelChange.emit(this.model);
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
