import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'eo-language-switcher',
  template: `
    <div class="font-bold text-lg mb-2" i18n>Language</div>
    <nz-select
      i18n-nzPlaceHolder
      nzPlaceHolder="Language"
      [ngModel]="model['eoapi-language']"
      (ngModelChange)="handleChange($event)"
      [nzCustomTemplate]="defaultTemplate"
    >
      <nz-option *ngFor="let item of languages" nzCustomContent [nzValue]="item.value" [nzLabel]="item.name">
        <eo-iconpark-icon name="language"></eo-iconpark-icon>
        {{ item.name }}
      </nz-option>
    </nz-select>
    <ng-template #defaultTemplate let-selected>
      <eo-iconpark-icon name="language"></eo-iconpark-icon>
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
export class LanguageSwticherComponent implements OnInit {
  @Input() model: object = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  languages = [
    {
      name: 'English',
      value: 'en-US',
    },
    {
      name: '简体中文',
      value: 'zh-Hans',
    },
  ];
  constructor(private modal: NzModalService, private electron: ElectronService) {}

  ngOnInit(): void {
    this.model['eoapi-language'] ??= navigator.language.includes('zh') ? 'zh-Hans' : 'en-US';
  }

  handleChange(inputLocaleID) {
    let changeCallback = (localeID) => {
      this.model['eoapi-language'] = localeID;
      this.modelChange.emit(this.model);
      window.location.href = `/${localeID}`;
    };
    // if (this.electron.isElectron) {
    //   this.modal.warning({
    //     nzTitle: ``,
    //     nzContent:`Eoapi will need to restart after you switch the app language to ${this.languages.find(val=>val.value===inputLocaleID).name}`,
    //     nzOnOk: () => {
    //       changeCallback(inputLocaleID);
    //     },
    //   });
    // } else {
    changeCallback(inputLocaleID);
    // }
  }
}
