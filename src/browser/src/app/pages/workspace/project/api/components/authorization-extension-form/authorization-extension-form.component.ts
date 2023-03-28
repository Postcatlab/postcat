import { Component, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { autorun, makeObservable, observable } from 'mobx';
import {
  AuthIn,
  AuthInfo,
  INHERIT_AUTH_OPTION,
  isInherited,
  NONE_AUTH_OPTION
} from 'pc/browser/src/app/pages/workspace/project/api/constants/auth.model';
import { ApiStoreService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-state.service';
import { ExtensionService } from 'pc/browser/src/app/services/extensions/extension.service';
import { Group } from 'pc/browser/src/app/services/storage/db/models';
import { EoSchemaFormComponent } from 'pc/browser/src/app/shared/components/schema-form/schema-form.component';
import { AUTH_API } from 'pc/browser/src/app/shared/constans/featureName';
import { ExtensionChange } from 'pc/browser/src/app/shared/decorators';
import { FeatureInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import { PCTree } from 'pc/browser/src/app/shared/utils/tree/tree.utils';
import { Subject } from 'rxjs';

const authInMap = {
  group: $localize`API Group`,
  'api-test': $localize`API Request`
};

@Component({
  selector: 'authorization-extension-form',
  template: `
    <ng-container *ngIf="model">
      <extension-feedback [extensionLength]="authTypeList.length" suggest="@feature:authAPI" [tipsText]="tipsText">
        <form nz-form nzLayout="vertical">
          <nz-form-item>
            <nz-form-label nzFor="authType" i18n>Type</nz-form-label>
            <nz-form-control>
              <eo-ng-radio-group name="authType" id="authType" [(ngModel)]="authType" (ngModelChange)="handleAuthTypeChange($event)">
                <label *ngFor="let item of authTypeList" eo-ng-radio [nzValue]="item.name">
                  {{ item.label }}
                </label>
              </eo-ng-radio-group>
            </nz-form-control>
          </nz-form-item>
        </form>
      </extension-feedback>
      <nz-divider></nz-divider>
      <div class="my-[24px]">
        <ng-container *ngIf="authType === inheritAuth.name && parentGroup?.depth !== 0">
          <div class="text-tips" i18n>
            This {{ authInMap[type] }} is using <b>{{ inheritAuthType || model.authType }}</b> from
            <a (click)="nav2group()">{{ parentGroup?.name }}</a>
          </div>
        </ng-container>
        <ng-container *ngIf="!isDefaultAuthType">
          <eo-ng-feedback-alert class="block my-[20px]" nzType="warning" [nzMessage]="templateRefMsg" nzShowIcon></eo-ng-feedback-alert>
          <ng-template #templateRefMsg>
            <div class="text" i18n>
              These parameters hold sensitive data. To keep this data secure while working in a collaborative environment, we recommend
              using variables. Learn more about
              <a href="https://docs.postcat.com/docs/global-variable.html" target="_blank" rel="noopener noreferrer">variables</a>
            </div>
          </ng-template>
          <ng-container *ngIf="model.authInfo && schemaObj">
            <eo-schema-form #schemaForm [model]="model.authInfo" [configuration]="schemaObj" (valueChanges)="handleValueChanges($event)" />
          </ng-container>
        </ng-container>
      </div>
    </ng-container>
  `
})
export class AuthorizationExtensionFormComponent implements OnChanges {
  @Input() @observable groupInfo: Partial<Group>;
  @Input() @observable model: AuthInfo;
  authType: string;
  @Input() inheritAuthType: string;
  @Input() type: AuthIn = 'group';
  @Output() readonly modelChange = new EventEmitter<AuthInfo>();
  @Output() readonly authTypeChange = new EventEmitter<string>();
  @ViewChild('schemaForm') schemaForm: EoSchemaFormComponent;
  authInMap = authInMap;
  inheritAuth = INHERIT_AUTH_OPTION;
  noAuth = NONE_AUTH_OPTION;
  schemaObj: Record<string, any> | null;
  authAPIMap: Map<string, FeatureInfo> = new Map();
  extensionList: Array<typeof NONE_AUTH_OPTION> = [];

  parentGroup: Partial<Group>;

  tipsText = $localize`Authorization`;

  private destroy$: Subject<void> = new Subject<void>();

  get validateForm() {
    return this.schemaForm?.validateForm;
  }

  // get defaultAuthType() {

  // }

  get isDefaultAuthType() {
    return [INHERIT_AUTH_OPTION.name, NONE_AUTH_OPTION.name].includes(this.authType);
  }

  get authTypeList() {
    const isRootGroup =
      this.parentGroup && (Reflect.has(this.parentGroup, 'depth') ? this.parentGroup.depth : this.parentGroup?.depth !== 0);
    if (isRootGroup && this.type !== 'api-test-history') return [INHERIT_AUTH_OPTION, NONE_AUTH_OPTION, ...this.extensionList];
    return [NONE_AUTH_OPTION, ...this.extensionList];
  }

  constructor(private router: Router, private extensionService: ExtensionService, private store: ApiStoreService) {
    makeObservable(this);
    this.initExtensions();
    this.initAutorun();
    this.watchInstalledExtensionsChange();
  }

  @ExtensionChange(AUTH_API)
  watchInstalledExtensionsChange() {
    this.initExtensions();
    this.updateSchema(this.authType);
  }

  init() {
    this.authType = '';
    this.parentGroup = undefined;
  }

  initAutorun() {
    autorun(() => {
      if (!this.groupInfo?.parentId) return;
      const groupObj = new PCTree(this.store.getFolderList);
      this.parentGroup = groupObj.findTreeNodeByID(this.groupInfo.parentId);
    });
    autorun(() => {
      if (!this.authType && this.model?.isInherited === isInherited.inherit) {
        this.authType = INHERIT_AUTH_OPTION.name;
        return;
      }
      if (this.model?.isInherited === isInherited.notInherit) {
        this.authType = this.model?.authType;
      }
    });
  }

  initExtensions() {
    this.authAPIMap = this.extensionService.getValidExtensionsByFature('authAPI');
    // console.log('authAPIMap', this.authAPIMap);
    this.extensionList = [];
    this.authAPIMap.forEach((value, key) => {
      this.extensionList.push({ name: key, label: value.label });
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    const { model } = changes;
    // console.log('this.model.inherited', this.model);
    if (model && (!isEqual(this.model, model?.previousValue) || this.model?.authType !== model?.previousValue?.authType)) {
      if (this.model.authType !== INHERIT_AUTH_OPTION.name) {
        // console.log('this.authType', this.authType);
        this.updateSchema(this.authType);
      }
    }
  }

  handleValueChanges(values) {
    // console.log('handleValueChanges', values);
    this.modelChange.emit(this.model);
  }
  updateSchema(authType) {
    if (this.authAPIMap.has(authType)) {
      this.schemaObj = this.authAPIMap.get(authType).configuration;
    } else {
      this.schemaObj = null;
    }
  }
  handleAuthTypeChange(authType) {
    this.updateSchema(authType);
    this.model.authType = authType;
    console.log('handleAuthTypeChange', authType, this.schemaObj);
  }

  nav2group() {
    this.router.navigate([`/home/workspace/project/api/group/edit`], {
      queryParams: { uuid: this.parentGroup.id, pageID: Date.now().toString() }
    });
  }

  checkForm() {
    if (this.validateForm?.status === 'INVALID') {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }
    return true;
  }
}
