import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { parserJsonFile } from '../../../utils/index.utils';
import { EoMessageService } from '../../../eoui/message/eo-message.service';

type optionType = {
  label: string;
  value: string;
};
@Component({
  selector: 'extension-select',
  templateUrl: './extension-select.component.html',
  styleUrls: ['./extension-select.component.scss'],
})
export class ExtensionSelectComponent {
  @Input() extensionList: any = [];
  @Input() extension = '';
  @Input() allowDrag = false;
  @Input() currentOption = '';
  @Input() optionList: optionType[] = [];
  @Output() extensionChange = new EventEmitter<string>();
  @Output() currentOptionChange = new EventEmitter<string>();
  @Output() uploadChange = new EventEmitter<any>();
  filename = '';

  constructor(private message: EoMessageService) {}

  selectExtension({ key, properties }) {
    this.extensionChange.emit(key);
    if (!properties) {
      return;
    }
    // * update optionList
    this.currentOptionChange.emit(this.currentOption);
  }

  selectOption(data) {
    this.currentOptionChange.emit(this.currentOption);
  }

  parserFile = (file) =>
    new Observable((observer: Observer<boolean>) => {
      if (file.type !== 'application/json') {
        this.message.error($localize `Only files in JSON format are supported`);
        observer.complete();
        return;
      }
      parserJsonFile(file).then((result: { name: string }) => {
        this.filename = result.name;
        this.uploadChange.emit(result);
        observer.complete();
      });
    });
}
