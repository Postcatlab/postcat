import { Component, Input, OnInit } from '@angular/core';
import { ApiMockService } from 'eo/workbench/browser/src/app/pages/api/http/mock/api-mock.service';

@Component({
  selector: 'eo-api-mock-edit',
  providers: [ApiMockService],
  template: ` <div class="w-full main-content">
    <form nz-form nzLayout="vertical">
      <nz-form-item>
        <nz-form-label i18n nzFor="model.name">Mock Name</nz-form-label>
        <nz-form-control>
          <input eo-ng-input required name="name" type="text" [(ngModel)]="model.name" [readonly]="!isEdit" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item class="mb-0">
        <nz-form-label i18n nzFor="model.response">Response</nz-form-label>
        <nz-form-control>
          <eo-monaco-editor
            [(code)]="model.response"
            [maxLine]="15"
            class="h-[200px] border-all"
            [config]="{ readOnly: !isEdit }"
            [eventList]="['type', 'format', 'copy', 'search', 'replace']"
          >
          </eo-monaco-editor>
        </nz-form-control>
      </nz-form-item>
    </form>
  </div>`,
})
export class ApiMockEditComponent implements OnInit {
  @Input() model;
  @Input() isEdit = true;
  constructor(private apiMock: ApiMockService) {}
  ngOnInit(): void {}
}
