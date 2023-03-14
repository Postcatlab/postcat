import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { EditorOptions } from 'ng-zorro-antd/code-editor';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { EoMonacoEditorComponent } from 'pc/browser/src/app/components/eo-ui/monaco-editor/monaco-editor.component';
import {
  ApiBodyType,
  ApiParamsType,
  ApiTableConf,
  API_BODY_TYPE,
  IMPORT_MUI
} from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ApiTableService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-table.service';
import { BodyParam } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { transferFileToDataUrl, whatTextType, whatType } from 'pc/browser/src/app/shared/utils/index.utils';
import { Observable, Observer, pairwise, Subject, takeUntil } from 'rxjs';

import { ContentType, CONTENT_TYPE_BY_ABRIDGE } from '../api-test.model';

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
  @Input() model: string | BodyParam[] | any;
  @Input() supportType: ApiBodyType[] = [ApiBodyType.FormData, ApiBodyType.JSON, ApiBodyType.XML, ApiBodyType.Raw, ApiBodyType.Binary];
  @Input() autoSetContentType = true;
  @Input() contentType: ContentType;
  @Input() bodyType: ApiBodyType | number;
  @Output() readonly bodyTypeChange: EventEmitter<ApiBodyType | number> = new EventEmitter();
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
  IMPORT_MUI = IMPORT_MUI;
  get TYPE_API_BODY(): typeof ApiBodyType {
    return ApiBodyType;
  }
  get API_PARAMS_TYPE(): typeof ApiParamsType {
    return ApiParamsType;
  }
  cache: any = {};
  editorConfig: EditorOptions = {
    language: 'json'
  };
  itemStructure: BodyParam = {
    isRequired: 1,
    name: '',
    dataType: ApiParamsType.string,
    paramAttr: {
      example: ''
    }
  };
  private bodyType$: Subject<number> = new Subject<number>();
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
    this.CONST.API_BODY_TYPE = API_BODY_TYPE.filter(val => this.supportType.includes(val.value));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private beforeChangeBodyByType(type) {
    switch (type) {
      case ApiBodyType.Binary:
      case ApiBodyType.Raw: {
        this.cache[type] = this.model || [{ binaryRawData: '' }];
        break;
      }
      default: {
        this.cache[type] = [...(Array.isArray(this.model) ? this.model : [])];
        break;
      }
    }
  }
  ngOnChanges(changes) {
    if (changes.model?.firstChange) {
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
        this.model = [
          {
            name: file.name,
            dataUrl: result.content
          }
        ];
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
    this.model[0].binaryRawData = code;
    this.modelChange.emit(this.model);
    const contentType = whatTextTypeMap[whatTextType(code)];
    if (contentType && contentType !== this.contentType && this.autoSetContentType !== false) {
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
      case ApiBodyType.Binary:
      case ApiBodyType.Raw: {
        this.model = this.cache[this.bodyType] || [
          {
            binaryRawData: this.model?.[0]?.binaryRawData || ''
          }
        ];
        break;
      }
      default: {
        this.model = this.cache[this.bodyType] || [];
        this.model.forEach(row => {
          if (row.dataType === ApiParamsType.file) {
            row.files = [];
          }
        });
        break;
      }
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
      in: 'body',
      id: 'api_test_body'
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
    this.listConf.columns.forEach(col => {
      switch (col.key) {
        case 'paramAttr.example': {
          col.slot = this.formValue;
          break;
        }
        case 'dataType': {
          col.change = (item: BodyParam | any) => {
            if (item.dataType === ApiParamsType.file) {
              item.files = [];
              item.paramAttr.example = '';
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
