import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiData,
  ApiBodyType,
  JsonRootType,
  StorageRes,
  StorageResStatus,
} from '../../../../shared/services/storage/index.model';
import { treeToListHasLevel } from '../../../../utils/tree/tree.utils';
import { reverseObj } from '../../../../utils/index.utils';
import { StorageService } from '../../../../shared/services/storage';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
@Component({
  selector: 'api-detail',
  templateUrl: './api-detail.component.html',
  styleUrls: ['./api-detail.component.scss'],
})
export class ApiDetailComponent implements OnInit {
  @Input() model: ApiData | any;
  @Output() eoOnInit = new EventEmitter<ApiData>();
  CONST = {
    BODY_TYPE: reverseObj(ApiBodyType),
    JSON_ROOT_TYPE: reverseObj(JsonRootType),
  };
  mockListColumns = [
    { title: $localize`Name`, slot: 'name', width: '20%' },
    { title: $localize`Created Type`, slot: 'createWay', width: '18%' },
    { title: 'URL', slot: 'url', width: '42%' },
  ];
  constructor(private route: ActivatedRoute, private storage: StorageService, public electron: ElectronService) {}
  ngOnInit(): void {
    this.init();
  }
  async init() {
    if (!this.model) {
      this.model = {} as ApiData;
      const id = Number(this.route.snapshot.queryParams.uuid);
      if (id) {
        this.model = (await this.getApiByUuid(Number(id))) as ApiData;
      } else {
        console.error("Can't no find api");
      }
    }
    this.eoOnInit.emit(this.model);
  }
  getApiByUuid(id: number) {
    return new Promise((resolve) => {
      this.storage.run('apiDataLoad', [id], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          ['requestBody', 'responseBody'].forEach((tableName) => {
            if (['xml', 'json'].includes(result.data[`${tableName}Type`])) {
              result.data[tableName] = treeToListHasLevel(result.data[tableName]);
            }
          });
          this.model = result.data;
          resolve(this.model);
        }
      });
    });
  }
}
