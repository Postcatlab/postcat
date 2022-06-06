import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiData,
  ApiBodyType,
  JsonRootType,
  StorageRes,
  StorageResStatus,
} from '../../../shared/services/storage/index.model';
import { tree2obj, treeToListHasLevel } from '../../../utils/tree/tree.utils';
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
    JSON_ROOT_TYPE: reverseObj(JsonRootType),
  };
  constructor(private route: ActivatedRoute, private storage: StorageService) {}
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
    this.storage.run('apiDataLoad', [id], (result: StorageRes) => {
      this.apiData = result.data;
      if (result.status === StorageResStatus.success) {
        // 如果没有mock，则生成系统默认mock
        if ((window.eo?.getMockUrl && !Array.isArray(this.apiData.mockList)) || this.apiData.mockList?.length === 0) {
          const url = new URL(this.apiData.uri, window.eo.getMockUrl());
          this.apiData.mockList = [
            {
              name: '系统默认期望',
              url: url.toString(),
              response: JSON.stringify(tree2obj([].concat(this.apiData.responseBody))),
              isDefault: true,
            },
          ];
        }

        ['requestBody', 'responseBody'].forEach((tableName) => {
          if (['xml', 'json'].includes(this.apiData[`${tableName}Type`])) {
            this.apiData[tableName] = treeToListHasLevel(this.apiData[tableName]);
          }
        });
      }
    });
  }
}
