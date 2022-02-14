import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';

import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil, pairwise, filter } from 'rxjs/operators';
import { MessageService } from '../../../shared/services/message';

import { Group, ApiData, RequestProtocol, RequestMethod, ApiEditRest } from 'eoapi-core';
import { StorageService } from '../../../shared/services/storage.service';
import { ApiTabService } from '../tab/api-tab.service';

import { objectToArray } from '../../../utils';
import { getRest } from '../../../utils/api';
import { treeToListHasLevel, listToTree, listToTreeHasLevel } from '../../../utils/tree';
import { ApiParamsNumPipe } from '../../../shared/pipes/api-param-num.pipe';
@Component({
  selector: 'eo-api-edit-edit',
  templateUrl: './api-edit.component.html',
  styleUrls: ['./api-edit.component.scss'],
})
export class ApiEditComponent implements OnInit, OnDestroy {
  @ViewChild('apiGroup') apiGroup: NzTreeSelectComponent;
  validateForm!: FormGroup;
  apiData: ApiData;
  groups: any[];
  expandKeys: string[];
  REQUEST_METHOD = objectToArray(RequestMethod);
  REQUEST_PROTOCOL = objectToArray(RequestProtocol);

  private destroy$: Subject<void> = new Subject<void>();
  private changeGroupID$: Subject<string | number> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private messageService: MessageService,
    private storage: StorageService,
    private apiTab: ApiTabService
  ) {}
  getApiGroup() {
    this.groups = [];
    this.storage.storage.groupLoadAllByProjectID(1).subscribe((items: Array<Group>) => {
      const treeItems: any = [
        {
          title: '根目录',
          //!actually is 0,but 0 will hidden in nz component,so use -1 replace 0
          key: '-1',
          weight: 0,
          parentID: '0',
          isLeaf: false,
        },
      ];
      items.forEach((item) => {
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
      listToTree(treeItems, this.groups, '0');
      this.afterInitGroup();
    });
  }
  getApi(id) {
    this.storage.storage.apiDataLoad(id).subscribe((result: ApiData) => {
      ['requestBody', 'responseBody'].forEach((tableName) => {
        if (['xml', 'json'].includes(result[`${tableName}Type`])) {
          result[tableName] = treeToListHasLevel(result[tableName]);
        }
      });
      this.apiData = result;
      this.changeGroupID$.next(this.apiData.groupID);
      this.validateForm.patchValue(this.apiData);
    });
  }
  saveApi() {
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
    const formData: any = Object.assign({}, this.apiData, this.validateForm.value);
    formData.groupID = Number(formData.groupID === '-1' ? '0' : formData.groupID);
    ['requestBody', 'queryParams', 'restParams', 'requestHeaders', 'responseHeaders', 'responseBody'].forEach(
      (tableName) => {
        if (typeof this.apiData[tableName] !== 'object') {
          return;
        }
        formData[tableName] = this.apiData[tableName].filter((val) => val.name);
        if (['requestBody', 'responseBody'].includes(tableName)) {
          if (['xml', 'json'].includes(formData[`${tableName}Type`])) {
            formData[tableName] = listToTreeHasLevel(formData[tableName]);
          }
        }
      }
    );

    this.editApi(formData);
  }
  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }
  ngOnInit(): void {
    this.getApiGroup();
    this.initApi(Number(this.route.snapshot.queryParams.uuid));
    this.watchTabChange();
    this.watchGroupIDChange();
    this.watchUri();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private initApi(id) {
    this.resetForm();
    this.initBasicForm();
    //recovery from tab
    if (this.apiTab.currentTab && this.apiTab.tabCache[this.apiTab.tabID]) {
      let tabData = this.apiTab.tabCache[this.apiTab.tabID];
      this.apiData = tabData.apiData;
      return;
    }
    if (!id) {
      let tmpApiData = window.sessionStorage.getItem('apiDataWillbeSave');
      if (tmpApiData) {
        //Add From Test|Copy Api
        window.sessionStorage.removeItem('apiDataWillbeSave');
        Object.assign(this.apiData, JSON.parse(tmpApiData));
        this.validateForm.patchValue(this.apiData);
      } else {
        //Add directly
        Object.assign(this.apiData, {
          requestBodyType: 'json',
          requestBodyJsonType: 'object',
          requestBody: [],
          queryParams: [],
          restParams: [],
          requestHeaders: [],
          responseHeaders: [],
          responseBodyType: 'json',
          responseBodyJsonType: 'object',
          responseBody: [],
        });
      }
    } else {
      this.getApi(id);
    }
  }
  private watchTabChange() {
    this.apiTab.tabChange$
      .pipe(
        pairwise(),
        //actually change tab,not init tab
        filter((data) => data[0].uuid !== data[1].uuid),
        takeUntil(this.destroy$)
      )
      .subscribe(([nowTab, nextTab]) => {
        this.apiTab.saveTabData$.next({
          tab: nowTab,
          data: {
            apiData: this.apiData,
          },
        });
        this.initApi(nextTab.key);
      });
  }
  private watchGroupIDChange() {
    this.changeGroupID$.pipe(debounceTime(500), take(1)).subscribe((id) => {
      this.apiData.groupID = (this.apiData.groupID === 0 ? -1 : this.apiData.groupID).toString();
      this.expandGroup();
    });
  }
  /**
   * Generate Rest Param From Url
   */
  private watchUri() {
    this.validateForm
      .get('uri')
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((url) => {
        const rests = getRest(url);
        rests.forEach((newRest) => {
          if (this.apiData.restParams.find((val: ApiEditRest) => val.name === newRest)) {
            return;
          }
          const restItem: ApiEditRest = {
            name: newRest,
            required: true,
            example: '',
            description: '',
          };
          this.apiData.restParams.splice(this.apiData.restParams.length - 1, 0, restItem);
        });
      });
  }
  /**
   * Reset Group ID after group list load
   */
  private afterInitGroup() {
    const groupID = this.apiData.groupID;
    this.apiData.groupID = '';
    setTimeout(() => {
      this.apiData.groupID = groupID;
      this.changeGroupID$.next(groupID);
    }, 0);
  }
  /**
   * Expand Select Group
   */
  private expandGroup() {
    let treeNode = this.apiGroup.getTreeNodeByKey(this.apiData.groupID.toString());
    if (!treeNode) {
      return;
    }
    const expandKeys = [];
    while (treeNode.parentNode) {
      expandKeys.push(treeNode.parentNode.key);
      treeNode = treeNode.parentNode;
    }
    this.expandKeys = expandKeys;
  }
  /**
   * Init basic form,such as url,protocol,method
   */
  private initBasicForm() {
    const controls = {};
    ['protocol', 'method', 'uri', 'groupID', 'name'].forEach((name) => {
      controls[name] = [this.apiData[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
  /**
   * Init API data structure
   */
  private resetForm() {
    this.apiData = {
      name: '',
      projectID: 1,
      uri: '/',
      groupID: this.route.snapshot.queryParams.groupID || '-1',
      protocol: RequestProtocol.HTTP,
      method: RequestMethod.POST,
    };
  }

  private editApi(formData) {

    if (formData.uuid) {
      this.storage.storage.apiDataUpdate(formData, this.apiData.uuid).subscribe(
        (result: ApiData) => {
          this.message.success('编辑成功');
          this.messageService.send({ type: 'editApi', data: result });
        });
    } else {
      this.storage.storage.apiDataCreate(formData).subscribe(
        (result: ApiData) => {
          this.message.success('新增成功');
          this.messageService.send({ type: 'addApi', data: result });
        });
    }
  }
}
