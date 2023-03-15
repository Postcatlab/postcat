import { Component, Input, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import type { editor, IDisposable } from 'monaco-editor';
import type { JoinedEditorOptions } from 'ng-zorro-antd/code-editor';
import { ElectronService } from 'pc/browser/src/app/core/services/electron/electron.service';

import { ThemeService } from '../../../core/services/theme/theme.service';
import { debounce, whatTextType } from '../../../shared/utils/index.utils';
import { getDefaultCompletions } from './defaultCompletions';

type EventType = 'format' | 'copy' | 'search' | 'replace' | 'type' | 'download' | 'newTab';
const eventHash = new Map()
  .set('format', {
    label: $localize`Format`,
    icon: 'code'
  })
  .set('copy', {
    label: $localize`:@@Copy:Copy`,
    icon: 'copy'
  })
  .set('search', {
    label: $localize`:@@Search:Search`,
    icon: 'search'
  })
  .set('replace', {
    label: $localize`Replace`,
    icon: 'file-text'
  });

@Component({
  selector: 'eo-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss']
})
export class EoMonacoEditorComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @Input() eventList: EventType[] = [];
  @Input() hiddenList: string[] = [];
  @Input() set code(val) {
    this.setCode(val);
  }
  /** Scroll bars appear over 20 lines */
  @Input() maxHeight: number;
  @Input() minHeight = 100;
  @Input() autoHeight = false;
  @Input() config: JoinedEditorOptions = {};
  @Input() editorType = 'json';
  /** Automatically identify the type */
  @Input() autoType = false;
  @Input() autoFormat = false;
  @Input() completions = [];
  @Output() readonly codeChange = new EventEmitter<string>();
  $$code = '';
  isFirstFormat = true;
  codeEdtor: editor.IStandaloneCodeEditor;
  completionItemProvider: IDisposable;
  buttonList: any[] = [];
  typeList = [
    {
      value: 'json',
      label: 'JSON'
    },
    {
      value: 'xml',
      label: 'XML'
    },
    {
      value: 'html',
      label: 'HTML'
    },
    {
      value: 'text',
      label: 'Text'
    }
  ];
  tempConfig: JoinedEditorOptions = {};
  defaultConfig: JoinedEditorOptions = {
    language: this.editorType || 'json',
    // automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    wrappingStrategy: 'advanced',
    minimap: {
      enabled: false
    },
    formatOnPaste: true,
    formatOnType: true,
    scrollbar: {
      scrollByPage: true,
      alwaysConsumeMouseWheel: false
    },
    overviewRulerLanes: 0,
    quickSuggestions: { other: true, strings: true }
  };
  contentHeight = 100;
  get height() {
    if (this.autoHeight) {
      return undefined;
    }
    if (this.maxHeight && this.contentHeight > this.maxHeight) {
      return this.maxHeight;
    }
    return Math.max(this.minHeight, this.contentHeight);
  }
  private resizeObserver: ResizeObserver;
  private readonly el: HTMLElement; /** monaco config */
  get editorOption(): JoinedEditorOptions {
    return { ...this.defaultConfig, ...this.config, ...this.tempConfig };
  }

  isNaN(val) {
    return Number.isNaN(Number(val));
  }

  constructor(
    private message: EoNgFeedbackMessageService,
    private electron: ElectronService,
    private theme: ThemeService,
    elementRef: ElementRef
  ) {
    this.el = elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    // console.log('codeEdtor', this.codeEdtor);
    requestAnimationFrame(() => this.rerenderEditor());
    if (this.editorOption.automaticLayout === undefined) {
      this.resizeObserver = new ResizeObserver(
        debounce(() => {
          if (this.el.offsetParent) {
            this.el.style.setProperty('overflow', 'hidden');
            requestAnimationFrame(() => {
              this?.rerenderEditor();
              this.el.style.removeProperty('overflow');
            });
          }
        }, 20)
      );
      this.resizeObserver.observe(this.el);
    }
  }
  async ngOnChanges() {
    // * update root type
    if (this.eventList.includes('type') && !this.hiddenList.includes('type')) {
      requestAnimationFrame(() => {
        if (!this.codeEdtor) {
          this.ngOnChanges();
          return;
        }

        if (this.autoType) {
          const type = whatTextType(this.$$code || '');
          this.editorType = type;
          monaco?.editor.setModelLanguage(this.codeEdtor.getModel(), type);
        } else {
          monaco?.editor.setModelLanguage(this.codeEdtor.getModel(), this.editorType);
        }
      });
    }
  }
  ngOnInit() {
    // To get the Ace instance:
    this.buttonList = this.electron.isElectron
      ? this.eventList
          .filter(it => !['newTab', 'type'].includes(it))
          .map(it => ({
            event: it,
            ...eventHash.get(it)
          }))
      : this.eventList
          .filter(it => it !== 'type')
          .map(it => ({
            event: it,
            ...eventHash.get(it)
          }));
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.codeEdtor?.dispose();
    this.completionItemProvider?.dispose();
  }

  modelChangeFn(code) {
    // console.log('modelChangeFn', code);
    this.codeChange.emit(code);
  }

  private setCode(val: string) {
    if (val === this.$$code) {
      return;
    }

    let code = val;
    try {
      if (typeof val === 'object') {
        code = JSON.stringify(val);
      } else {
        // code = JSON.stringify(typeof val === 'string' ? JSON.parse(val) : val);
      }
    } catch {
      code = String(val);
    }

    if (code && this.autoFormat) {
      requestIdleCallback(async () => {
        this.$$code = await this.formatCode();
      });
    }
    this.$$code = code;
  }

  private initMonacoEditorEvent() {
    if (this.completions?.length) {
      this.completionItemProvider = monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          return {
            suggestions: [...this.completions, ...getDefaultCompletions()].map(n => ({ ...n, range }))
          } as any;
        }
      });
    }

    this.codeEdtor.onDidChangeModelContent(e => {
      // console.log('e', e);
      this.handleChange();
    });

    this.codeEdtor.onDidContentSizeChange(e => {
      this.contentHeight = e.contentHeight;
    });

    this.codeEdtor.onDidBlurEditorText(e => {
      this.handleBlur();
    });
  }
  log(event, txt) {
    console.log('ace event', event, txt);
  }
  handleBlur() {
    queueMicrotask(() => {
      this.codeChange.emit(this.$$code);
    });
  }
  handleChange() {
    queueMicrotask(() => {
      this.codeChange.emit(this.$$code);
    });
  }
  rerenderEditor = () => {
    this.codeEdtor?.layout?.();
  };
  updateReadOnlyCode(callback, originReadOnly = this.config.readOnly) {
    // this.codeEdtor.updateOptions({ readOnly: false });
    this.tempConfig.readOnly = false;
    requestAnimationFrame(async () => {
      const isReadOnly = this.codeEdtor.getOption(monaco.editor.EditorOption.readOnly);
      if (isReadOnly === false) {
        await callback();
        requestAnimationFrame(() => {
          this.tempConfig.readOnly = originReadOnly;
        });
      } else {
        this.updateReadOnlyCode(callback, originReadOnly);
      }
    });
  }
  formatCode() {
    return new Promise<string>(resolve => {
      requestAnimationFrame(async () => {
        if (this.codeEdtor) {
          this.updateReadOnlyCode(async () => {
            await this.codeEdtor.getAction('editor.action.formatDocument')?.run();
            resolve(this.codeEdtor.getValue() || '');
          }, this.config.readOnly);
        } else {
          resolve(await this.formatCode());
        }
      });
    });
  }
  async handleAction(event: EventType) {
    switch (event) {
      case 'format': {
        // * format code
        // const value = session.getValue();
        // const code = this.formatCode();
        // session.setValue(code);
        await this.formatCode(); //自动格式化代码
        break;
      }
      case 'copy': {
        // * copy content
        const value = this.codeEdtor.getValue();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(value);
          this.message.success($localize`Copied`);
          return;
        }
        break;
      }
      case 'search': {
        // * search content
        this.codeEdtor.getAction('actions.find')?.run();
        break;
      }
      case 'replace': {
        this.codeEdtor.getAction('editor.action.startFindReplaceAction')?.run();
        break;
      }
      case 'newTab':
        {
          const tmpNewWin = window.open();
          const value = this.codeEdtor.getValue();
          const code = await this.formatCode();
          tmpNewWin.document.open();
          tmpNewWin.document.write(code);
          tmpNewWin.document.close();
        }
        break;
      case 'download':
        {
          const value = this.codeEdtor.getValue();
          const code = await this.formatCode();
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

  handleInsert(code) {
    const p = this.codeEdtor.getPosition();
    this.codeEdtor.executeEdits('', [
      {
        range: new monaco.Range(p.lineNumber, p.column, p.lineNumber, p.column),
        text: code
      }
    ]);
    this.codeEdtor.focus();
    // this.codeEdtor.trigger('keyboard', 'type', { text: code });
  }

  onEditorInitialized(codeEdtor) {
    this.codeEdtor = codeEdtor;
    this.initMonacoEditorEvent();
    //Manual change theme,don't use options.theme,it will not be replace by setTheme function
    this.theme.changeEditorTheme();
  }
}
