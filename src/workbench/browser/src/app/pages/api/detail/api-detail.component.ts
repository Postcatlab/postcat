import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiData, ApiBodyType, JsonRootType, StorageHandleResult, StorageHandleStatus } from '../../../../../../../platform/browser/IndexedDB';
import { treeToListHasLevel } from '../../../utils/tree/tree.utils';
import { reverseObj } from '../../../utils';
import { StorageService } from '../../../shared/services/storage';

export interface TreeNodeInterface {
  key?: string;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
@Component({
  selector: 'api-detail',
  templateUrl: './api-detail.component.html',
  styleUrls: ['./api-detail.component.scss'],
})
export class ApiDetailComponent implements OnInit {
  apiData: ApiData | any = {};
  CONST = {
    BODY_TYPE: reverseObj(ApiBodyType),
    JSON_ROOT_TYPE: reverseObj(JsonRootType)
  };
  constructor(private route: ActivatedRoute, private storage: StorageService) {
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.uuid) {
        this.getApiByUuid(Number(params.uuid));
      } else {
        console.error("can't no find api");
      }
    });
  }
  getApiByUuid(id: number) {
    this.storage.run('apiDataLoad', [id], (result: StorageHandleResult) => {
      if (result.status === StorageHandleStatus.success) {
        ['requestBody', 'responseBody'].forEach((tableName) => {
          if (['xml', 'json'].includes(result.data[`${tableName}Type`])) {
            result.data[tableName] = treeToListHasLevel(result.data[tableName]);
          }
        });
        this.apiData = result.data;
      }
    });
  }
}
