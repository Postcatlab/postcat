import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { EoMonacoEditorComponent } from 'pc/browser/src/app/components/eo-ui/monaco-editor/monaco-editor.component';
import { b64DecodeUnicode, decodeUnicode, getBlobUrl } from 'pc/browser/src/app/shared/utils/index.utils';

import { ApiTestUtilService } from '../../../service/api-test-util.service';
import { ApiTestResData } from '../../../service/test-server/test-server.model';

@Component({
  selector: 'eo-api-test-result-response',
  templateUrl: './api-test-result-response.component.html',
  styleUrls: ['./api-test-result-response.component.scss']
})
export class ApiTestResultResponseComponent implements OnChanges {
  @Input() model: ApiTestResData;
  @Input() uri: string;
  @ViewChild(EoMonacoEditorComponent, { static: false }) eoEditor?: EoMonacoEditorComponent;
  codeStatus: { status: string; cap: number; class: string };
  size: string;
  blobUrl = '';
  responseBody = '';
  get responseIsImg() {
    return this.model.contentType?.startsWith('image');
  }
  imgBlobUrl: SafeUrl;
  constructor(private apiTest: ApiTestUtilService, private nzContextMenuService: NzContextMenuService) {}

  ngOnChanges(changes) {
    if (changes.model && this.model) {
      this.codeStatus = this.apiTest.getHTTPStatus(this.model?.statusCode);
      this.responseBody = this.decodeBody(changes.model.currentValue.body || '');
      if (!this.responseIsImg) {
        this.eoEditor?.formatCode();
      } else if (this.responseIsImg) {
        this.imgBlobUrl = this.uri;
      }
    }
  }

  decodeBody(body: string) {
    if (['longText', 'stream'].includes(this.model.responseType)) {
      return decodeUnicode(b64DecodeUnicode(body));
    } else {
      return decodeUnicode(body);
    }
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  downloadResponseText() {
    let code = this.model.body;
    try {
      if (['longText', 'stream'].includes(this.model.responseType)) {
        code = b64DecodeUnicode(code);
      } else {
        code = JSON.stringify(typeof code === 'string' ? JSON.parse(code) : code, null, 4);
      }
    } catch {
      code = String(code);
    }
    this.blobUrl = this.responseIsImg ? this.uri : getBlobUrl(code, this.model.contentType);
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
