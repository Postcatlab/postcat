import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { WebService } from 'pc/browser/src/app/core/services';
import { ProjectApiService } from 'pc/browser/src/app/pages/workspace/project/api/api.service';
import { ApiMockTableComponent } from 'pc/browser/src/app/pages/workspace/project/api/components/api-mock-table.component';
import { ApiMockService } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ApiMockEditComponent } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/edit/api-mock-edit.component';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { PROTOCOL } from 'pc/browser/src/app/shared/models/protocol.constant';
import { StoreService } from 'pc/browser/src/app/store/state.service';

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
export class ApiMockComponent implements OnInit, TabViewComponent {
  @Output() readonly eoOnInit = new EventEmitter<ApiData>();
  @Input() canEdit = true;

  @ViewChild('urlCell', { read: TemplateRef, static: true })
  urlCell: TemplateRef<any>;

  @ViewChild('mockTable')
  mockTable: ApiMockTableComponent;

  apiUuid: number;
  apiData: ApiData;
  titleTips = $localize`Postcat Client is required to use local mock.`;
  btnTitle = $localize`Use Client`;
  isInstalledClient: boolean = true;
  constructor(
    private route: ActivatedRoute,
    public web: WebService,
    private apiMock: ApiMockService,
    private modal: ModalService,
    private api: ProjectApiService,
    private store: StoreService,
    private trace: TraceService
  ) {
    this.apiUuid = this.route.snapshot.queryParams.uuid;
  }

  async ngOnInit() {
    this.apiData = await this.api.get(this.apiUuid);
    this.eoOnInit.emit(this.apiData);
  }
  async jumpToClient() {
    const isInstalled = await this.web.protocolCheck();
    if (!isInstalled) {
      this.isInstalledClient = false;
    } else {
      this.isInstalledClient = true;
      window.location.href = PROTOCOL;
    }
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
        const workspace_type = this.store.isLocal ? 'local' : 'cloud';
        this.trace.report('add_mock_success', { workspace_type });
        modal.destroy();
      }
    });
  }
}
