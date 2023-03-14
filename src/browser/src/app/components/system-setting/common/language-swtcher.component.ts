import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LanguageService } from 'pc/browser/src/app/core/services/language/language.service';

@Component({
  selector: 'eo-language-switcher',
  template: `
    <eo-ng-select
      i18n-nzPlaceHolder="@@Language"
      nzPlaceHolder="Language"
      [ngModel]="model['system.language']"
      (ngModelChange)="handleChange($event)"
      [nzCustomTemplate]="defaultTemplate"
    >
      <eo-ng-option *ngFor="let item of languageService.languages" nzCustomContent [nzValue]="item.value" [nzLabel]="item.name">
        {{ item.name }}
      </eo-ng-option>
    </eo-ng-select>
    <ng-template #defaultTemplate let-selected>
      <eo-iconpark-icon name="translate" size="18px"></eo-iconpark-icon>
      {{ selected.nzLabel }}
    </ng-template>
  `,
  styles: [
    `
      [nz-form]:not(.ant-form-inline):not(.ant-form-vertical) {
        max-width: 600px;
      }

      ::ng-deep .ant-select:not(.ant-select-customize-input) .ant-select-selector {
        transition: none;
      }
    `
  ]
})
export class LanguageSwticherComponent implements OnInit {
  @Input() model: object = {};
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    this.model['system.language'] = this.languageService.systemLanguage;
  }

  handleChange(localeID) {
    this.model['system.language'] = localeID;
    this.modelChange.emit(this.model);
    this.languageService.changeLanguage(localeID);
  }
}
