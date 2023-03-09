import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EoSchemaFormComponent } from 'pc/browser/src/app/shared/components/schema-form/schema-form.component';
import { FeatureInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import { ExtensionService } from 'pc/browser/src/app/shared/services/extensions/extension.service';
import { ApiService } from 'pc/browser/src/app/shared/services/storage/api.service';
import { Group } from 'pc/browser/src/app/shared/services/storage/db/models';

export const noAuth = {
  name: 'none',
  label: 'No Auth'
};

export const inheritAuth = {
  name: 'inherited',
  label: 'Inherit auth from parent'
};

@Component({
  selector: 'authorization-extension-form',
  template: `
    <form nz-form nzLayout="vertical" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-label i18n>Type</nz-form-label>
        <nz-form-control>
          <eo-ng-radio-group formControlName="authType" (ngModelChange)="handleAuthTypeChange($event)">
            <label *ngFor="let item of authTypeList" eo-ng-radio [nzValue]="item.name">
              {{ item.label }}
            </label>
          </eo-ng-radio-group>
        </nz-form-control>
      </nz-form-item>
    </form>
    <nz-divider></nz-divider>
    <div class="my-[24px]">
      <ng-container *ngIf="inheritAuth.name === validateForm.value.authType">
        <div class="text-tips" i18n>
          This API Request is using <b>{{ validateForm.value.authType }}</b> from
          <a (click)="navigate2group()">{{ groupInfo?.name }}</a>
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
        <eo-schema-form #schemaForm [model]="model" [configuration]="schemaObj" (valueChanges)="handleValueChanges($event)" />
      </ng-container>
    </div>
  `
})
export class AuthorizationExtensionFormComponent implements OnInit, OnChanges {
  @Input() groupID: number;
  @ViewChild('schemaForm') schemaForm: EoSchemaFormComponent;
  groupInfo: Group;
  model: Record<string, any> = {};
  inheritAuth = inheritAuth;
  validateForm!: UntypedFormGroup;
  schemaObj: Record<string, any> | null;
  authAPIMap: Map<string, FeatureInfo>;

  get authType() {
    return this.groupInfo?.depth ? inheritAuth : noAuth;
  }

  get isDefaultAuthType() {
    return [inheritAuth.name, noAuth.name].includes(this.validateForm.value.authType);
  }

  get authTypeList() {
    return [this.authType, ...this.extensionList];
  }

  extensionList: Array<typeof noAuth> = [];

  constructor(
    private fb: UntypedFormBuilder,
    private apiService: ApiService,
    private router: Router,
    private extensionService: ExtensionService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      authType: this.groupID ? inheritAuth.name : noAuth.name,
      fieldA: [null, [Validators.required]],
      filedB: [null, [Validators.required]]
    });
    this.initExtensions();
  }

  initExtensions() {
    this.authAPIMap = this.extensionService.getValidExtensionsByFature('authAPI');
    console.log('authAPIMap', this.authAPIMap);
    this.extensionList = [];
    this.authAPIMap.forEach((value, key) => {
      this.extensionList.push({ name: key, label: value.label });
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    const { groupID } = changes;

    if (groupID?.currentValue !== groupID?.previousValue) {
      await this.getGroupInfo();
      setTimeout(() => {
        if (this.groupInfo.depth === 0 && this.validateForm.value.authType === inheritAuth.name) {
          this.validateForm.get('authType')?.setValue?.(noAuth.name);
        } else if (this.isDefaultAuthType) {
          this.validateForm.get('authType')?.setValue?.(this.authType.name);
        }
      });
    }
  }

  async getGroupInfo() {
    const [res, err]: any = await this.apiService.api_groupDetail({ id: this.groupID });
    this.groupInfo = res;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleValueChanges(values) {
    console.log('handleValueChanges', values);
  }
  handleAuthTypeChange(authType) {
    if (this.authAPIMap.has(authType)) {
      this.schemaObj = this.authAPIMap.get(authType).configuration;
    } else {
      this.schemaObj = null;
    }
    console.log('handleAuthTypeChange', authType);
  }

  navigate2group() {
    if (this.groupInfo.depth === 0) {
      return;
    }
    this.router.navigate([`/home/workspace/project/api/group/edit`], {
      queryParams: { groupId: this.groupID, pageID: Date.now().toString() }
    });
  }
}
