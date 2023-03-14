import { Component, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { autorun, makeObservable, observable } from 'mobx';
import { ApiStoreService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-state.service';
import { ExtensionService } from 'pc/browser/src/app/services/extensions/extension.service';
import { Group } from 'pc/browser/src/app/services/storage/db/models';
import { EoSchemaFormComponent } from 'pc/browser/src/app/shared/components/schema-form/schema-form.component';
import { FeatureInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import { PCTree } from 'pc/browser/src/app/shared/utils/tree/tree.utils';

export const noAuth = {
  name: 'none',
  label: 'No Auth'
};

export const inheritAuth = {
  name: 'inherited',
  label: 'Inherit auth from parent'
};

export type AuthInfo = {
  authType: string;
  authInfo: Record<string, any>;
};

export type AuthIn = 'group' | 'api-test' | 'api-test-history';

@Component({
  selector: 'authorization-extension-form',
  template: `
    <form nz-form nzLayout="vertical">
      <nz-form-item>
        <nz-form-label nzFor="authType" i18n>Type</nz-form-label>
        <nz-form-control>
          <eo-ng-radio-group name="authType" id="authType" [(ngModel)]="model.authType" (ngModelChange)="handleAuthTypeChange($event)">
            <label *ngFor="let item of authTypeList" eo-ng-radio [nzValue]="item.name">
              {{ item.label }}
            </label>
          </eo-ng-radio-group>
        </nz-form-control>
      </nz-form-item>
    </form>
    <nz-divider></nz-divider>
    <div class="my-[24px]">
      <ng-container *ngIf="inheritAuth.name === model.authType && parentGroup?.depth !== 0">
        <div class="text-tips" i18n>
          This API Request is using <b>{{ model.authType }}</b> from
          <a (click)="nav2group()">{{ parentGroup?.name }}</a>
        </div>
      </ng-container>
      <ng-container *ngIf="!isDefaultAuthType">
        <eo-ng-feedback-alert class="block my-[20px]" nzType="warning" [nzMessage]="templateRefMsg" nzShowIcon></eo-ng-feedback-alert>
        <ng-template #templateRefMsg>
          <div class="text" i18n>
            These parameters hold sensitive data. To keep this data secure while working in a collaborative environment, we recommend using
            variables. Learn more about
            <a href="https://docs.postcat.com/docs/global-variable.html" target="_blank" rel="noopener noreferrer">variables</a>
          </div>
        </ng-template>
      </ng-container>

      <ng-container *ngIf="schemaObj">
        <eo-schema-form #schemaForm [model]="model.authInfo" [configuration]="schemaObj" (valueChanges)="handleValueChanges($event)" />
      </ng-container>
    </div>
  `
})
export class AuthorizationExtensionFormComponent implements OnChanges {
  @Input() @observable groupInfo: Partial<Group>;
  @Input() model: AuthInfo;
  @Input() type: AuthIn = 'group';
  @Output() readonly modelChange = new EventEmitter<AuthInfo>();
  @ViewChild('schemaForm') schemaForm: EoSchemaFormComponent;
  inheritAuth = inheritAuth;
  schemaObj: Record<string, any> | null;
  authAPIMap: Map<string, FeatureInfo> = new Map();
  extensionList: Array<typeof noAuth> = [];

  parentGroup: Group;

  get validateForm() {
    return this.schemaForm?.validateForm;
  }

  get authType() {
    if (this.type !== 'group') {
      return noAuth;
    }
    return this.parentGroup?.depth ? inheritAuth : noAuth;
  }

  get isDefaultAuthType() {
    return [inheritAuth.name, noAuth.name].includes(this.model.authType);
  }

  get authTypeList() {
    return [this.authType, ...this.extensionList];
  }

  constructor(private router: Router, private extensionService: ExtensionService, private store: ApiStoreService) {
    makeObservable(this);
    this.initExtensions();
    this.getApiGroup();
  }

  getApiGroup() {
    autorun(() => {
      if (!this.groupInfo?.parentId) return;
      const groupObj = new PCTree(this.store.getGroupTree);
      this.parentGroup = groupObj.findGroupByID(this.groupInfo.parentId);
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
    if (model && (!isEqual(this.model, model?.previousValue) || this.model?.authType !== model?.previousValue?.authType)) {
      this.handleAuthTypeChange(this.model.authType);
    }
  }

  handleValueChanges(values) {
    // console.log('handleValueChanges', values);
    this.modelChange.emit(this.model);
  }
  handleAuthTypeChange(authType) {
    if (this.authAPIMap.has(authType)) {
      this.schemaObj = this.authAPIMap.get(authType).configuration;
    } else {
      this.schemaObj = null;
    }
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
