import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'eo-api-mock-edit',
  template: ` <div class="w-full main-content">
    <form nz-form auto-focus-form nzLayout="vertical">
      <nz-form-item>
        <nz-form-label i18n nzFor="name">Mock Name</nz-form-label>
        <nz-form-control>
          <input eo-ng-input required id="name" name="name" type="text" [(ngModel)]="model.name" [readonly]="!isEdit" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item class="mb-0">
        <nz-form-label i18n nzFor="response">Response</nz-form-label>
        <nz-form-control>
          <eo-monaco-editor
            [(code)]="model.response"
            id="response"
            [autoType]="true"
            class="h-[200px] border-all"
            [config]="{ readOnly: !isEdit }"
            [eventList]="['type', 'format', 'copy', 'search', 'replace']"
          >
          </eo-monaco-editor>
        </nz-form-control>
      </nz-form-item>
    </form>
  </div>`
})
export class ApiMockEditComponent {
  @Input() model;
  @Input() isEdit = true;
}
