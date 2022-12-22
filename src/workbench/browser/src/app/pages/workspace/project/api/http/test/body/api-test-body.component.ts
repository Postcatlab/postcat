import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiBodyType, ApiTableConf } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { EoMonacoEditorComponent } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco-editor.component';
import { transferFileToDataUrl, whatTextType } from 'eo/workbench/browser/src/app/utils/index.utils';
import { EditorOptions } from 'ng-zorro-antd/code-editor';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subject } from 'rxjs';
import { pairwise, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ApiTestBody, ApiTestBodyType, ContentType, CONTENT_TYPE_BY_ABRIDGE } from '../api-test.model';

const whatTextTypeMap = {
  xml: 'application/xml',
  json: 'application/json',
  html: 'text/html',
  text: 'text/plain'
} as const;
@Component({
  selector: 'eo-api-test-body',
  templateUrl: './api-test-body.component.html',
  styleUrls: ['./api-test-body.component.scss']
})
export class ApiTestBodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() model: string | object[] | any;
  @Input() supportType: string[];
  @Input() autoSetContentType = true;
  @Input() contentType: ContentType;
  @Input() bodyType: ApiTestBodyType | string;
  @Output() readonly bodyTypeChange: EventEmitter<ApiBodyType | string> = new EventEmitter();
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly contentTypeChange: EventEmitter<ContentType> = new EventEmitter();
  @Output() readonly autoSetContentTypeChange: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(EoMonacoEditorComponent, { static: false }) eoMonacoEditor?: EoMonacoEditorComponent;
  @ViewChild('formValue', { static: true }) formValue?: TemplateRef<HTMLDivElement>;

  isReload = true;
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  binaryFiles: NzUploadFile[] = [];
  CONST = {
    CONTENT_TYPE: CONTENT_TYPE_BY_ABRIDGE,
    API_BODY_TYPE: []
  };
  cache: any = {};
  editorConfig: EditorOptions = {
    language: 'json'
  };
  itemStructure: ApiTestBody = {
    required: true,
    name: '',
    type: 'string',
    value: ''
  };
  private bodyType$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();
  get editorType() {
    return this.contentType.replace(/.*\//, '');
  }
  constructor(private apiTable: ApiTableService, private message: EoNgFeedbackMessageService) {
    this.bodyType$.pipe(pairwise(), takeUntil(this.destroy$)).subscribe(val => {
      this.beforeChangeBodyByType(val[0]);
    });
    this.initListConf();
  }

  beforeChangeBodyByType(type) {
    switch (type) {
      case ApiTestBodyType.Binary:
      case ApiTestBodyType.Raw: {
        this.cache[type] = this.model;
        break;
      }
      default: {
        this.cache[type] = [...this.model];
        break;
      }
    }
  }
  changeContentType(contentType) {
    this.contentTypeChange.emit(contentType);
    this.autoSetContentTypeChange.emit(false);
  }
  changeBodyType(type?) {
    this.bodyType$.next(this.bodyType);
    this.bodyTypeChange.emit(this.bodyType);
    this.initListConf();
    this.setModel();
    if (type === 'init') {
      return;
    }
    this.modelChange.emit(this.model);
  }

  ngOnInit(): void {
    this.CONST.API_BODY_TYPE = Object.keys(ApiTestBodyType)
      .filter(val => this.supportType.includes(ApiTestBodyType[val]))
      .map(val => ({ key: val, value: ApiTestBodyType[val] }));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnChanges(changes) {
    if (changes.model && ((!changes.model.previousValue && changes.model.currentValue) || changes.model.currentValue?.length === 0)) {
      this.beforeChangeBodyByType(this.bodyType);
      this.changeBodyType('init');
    }
  }
  uploadBinary = file =>
    new Observable((observer: Observer<boolean>) => {
      this.model = {};
      this.binaryFiles = [];
      if (file.size >= 5 * 1024 * 1024) {
        this.message.error($localize`The file is too large and needs to be less than 5 MB`);
        observer.complete();
        return;
      }
      transferFileToDataUrl(file).then((result: { name: string; content: string }) => {
        this.model = {
          name: file.name,
          dataUrl: result.content
        };
        this.binaryFiles = [
          {
            uid: '1',
            name: file.name,
            status: 'done'
          }
        ];
        this.emitModelChange();
      });
      observer.complete();
    });
  emitModelChange() {
    this.modelChange.emit(this.model);
  }
  handleParamsImport(data) {
    this.model = data;
    this.modelChange.emit(data);
  }

  rawDataChange(code: string) {
    this.modelChange.emit(code);
    const contentType = whatTextTypeMap[whatTextType(code)];
    if (contentType && this.autoSetContentType !== false) {
      this.contentType = contentType;
      this.contentTypeChange.emit(contentType);
    }
  }
  /**
   * Set model after change bodyType
   *
   * Add last row| RestoreData From cache
   */
  private setModel() {
    switch (this.bodyType) {
      case ApiTestBodyType.Binary:
      case ApiTestBodyType.Raw: {
        this.model = this.cache[this.bodyType] || '';
        break;
      }
      default: {
        this.model = this.cache[this.bodyType] || [];
        break;
      }
    }
    if (typeof this.model === 'object') {
      this.model.forEach(row => {
        if (row.type === 'file') {
          row.files = [];
        }
      });
    }
  }
  formdataSelectFiles(target, item) {
    const files = Array.from(target.files);
    const execeedSize = files.some((file: File) => {
      if (file.size >= 2 * 1024 * 1024) {
        this.message.error($localize`The file is too large and needs to be less than 2 MB`);
        return true;
      }
    });
    if (execeedSize) return;
    item.files = [];
    files.forEach(file => {
      transferFileToDataUrl(file).then((result: { name: string; content: string }) => {
        item.files.push({
          name: result.name,
          content: result.content
        });
      });
    });
    this.emitModelChange();
  }
  private initListConf() {
    const config = this.apiTable.initTestTable({
      in: 'body'
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
    this.listConf.columns.forEach(col => {
      switch (col.key) {
        case 'value': {
          col.slot = this.formValue;
          break;
        }
        case 'type': {
          col.change = item => {
            if (item.type === 'file') {
              item.files = [];
              item.value = '';
            } else {
              delete item.files;
            }
          };
          break;
        }
      }
    });
  }
}
