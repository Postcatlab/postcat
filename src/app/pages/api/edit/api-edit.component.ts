import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';

import { Observable, of, Subject } from 'rxjs';
import { switchMap, debounceTime, take, takeUntil } from 'rxjs/operators';

import { ApiEditRest } from '../../../shared/services/api-data/api-edit-params.model';
import { ApiData, RequestProtocol, RequestMethod } from '../../../shared/services/api-data/api-data.model';
import { ApiDataService } from '../../../shared/services/api-data/api-data.service';
import { MessageService } from '../../../shared/services/message';

import { Group } from '../../../shared/services/group/group.model';
import { GroupService } from '../../../shared/services/group/group.service';

import { objectToArray } from '../../../utils';
import { treeToListHasLevel, listToTree, listToTreeHasLevel } from '../../../utils/tree';
import { getRest } from '../../../utils/api';

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

  private api$: Observable<object>;
  private destroy$: Subject<void> = new Subject<void>();
  private changeGroupID$: Subject<string | number> = new Subject();

  constructor(
    private storage: ApiDataService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private messageService: MessageService,
    private groupService: GroupService
  ) {}
  getApiGroup() {
    this.groups = [];
    this.groupService.loadAllByProjectID(1).subscribe((items: Array<Group>) => {
      const treeItems: any = [
        {
          title: '根目录',
          //actually is 0,but 0 will hidden,so use -1 replace 0
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
    this.storage.load(id).subscribe((result: ApiData) => {
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

  ngOnInit(): void {
    this.getApiGroup();
    this.resetApi();
    this.initBasicForm();
    if (this.route.snapshot.queryParams.uuid) {
      //Edit
      this.watchQueryChange();
    } else {
      let testData = window.sessionStorage.getItem('testDataToAPI');
      if (testData) {
        //Add From Test
        Object.assign(
          this.apiData,
          {
            responseHeaders: [],
            responseBodyType: 'json',
            responseBodyJsonType: 'object',
            responseBody: [],
          },
          JSON.parse(testData)
        );
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
    }

    this.changeGroupID$.pipe(debounceTime(500), take(1)).subscribe((id) => {
      this.apiData.groupID = (this.apiData.groupID === 0 ? -1 : this.apiData.groupID).toString();
      this.expandGroup();
    });
    this.validateForm
      .get('uri')
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((url) => {
        this.changeUri(url);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private watchQueryChange() {
    this.api$ = this.route.queryParamMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('uuid'));
        if (!id) {
          const groupID = params.get('groupID');
          if (groupID) {
            return of({
              groupID,
            });
          }
          return of();
        }
        return of({ id });
      }),
      takeUntil(this.destroy$)
    );
    this.api$.subscribe({
      next: (inArg: any = {}) => {
        if (inArg.id) {
          this.getApi(inArg.id);
        }
        if (inArg.groupID) {
          this.apiData.groupID = inArg.groupID;
          this.changeGroupID$.next(this.apiData.groupID);
        }
      },
    });
  }
  /**
   * Generate Rest Param From Url
   */
  private changeUri(url) {
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
  private resetApi() {
    this.apiData = {
      name: '',
      projectID: 1,
      uri: '/',
      groupID: '-1',
      protocol: RequestProtocol.HTTP,
      method: RequestMethod.POST,
    };
  }

  private editApi(formData) {
    const busEvent = formData.uuid ? 'editApi' : 'apiAdd';
    const title = busEvent === 'editApi' ? '编辑成功' : '新增成功';
    this.storage[busEvent === 'editApi' ? 'update' : 'create'](formData, this.apiData.uuid).subscribe(
      (result: ApiData) => {
        this.message.success(title);
        this.messageService.send({ type: busEvent, data: result });
        this.router.navigate(['/home/api/detail'], { queryParams: { uuid: result.uuid } });
      }
    );
  }
}
