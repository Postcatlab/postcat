import { Component, Input } from '@angular/core';

@Component({
  selector: 'operate-project-form',
  template: ` <div class="w-full main-content">
    <form nz-form nzLayout="vertical" auto-focus-form>
      <nz-form-item>
        <nz-form-label i18n nzFor="model.name">Project Name</nz-form-label>
        <nz-form-control>
          <input eo-ng-input required name="name" type="text" [(ngModel)]="model.name" />
        </nz-form-control>
      </nz-form-item>
    </form>
  </div>`
})
export class OperateProjectFormComponent {
  @Input() model;
}
