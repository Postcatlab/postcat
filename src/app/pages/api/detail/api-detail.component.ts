import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiData, ApiBodyType, JsonRootType } from 'eoapi-core';
import { StorageService } from '../../../shared/services/storage.service';
import { treeToListHasLevel } from '../../../utils/tree';
import { reverseObj } from '../../../utils';

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
  constructor(private storage: StorageService, private route: ActivatedRoute) {
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
    this.storage.storage.apiDataLoad(id).subscribe((result: ApiData) => {
      ['requestBody', 'responseBody'].forEach((tableName) => {
        if (['xml', 'json'].includes(result[`${tableName}Type`])) {
          result[tableName] = treeToListHasLevel(result[tableName]);
        }
      });
      this.apiData = result;
    });
  }
}
