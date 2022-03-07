import { Component, Input, Output, EventEmitter, OnChanges, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AceConfigInterface, AceComponent, AceDirective } from 'ngx-ace-wrapper';
import { whatTextType } from '../../utils';
import beautifier from 'js-beautify';
import 'brace';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/mode/json';
import 'brace/mode/text';
import 'brace/mode/html';
import 'brace/mode/xml';
import 'brace/ext/searchbox';

type EventType = 'format' | 'copy' | 'search' | 'replace' | 'type' | 'download' | 'newTab';

const eventHash = new Map()
  .set('format', {
    label: '整理格式',
    icon: 'deployment-unit',
  })
  .set('copy', {
    label: '复制',
    icon: 'copy',
  })
  .set('search', {
    label: '搜索',
    icon: 'search',
  })
  .set('download', {
    label: '下载',
    icon: 'download',
  })
  .set('newTab', {
    label: '新开标签',
    icon: 'file-text',
  })
  .set('replace', {
    label: '替换',
    icon: 'security-scan',
  });

@Component({
  selector: 'eo-editor',
  templateUrl: './eo-editor.component.html',
  styleUrls: ['./eo-editor.component.scss'],
})
export class EoEditorComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() eventList: EventType[] = [];
  @Input() hiddenList: string[] = [];
  @Input() code: string;
  @Input() editorType = 'json';
  @Input() autoFormat = false;
  @Output() codeChange = new EventEmitter<string>();
  @ViewChild(AceComponent, { static: false }) aceRef?: AceComponent;
  @ViewChild(AceDirective, { static: false }) directiveRef?: AceDirective;
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

  public config: AceConfigInterface = {
    theme: 'tomorrow_night_eighties',
    readOnly: false,
    tabSize: 4,
  };

  constructor(private message: NzMessageService) {}

  ngAfterViewInit(): void {}
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
    // To get the Ace instance:
    this.buttonList = this.eventList
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
  formatCode(code, type) {
    if (type === 'json') {
      return beautifier.js(code, {
        indent_size: 2,
        space_in_empty_paren: true,
      });
    }
    if (['xml', 'html'].includes(type)) {
      return beautifier.html(code);
    }
    return code;
  }
  handleAction(event) {
    const ace = this.aceRef.directiveRef.ace();
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
          this.message.success('复制成功');
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
      default:
        break;
    }
  }
}
