import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'extension-select',
  templateUrl: './extension-select.component.html',
  styleUrls: ['./extension-select.component.scss'],
})
export class ExtensionSelectComponent {
  @Input() extensionList: any = [];
  @Input() extension = '';
  @Output() extensionChange = new EventEmitter<string>();

  selectExtension({ key }) {
    this.extensionChange.emit(key);
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
