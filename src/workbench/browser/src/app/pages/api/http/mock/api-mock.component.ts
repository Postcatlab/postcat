import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ApiData } from '../../../../shared/services/storage/index.model';
import { ActivatedRoute } from '@angular/router';
import { ApiMockService } from 'eo/workbench/browser/src/app/pages/api/http/mock/api-mock.service';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { ApiMockEditComponent } from 'eo/workbench/browser/src/app/pages/api/http/mock/edit/api-mock-edit.component';
import { ApiService } from 'eo/workbench/browser/src/app/pages/api/api.service';
import { ApiMockTableComponent } from 'eo/workbench/browser/src/app/modules/api-shared/api-mock-table.component';

@Component({
  selector: 'eo-api-mock',
  templateUrl: './api-mock.component.html',
  styles: [
    `
      :host {
        padding: var(--PADDING);
      }
    `,
  ],
})
export class ApiMockComponent implements OnInit {
  @Output() eoOnInit = new EventEmitter<ApiData>();
  @Input() canEdit = true;

  @ViewChild('urlCell', { read: TemplateRef, static: true })
  urlCell: TemplateRef<any>;

  @ViewChild('mockTable')
  mockTable: ApiMockTableComponent;

  apiDataID = Number(this.route.snapshot.queryParams.uuid);
  apiData: ApiData;

  constructor(
    private route: ActivatedRoute,
    private apiMock: ApiMockService,
    private modal: ModalService,
    private api: ApiService
  ) {}

  async ngOnInit() {
    this.apiData = await this.api.get(this.apiDataID);
    this.eoOnInit.emit(this.apiData);
  }
  addMock() {
    const modal = this.modal.create({
      nzTitle: $localize`New Mock`,
      nzWidth: '70%',
      nzContent: ApiMockEditComponent,
      nzComponentParams: {
        model: {
          name: '',
          response: this.apiMock.getMockResponseByAPI(this.apiData),
        },
      },
      nzOnOk: async () => {
        await this.mockTable.addOrEditModal(modal.componentInstance.model);
        modal.destroy();
      },
    });
  }
}
