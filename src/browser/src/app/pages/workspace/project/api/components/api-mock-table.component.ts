import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiMockService } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { Mock, MockCreateWay } from 'pc/browser/src/app/services/storage/db/models';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { eoDeepCopy, copy } from 'pc/browser/src/app/shared/utils/index.utils';

@Component({
  selector: 'eo-api-mock-table',
  template: ` <eo-ng-table-pro [columns]="mockListColumns" [nzData]="mockList"></eo-ng-table-pro>
    <ng-template #urlCell let-item="item" let-index="index">
      <p
        class="flex-1"
        [nzContent]="item.url"
        nz-typography
        nzCopyable
        nzEllipsis
        [nzCopyText]="item.url"
        [nzCopyIcons]="[copedIcon, copedIcon]"
      >
      </p>
      <ng-template #copedIcon>
        <button eo-ng-button nzType="text"><eo-iconpark-icon name="copy"></eo-iconpark-icon></button>
      </ng-template>
    </ng-template>`
})
export class ApiMockTableComponent implements OnInit, OnChanges {
  @Input() canEdit = true;
  @Input() apiData: ApiData;

  @ViewChild('urlCell', { read: TemplateRef, static: true })
  urlCell: TemplateRef<any>;

  mockListColumns = [];
  mockPrefix: string;
  mockList: Array<{ url: string } & Mock> = [];

  constructor(private message: EoNgFeedbackMessageService, private modal: ModalService, private apiMock: ApiMockService) {}

  ngOnInit() {
    this.initTable();
  }

  private initTable() {
    this.mockListColumns = [
      { title: $localize`Name`, key: 'name', width: 200 },
      {
        title: $localize`Created Type`,
        key: 'createWay',
        width: 150,
        enums: [
          { title: $localize`System creation`, value: MockCreateWay.System },
          { title: $localize`Manual creation`, value: MockCreateWay.Custom }
        ]
      },
      { title: 'URL', slot: this.urlCell },
      {
        type: 'btnList',
        btns: [
          {
            action: 'edit',
            showFn: item => item.data.createWay !== 'system',
            click: (item, index) => {
              this.apiMock.toEdit(item.data);
            }
          },
          {
            action: 'delete',
            showFn: item => item.data.createWay !== 'system',
            confirm: true,
            confirmFn: (item, index) => {
              this.apiMock.toDelete(item.data.id);
            }
          }
        ]
      }
    ];
  }
  async ngOnChanges(changes) {
    if (changes?.apiData?.currentValue?.apiUuid) {
      this.mockList = await this.apiMock.getMocks(this.apiData.apiUuid);
      this.mockList.forEach(item => {
        if (item.createWay === 'system') {
          item.response = this.apiMock.getMockResponseByAPI(this.apiData);
        }
      });
      console.log(this.apiData);
      this.mockPrefix = this.apiMock.getMockPrefix(this.apiData);
      console.log(this.mockPrefix);
      this.setMocksUrl();
    }
  }
  private setMocksUrl() {
    this.mockList.forEach(mock => {
      mock.url = this.getMockUrl(mock);
    });
  }

  async addOrEditModal(item, index?) {
    if (item.id) {
      await this.apiMock.updateMock(item);
      this.message.success($localize`Edited successfully`);
      this.mockList[index] = item;
    } else {
      item.apiUuid = this.apiData.apiUuid;
      item.createWay = 'custom';
      const [data, err] = await this.apiMock.createMock(item);
      if (err) {
        this.message.error($localize`Failed to add`);
        return;
      }
      Object.assign(item, data);
      this.message.success($localize`Added successfully`);
      this.mockList.push(item);
    }
    item.url = this.getMockUrl(item);
    //Use onPush to update data
    this.mockList = [...this.mockList];
  }

  private getMockUrl(mock) {
    //Generate Mock URL
    //TODO Mock URL = API Path
    const url = new URL(
      this.mockPrefix
        .replace(/:\/{2,}/g, ':::')
        .replace(/\/{2,}/g, '/')
        .replace(/:{3}/g, '://'),
      'https://github.com/'
    );
    if (mock?.createWay === 'custom' && mock.id) {
      url.searchParams.set('mockID', `${mock.id}`);
    }
    return decodeURIComponent(url.toString());
  }
}
