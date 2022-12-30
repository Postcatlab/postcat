import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiMockService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ApiMockEditComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/mock/edit/api-mock-edit.component';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { copyText, eoDeepCopy, copy } from 'eo/workbench/browser/src/app/utils/index.utils';

import { ApiData, ApiMockEntity } from '../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-mock-table',
  template: ` <eo-ng-table-pro [columns]="mockListColumns" [nzData]="mockList"></eo-ng-table-pro>
    <ng-template #urlCell let-item="item" let-index="index">
      <div class="flex items-center">
        <span class="truncate flex-1">
          {{ item.url }}
        </span>
        <button eo-ng-button nzType="text" (click)="copyText(item.url)"><eo-iconpark-icon name="copy"></eo-iconpark-icon></button>
      </div>
    </ng-template>`
})
export class ApiMockTableComponent implements OnInit, OnChanges {
  @Input() canEdit = true;
  @Input() apiData: ApiData;

  @ViewChild('urlCell', { read: TemplateRef, static: true })
  urlCell: TemplateRef<any>;

  mockListColumns = [];
  mockPrefix: string;
  mockList: ApiMockEntity[] = [];

  constructor(private message: EoNgFeedbackMessageService, private modal: ModalService, private apiMock: ApiMockService) {}

  ngOnInit() {
    this.initTable();
  }
  async handleDeleteMockItem(item, index) {
    await this.apiMock.deleteMock(item.uuid);
    this.mockList.splice(index, 1)[0];
    this.mockList = [...this.mockList];
    this.message.success($localize`Delete Succeeded`);
  }

  private initTable() {
    this.mockListColumns = [
      { title: $localize`Name`, key: 'name', width: 200 },
      {
        title: $localize`Created Type`,
        key: 'createWay',
        width: 150,
        enums: [
          { title: $localize`System creation`, value: 'system' },
          { title: $localize`Manual creation`, value: 'custom' }
        ]
      },
      { title: 'URL', slot: this.urlCell },
      {
        type: 'btnList',
        btns: [
          {
            title: $localize`:@@MockPreview:Preview`,
            icon: 'preview-open',
            click: item => {
              const modal = this.modal.create({
                nzTitle: $localize`Preview Mock`,
                nzWidth: '70%',
                nzContent: ApiMockEditComponent,
                nzComponentParams: {
                  model: item.data,
                  isEdit: false
                }
              });
            }
          },
          {
            action: 'edit',
            showFn: item => item.data.createWay !== 'system',
            click: (item, index) => {
              const modal = this.modal.create({
                nzTitle: $localize`Edit Mock`,
                nzWidth: '70%',
                nzContent: ApiMockEditComponent,
                nzComponentParams: {
                  model: eoDeepCopy(item.data)
                },
                nzOnOk: async () => {
                  await this.addOrEditModal(item.data, index);
                  modal.destroy();
                }
              });
            }
          },
          {
            action: 'delete',
            showFn: item => item.data.createWay !== 'system',
            confirm: true,
            confirmFn: (item, index) => {
              this.handleDeleteMockItem(item.data, index);
            }
          }
        ]
      }
    ];
  }
  async ngOnChanges(changes) {
    if (changes?.apiData?.currentValue?.uuid) {
      this.mockList = await this.apiMock.getMocks(this.apiData.uuid);
      this.mockList.forEach(item => {
        if (item.createWay === 'system') {
          item.response = this.apiMock.getMockResponseByAPI(item.response);
        }
      });
      this.mockPrefix = this.apiMock.getMockPrefix(this.apiData);
      this.setMocksUrl();
    }
  }
  private setMocksUrl() {
    this.mockList.forEach(mock => {
      mock.url = this.getMockUrl(mock);
    });
  }

  async copyText(text: string) {
    await copyText(text);
    this.message.success($localize`Copied`);
  }
  async addOrEditModal(item, index?) {
    if (item.uuid) {
      await this.apiMock.updateMock(item, Number(item.uuid));
      this.message.success($localize`Edited successfully`);
      this.mockList[index] = item;
    } else {
      item.apiDataID = this.apiData.uuid;
      const result = await this.apiMock.createMock(item);
      Object.assign(item, result.data, {
        createWay: 'custom'
      });
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
    if (mock?.createWay === 'custom' && mock.uuid) {
      url.searchParams.set('mockID', `${mock.uuid}`);
    }
    return decodeURIComponent(url.toString());
  }
}
