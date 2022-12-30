import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { Observable, Observer } from 'rxjs';

import { parserJsonFile } from '../../../utils/index.utils';

type optionType = {
  label: string;
  value: string;
};
@Component({
  selector: 'extension-select',
  templateUrl: './extension-select.component.html',
  styleUrls: ['./extension-select.component.scss']
})
export class ExtensionSelectComponent {
  @Input() extensionList: any = [];
  @Input() extension = '';
  @Input() allowDrag = false;
  @Input() currentOption = '';
  @Input() optionList: optionType[] = [];
  @Output() readonly extensionChange = new EventEmitter<string>();
  @Output() readonly currentOptionChange = new EventEmitter<string>();
  @Output() readonly uploadChange = new EventEmitter<any>();
  filename = '';

  constructor(private message: EoNgFeedbackMessageService, private messageService: MessageService) {}

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

  openExtension() {
    this.messageService.send({ type: 'open-extension', data: {} });
  }

  parserFile = file =>
    new Observable((observer: Observer<boolean>) => {
      if (file.type !== 'application/json') {
        this.message.error($localize`Only files in JSON format are supported`);
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
