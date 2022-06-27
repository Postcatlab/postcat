import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'eo-language-switcher',
  template: `
    <div class="font-bold text-lg mb-2">Language</div>
    <nz-select nzPlaceHolder="Language" (ngModelChange)="(handleChange)" [nzCustomTemplate]="defaultTemplate">
      <nz-option nzCustomContent nzValue="en" nzLabel="English">
        <iconpark-icon name="language"></iconpark-icon>
        English
      </nz-option>
      <nz-option nzCustomContent nzValue="zh-cn" nzLabel="简体中文">
        <iconpark-icon name="language"></iconpark-icon>
        简体中文
      </nz-option>
    </nz-select>
    <ng-template #defaultTemplate let-selected>
      <iconpark-icon name="language"></iconpark-icon>
      {{ selected.nzLabel }}
    </ng-template>
  `,
  styles: [
    `
      [nz-form]:not(.ant-form-inline):not(.ant-form-vertical) {
        max-width: 600px;
      }
    `,
  ],
})
export class LanguageSwticherComponent {
  @Input() model: object;
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  handleChange(data) {
    this.model = data;
    this.modelChange.emit(data);
  }
}
