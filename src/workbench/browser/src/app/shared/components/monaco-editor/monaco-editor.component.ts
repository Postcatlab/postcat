import { Component, Input, Output, EventEmitter, OnChanges, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { whatTextType } from '../../../utils';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { editor } from 'monaco-editor';

type EventType = 'format' | 'copy' | 'search' | 'replace' | 'type' | 'download' | 'newTab';

const eventHash = new Map()
  .set('format', {
    label: $localize`Format`,
    icon: 'magic',
  })
  .set('copy', {
    label: $localize`:@@Copy:Copy`,
    icon: 'copy',
  })
  .set('search', {
    label: $localize`:@@Search:Search`,
    icon: 'search',
  })
  .set('replace', {
    label: $localize`Replace`,
    icon: 'file-text-one',
  });

@Component({
  selector: 'eo-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss'],
})
export class EoMonacoEditorComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() eventList: EventType[] = [];
  @Input() hiddenList: string[] = [];
  @Input() code: string;
  @Input() minHeight = '70';
  @Input() editorType = 'json';
  @Input() autoFormat = false;
  @Input() disabled = false;
  @Input() completions = [];
  @Output() codeChange = new EventEmitter<string>();
  codeEdtor: editor.IStandaloneCodeEditor;
  isReadOnly = false;
  buttonList: any[] = [];
  typeList = [
    {
      value: 'json',
      label: 'JSON',
    },
    {
      value: 'xml',
      label: 'XML',
    },
    {
      value: 'html',
      label: 'HTML',
    },
    {
      value: 'text',
      label: 'Text',
    },
  ];

  isNaN(val) {
    return Number.isNaN(Number(val));
  }

  constructor(private message: EoMessageService, private electron: ElectronService) {}

  ngAfterViewInit(): void {
    console.log('codeEdtor', this.codeEdtor);
  }
  ngOnChanges() {
    // * update root type
    if (this.eventList.includes('type') && !this.hiddenList.includes('type')) {
      const type = whatTextType(this.code || '');
      this.editorType = type;
      if (this.autoFormat) {
        this.code = this.formatCode(this.code, type);
      }
    }
  }
  ngOnInit() {
    // console.log(this.eventList);
    // To get the Ace instance:
    this.buttonList = this.electron.isElectron
      ? this.eventList
          .filter((it) => !['newTab', 'type'].includes(it))
          .map((it) => ({
            event: it,
            ...eventHash.get(it),
          }))
      : this.eventList
          .filter((it) => it !== 'type')
          .map((it) => ({
            event: it,
            ...eventHash.get(it),
          }));
  }
  log(event, txt) {
    console.log('ace event', event, txt);
  }
  handleBlur() {
    setTimeout(() => {
      this.codeChange.emit(this.code);
    }, 0);
  }
  handleChange() {
    setTimeout(() => {
      this.codeChange.emit(this.code);
    }, 0);
  }
  rerenderAce() {}
  formatCode(code, type) {
    return code;
  }
  handleAction(event) {
    const ace = {} as any;
    const session = ace.getSession();
    switch (event) {
      case 'format': {
        // * format code
        const value = session.getValue();
        const code = this.formatCode(value, this.editorType);
        session.setValue(code);
        break;
      }
      case 'copy': {
        // * copy content
        const value = session.getValue();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(value);
          this.message.success($localize`Copied`);
          return;
        }
        break;
      }
      case 'search': {
        // * search content
        ace.execCommand('find');
        break;
      }
      case 'replace': {
        ace.execCommand('replace');
        break;
      }
      case 'newTab':
        {
          const tmpNewWin = window.open();
          const value = session.getValue();
          const code = this.formatCode(value, this.editorType);
          tmpNewWin.document.open();
          tmpNewWin.document.write(code);
          tmpNewWin.document.close();
        }
        break;
      case 'download':
        {
          const value = session.getValue();
          const code = this.formatCode(value, this.editorType);
          const a = document.createElement('a');
          const blob = new Blob([code]);
          const url = window.URL.createObjectURL(blob);
          const filename = `download.${this.editorType}`;
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
        break;
    }
  }

  handleInsert(code) {}

  onEditorInitialized(codeEdtor) {
    this.codeEdtor = codeEdtor;
  }
}
