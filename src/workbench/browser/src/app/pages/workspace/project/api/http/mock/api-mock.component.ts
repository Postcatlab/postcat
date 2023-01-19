import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { ApiMockTableComponent } from 'eo/workbench/browser/src/app/modules/api-shared/api-mock-table.component';
import { ProjectApiService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api.service';
import { ApiMockService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ApiMockEditComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/mock/edit/api-mock-edit.component';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';

@Component({
  selector: 'eo-api-mock',
  templateUrl: './api-mock.component.html',
  styles: [
    `
      :host {
        padding: var(--padding);
      }
    `
  ]
})
export class ApiMockComponent implements OnInit {
  @Output() readonly eoOnInit = new EventEmitter<ApiData>();
  @Input() canEdit = true;

  @ViewChild('urlCell', { read: TemplateRef, static: true })
  urlCell: TemplateRef<any>;

  @ViewChild('mockTable')
  mockTable: ApiMockTableComponent;

  apiUuid: number;
  apiData: ApiData;
  titleTips = $localize`Postcat Client is required to use local mock.`;

  constructor(
    private route: ActivatedRoute,
    public web: WebService,
    private apiMock: ApiMockService,
    private modal: ModalService,
    private api: ProjectApiService
  ) {
    this.apiUuid = this.route.snapshot.queryParams.uuid;
  }

  async ngOnInit() {
    this.apiData = await this.api.get(this.apiUuid);
    this.eoOnInit.emit(this.apiData);
  }
  jumpToClient() {
    this.web.jumpToClient(this.titleTips);
  }
  addMock() {
    const modal = this.modal.create({
      nzTitle: $localize`New Mock`,
      nzWidth: '70%',
      nzContent: ApiMockEditComponent,
      nzComponentParams: {
        model: {
          name: '',
          response: this.apiMock.getMockResponseByAPI(this.apiData)
        }
      },
      nzOnOk: async () => {
        await this.mockTable.addOrEditModal(modal.componentInstance.model);
        modal.destroy();
      }
    });
  }
}
