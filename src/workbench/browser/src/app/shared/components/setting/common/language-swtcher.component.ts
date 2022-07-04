import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';

@Component({
  selector: 'eo-language-switcher',
  template: `
    <div class="font-bold text-lg mb-2" i18n="@@Language">Language</div>
    <nz-select
      i18n-nzPlaceHolder="@@Language"
      nzPlaceHolder="Language"
      [ngModel]="model['eoapi-language']"
      (ngModelChange)="handleChange($event)"
      [nzCustomTemplate]="defaultTemplate"
    >
      <nz-option
        *ngFor="let item of languageService.languages"
        nzCustomContent
        [nzValue]="item.value"
        [nzLabel]="item.name"
      >
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
  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    this.model['eoapi-language'] = this.languageService.currentLanguage;
  }

  handleChange(localeID) {
    this.model['eoapi-language'] = localeID;
    this.modelChange.emit(this.model);
    this.languageService.changeLanguage(localeID);
  }
}
