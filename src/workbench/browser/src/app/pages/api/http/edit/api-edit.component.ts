import { Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';

import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { MessageService } from '../../../../shared/services/message';
import { StorageService } from '../../../../shared/services/storage';

import {
  Group,
  ApiEditViewData,
  RequestProtocol,
  RequestMethod,
  StorageRes,
  StorageResStatus,
} from '../../../../shared/services/storage/index.model';

import { eoDeepCopy, isEmptyObj, objectToArray } from '../../../../utils';
import { listToTree, getExpandGroupByKey } from '../../../../utils/tree/tree.utils';
import { ApiParamsNumPipe } from '../../../../shared/pipes/api-param-num.pipe';
import { ApiEditService } from 'eo/workbench/browser/src/app/pages/api/http/edit/api-edit.service';
import { ApiEditUtilService } from './api-edit-util.service';
import { EoMessageService } from '../../../../eoui/message/eo-message.service';
@Component({
  selector: 'eo-api-edit-edit',
  templateUrl: './api-edit.component.html',
  styleUrls: ['./api-edit.component.scss'],
})
export class ApiEditComponent implements OnInit, OnDestroy {
  @Input() model: ApiEditViewData;
  /**
   * Intial model from outside,check form is change
   * * Usually restored from tab
   */
  @Input() initialModel: ApiEditViewData;
  @Output() modelChange = new EventEmitter<ApiEditViewData>();
  @Output() eoOnInit = new EventEmitter<ApiEditViewData>();
  @Output() afterSaved = new EventEmitter<ApiEditViewData>();
  @ViewChild('apiGroup') apiGroup: NzTreeSelectComponent;
  validateForm: FormGroup;
  groups: any[];
  initTimes = 0;
  expandKeys: string[];
  REQUEST_METHOD = objectToArray(RequestMethod);
  REQUEST_PROTOCOL = objectToArray(RequestProtocol);
  nzSelectedIndex = 1;
  private destroy$: Subject<void> = new Subject<void>();
  private changeGroupID$: Subject<string | number> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiEditUtil: ApiEditUtilService,
    private fb: FormBuilder,
    private message: EoMessageService,
    private messageService: MessageService,
    private storage: StorageService,
    private apiEdit: ApiEditService
  ) {
    this.initBasicForm();
  }
  /**
   * Init Api Data
   *
   * @param type Reset means force update apiData
   */
  async init() {
    this.initTimes++;
    const id = Number(this.route.snapshot.queryParams.uuid);
    const groupID = Number(this.route.snapshot.queryParams.groupID || 0);
    if (!this.model || isEmptyObj(this.model)) {
      this.model = {} as ApiEditViewData;
      const initTimes = this.initTimes;
      const result = await this.apiEdit.getApi({
        id,
        groupID,
      });
      //!Prevent await async ,replace current  api data
      if (initTimes >= this.initTimes) {
        this.model = result;
      }
    }
    //Storage origin api data
    if (!this.initialModel) {
      if (!id) {
        // New API/New API from other page such as test page
        this.initialModel = this.apiEdit.getPureApi({ groupID });
      } else {
        this.initialModel = eoDeepCopy(this.model);
      }
    }
    this.initBasicForm();
    this.watchBasicForm();
    this.watchUri();
    this.changeGroupID$.next(this.model.groupID);
    this.validateForm.patchValue(this.model);
    this.eoOnInit.emit(this.model);
  }
  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }
  ngOnInit(): void {
    this.getApiGroup();
    this.changeGroupID$.pipe(debounceTime(300), take(1)).subscribe((id) => {
      /**
       * Expand Select Group
       */
      this.expandKeys = getExpandGroupByKey(this.apiGroup, this.model.groupID.toString());
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
    let formData: any = Object.assign({}, this.model, this.validateForm.value);
    const busEvent = formData.uuid ? 'editApi' : 'addApi';
    const title = busEvent === 'editApi' ? $localize`Edited successfully` : $localize`Added successfully`;
    formData = this.apiEditUtil.formatSavingApiData(formData);
    const result: StorageRes = await this.apiEdit.editApi(formData);
    if (result.status === StorageResStatus.success) {
      this.message.success(title);
      this.initialModel = this.apiEditUtil.getFormdataFromApiData(eoDeepCopy(result.data));
      this.router.navigate(['/home/api/detail'], {
        queryParams: {
          pageID: Number(this.route.snapshot.queryParams.pageID),
          uuid: result.data.uuid,
        },
      });
      this.messageService.send({ type: `${busEvent}Success`, data: result.data });
    } else {
      this.message.success($localize`Failed Operation`);
    }
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
  private watchUri() {
    this.validateForm
      .get('uri')
      ?.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((url) => {
        this.apiEditUtil.generateRestFromUrl(url, this.model.restParams);
      });
  }
  private getApiGroup() {
    this.groups = [];
    const treeItems: any = [
      {
        title: $localize`Root directory`,
        //!actually is 0,but 0 will hidden in nz component,so use -1 replace 0
        key: '-1',
        weight: 0,
        parentID: '0',
        isLeaf: false,
      },
    ];
    this.storage.run('groupLoadAllByProjectID', [1], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        [].concat(result.data).forEach((item: Group) => {
          delete item.updatedAt;
          treeItems.push({
            title: item.name,
            key: item.uuid.toString(),
            weight: item.weight || 0,
            parentID: (item.parentID || 0).toString(),
            isLeaf: false,
          });
        });
        treeItems.sort((a, b) => a.weight - b.weight);
      }
      listToTree(treeItems, this.groups, '0');
      this.resetGroupID();
    });
  }
  /**
   * Reset Group ID after group list load
   * Resolve the problem that groupID change but view not change
   */
  private resetGroupID() {
    let groupID = '-1';
    if (this.model && this.model.groupID) {
      groupID = this.model.groupID;
      this.model.groupID = '';
    }
    setTimeout(() => {
      this.model.groupID = groupID;
      this.changeGroupID$.next(groupID);
    }, 0);
  }
  /**
   * Init basic form,such as url,protocol,method
   */
  private initBasicForm() {
    //Prevent init error
    if (!this.model) {
      this.model = {} as ApiEditViewData;
    }
    const controls = {};
    ['protocol', 'method', 'uri', 'groupID', 'name'].forEach((name) => {
      controls[name] = [this.model[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }

  private watchBasicForm() {
    this.validateForm.valueChanges.subscribe((x) => {
      // Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      setTimeout(() => {
        this.modelChange.emit(this.model);
      }, 0);
    });
  }
}
