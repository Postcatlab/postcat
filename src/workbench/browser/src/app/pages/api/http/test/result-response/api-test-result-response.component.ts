import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { getBlobUrl } from 'eo/workbench/browser/src/app/utils/index.utils';
import { ApiTestHistoryResponse } from '../../../../../shared/services/storage/index.model';
import { ApiTestUtilService } from '../api-test-util.service';
import { EoMonacoEditorComponent } from 'eo/workbench/browser/src/app/shared/components/monaco-editor/monaco-editor.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'eo-api-test-result-response',
  templateUrl: './api-test-result-response.component.html',
  styleUrls: ['./api-test-result-response.component.scss'],
})
export class ApiTestResultResponseComponent implements OnInit, OnChanges {
  @Input() model: any | ApiTestHistoryResponse;
  @Input() uri: string;
  @ViewChild(EoMonacoEditorComponent, { static: false }) eoEditor?: EoMonacoEditorComponent;
  codeStatus: { status: string; cap: number; class: string };
  size: string;
  blobUrl = '';
  get responseIsImg() {
    return this.model.contentType?.startsWith('image');
  }
  imgBlobUrl: SafeUrl;
  constructor(
    private apiTest: ApiTestUtilService,
    private sanitizer: DomSanitizer,
    private nzContextMenuService: NzContextMenuService
  ) {}

  ngOnChanges(changes) {
    console.log('this.model', this.model);
    if (changes.model && this.model) {
      this.codeStatus = this.apiTest.getHTTPStatus(this.model?.statusCode);
      if (!this.responseIsImg) {
        this.eoEditor?.formatCode();
      } else if (this.responseIsImg) {
        this.imgBlobUrl = this.uri;
      }
    }
  }
  ngOnInit(): void {}

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  downloadResponseText() {
    this.blobUrl = this.responseIsImg ? this.uri : getBlobUrl(window.btoa(this.model.body), this.model.contentType);
    console.log('blobUrl', ((window as any).blobUrl = this.blobUrl));
    (window as any).modelVody = this.model.body;
    const blobFileName = decodeURI(this.model.blobFileName || 'test_response');
    const tmpAElem = document.createElement('a');
    if ('download' in tmpAElem) {
      tmpAElem.style.visibility = 'hidden';
      tmpAElem.href = this.blobUrl;
      tmpAElem.download = blobFileName;
      document.body.appendChild(tmpAElem);
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      tmpAElem.dispatchEvent(evt);
      document.body.removeChild(tmpAElem);
    } else {
      location.href = this.blobUrl;
    }
  }
  newTabResponseText() {}
}
