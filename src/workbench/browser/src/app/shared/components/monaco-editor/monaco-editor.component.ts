import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ElementRef,
} from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { debounce, isBase64, whatTextType } from '../../../utils/index.utils';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import { JoinedEditorOptions } from 'ng-zorro-antd/code-editor';
import { defaultCompletions } from 'eo/workbench/browser/src/app/shared/components/monaco-editor/defaultCompletions';

type EventType = 'format' | 'copy' | 'search' | 'replace' | 'type' | 'download' | 'newTab';

const eventHash = new Map()
  .set('format', {
    label: $localize`Format`,
    icon: 'code',
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
    icon: 'file-text',
  });

@Component({
  selector: 'eo-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss'],
})
export class EoMonacoEditorComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @Input() eventList: EventType[] = [];
  @Input() hiddenList: string[] = [];
  @Input() set isBase64(val) {
    this.$$isBase64 = val;
    if (val) {
      this.setCode(window.atob(this.$$code));
    }
  }
  @Input() set code(val) {
    this.setCode(val);
  }
  /** Scroll bars appear over 20 lines */
  @Input() maxLine: number;
  @Input() config: JoinedEditorOptions = {};
  @Input() editorType = 'json';
  /** Automatically identify the type */
  @Input() autoType = false;
  @Input() autoFormat = false;
  @Input() disabled = false;
  @Input() completions = [];
  @Output() codeChange = new EventEmitter<string>();
  $$code = '';
  $$isBase64 = false;
  isFirstFormat = true;
  codeEdtor: editor.IStandaloneCodeEditor;
  completionItemProvider: monaco.IDisposable;
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
  defaultConfig: JoinedEditorOptions = {
    language: this.editorType || 'json',
    // automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    wrappingStrategy: 'advanced',
    minimap: {
      enabled: false,
    },
    formatOnPaste: true,
    formatOnType: true,
    scrollbar: {
      scrollByPage: true,
      alwaysConsumeMouseWheel: false,
    },
    overviewRulerLanes: 0,
    quickSuggestions: { other: true, strings: true },
  };
  private resizeObserver: ResizeObserver;
  private readonly el: HTMLElement; /** monaco config */
  get editorOption(): JoinedEditorOptions {
    return { ...this.defaultConfig, ...this.config };
  }

  isNaN(val) {
    return Number.isNaN(Number(val));
  }

  constructor(private message: EoNgFeedbackMessageService, private electron: ElectronService, elementRef: ElementRef) {
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
        }, 600)
      );
      this.resizeObserver.observe(this.el);
    }
  }
  async ngOnChanges() {
    // * update root type
    if (this.eventList.includes('type') && !this.hiddenList.includes('type')) {
      requestAnimationFrame(() => {
        if (this.autoType) {
          const type = whatTextType(this.$$code || '');
          this.editorType = type;
          window.monaco?.editor.setModelLanguage(this.codeEdtor.getModel(), type);
        } else {
          window.monaco?.editor.setModelLanguage(this.codeEdtor.getModel(), this.editorType);
        }
      });
    }
  }
  ngOnInit() {
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

    let code = '';
    try {
      if (this.$$isBase64) {
        code = window.atob(val);
      } else {
        code = JSON.stringify(typeof val === 'string' ? JSON.parse(val) : val, null, 4);
      }
    } catch {
      code = String(val);
    }

    if (code && (this.config?.readOnly || (this.isFirstFormat && this.autoFormat))) {
      (async () => {
        this.isFirstFormat = false;
        this.$$code = await this.formatCode();
      })();
    }
    this.$$code = code;
  }

  private initMonacoEditorEvent() {
    if (this.completions?.length) {
      this.completionItemProvider = window.monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: (model, position) => {
          // find out if we are completing a property in the 'dependencies' object.
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return {
            suggestions: [...this.completions, ...defaultCompletions].map((n) => ({ ...n, range })),
          } as any;
        },
      });
    }

    this.codeEdtor.onDidChangeModelDecorations(() => {
      updateEditorHeight(); // typing
      requestAnimationFrame(updateEditorHeight); // folding
    });

    this.codeEdtor.onDidChangeModelContent((e) => {
      this.handleChange();
    });

    this.codeEdtor.onDidBlurEditorText((e) => {
      this.handleBlur();
    });

    let prevHeight = 0;

    const updateEditorHeight = () => {
      if (this.maxLine) {
        const editorElement = this.codeEdtor.getDomNode();

        if (!editorElement) {
          return;
        }

        const lineHeight = this.codeEdtor.getOption(editor.EditorOption.lineHeight);
        const lineCount = this.codeEdtor.getModel()?.getLineCount() || 1;
        const height = this.codeEdtor.getTopForLineNumber(Math.min(lineCount, this.maxLine)) + lineHeight;

        if (prevHeight !== height) {
          prevHeight = height;
          editorElement.style.height = `${height}px`;
          this.codeEdtor.layout();
        }
      }
    };
  }
  log(event, txt) {
    console.log('ace event', event, txt);
  }
  handleBlur() {
    Promise.resolve().then(() => {
      this.codeChange.emit(this.$$code);
    });
  }
  handleChange() {
    Promise.resolve().then(() => {
      this.codeChange.emit(this.$$code);
    });
  }
  rerenderEditor = () => {
    this.codeEdtor?.layout?.();
  };
  formatCode() {
    return new Promise<string>((resolve) => {
      requestAnimationFrame(async () => {
        this.codeEdtor?.updateOptions({ readOnly: false });
        await this.codeEdtor?.getAction('editor.action.formatDocument')?.run();
        this.codeEdtor?.updateOptions({ readOnly: this.config.readOnly });
        resolve(this.codeEdtor?.getValue() || '');
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
        this.formatCode(); //自动格式化代码
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
        text: code,
      },
    ]);
    this.codeEdtor.focus();
    // this.codeEdtor.trigger('keyboard', 'type', { text: code });
  }

  onEditorInitialized(codeEdtor) {
    this.codeEdtor = codeEdtor;
    this.initMonacoEditorEvent();
  }
}
