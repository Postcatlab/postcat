import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

type optionType = {
  label: string;
  value: string;
};
@Component({
  selector: 'extension-select',
  templateUrl: './extension-select.component.html',
  styleUrls: ['./extension-select.component.scss'],
})
export class ExtensionSelectComponent implements OnInit {
  @Input() extensionList: any = [];
  @Input() extension = '';
  @Output() extensionChange = new EventEmitter<string>();

  // * select the first in init
  radioValue = '';
  optionList: optionType[] = [];

  ngOnInit() {
    const [target] = this.extensionList;
    Promise.resolve().then(() => {
      this.selectExtension(target);
    });
  }

  getDefaultValue(list: any[], key) {
    if (list.length === 0) {
      return '';
    }
    const [target] = list.filter((it) => it.default);
    return target[key] || '';
  }

  selectExtension({ key, properties }) {
    this.extensionChange.emit(key);
    // * update optionList
    this.optionList = Object.keys(properties).map((it) => ({ value: it, ...properties[it] }));
    this.radioValue = this.getDefaultValue(this.optionList, 'value');
  }

  parserFile(file) {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (ev) => {
      const fileString: string = ev.target.result as string;
      const json = JSON.parse(fileString);
      console.log(json);
    };
    return false;
  }
}
