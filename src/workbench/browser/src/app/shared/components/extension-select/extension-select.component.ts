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
}
