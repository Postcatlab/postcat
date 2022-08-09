import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { getBlobUrl } from 'eo/workbench/browser/src/app/utils';
import { ApiTestHistoryResponse } from '../../../../shared/services/storage/index.model';
import { ApiTestUtilService } from '../api-test-util.service';
import { EoMonacoEditorComponent } from 'eo/workbench/browser/src/app/shared/components/monaco-editor/monaco-editor.component';

@Component({
  selector: 'eo-api-test-result-response',
  templateUrl: './api-test-result-response.component.html',
  styleUrls: ['./api-test-result-response.component.scss'],
})
export class ApiTestResultResponseComponent implements OnInit, OnChanges {
  @Input() model: any | ApiTestHistoryResponse;
  @ViewChild(EoMonacoEditorComponent, { static: false }) eoEditor?: EoMonacoEditorComponent;
  codeStatus: { status: string; cap: number; class: string };
  size: string;
  blobUrl = '';
  responseIsImg = false;
  constructor(private apiTest: ApiTestUtilService) {}
  ngOnChanges(changes) {
    if (changes.model && this.model) {
      this.codeStatus = this.apiTest.getHTTPStatus(this.model.statusCode);
      this.eoEditor?.formatCode();
    }
  }
  ngOnInit(): void {}
  downloadResponseText() {
    this.blobUrl = getBlobUrl(this.model.body, this.model.contentType);
    const blobFileName = decodeURI(this.model.blobFileName);
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
