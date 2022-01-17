import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiData } from '../../../shared/services/api-data/api-data.model';
import { ApiBodyType, JsonRootType } from '../../../shared/services/api-data/api-body-type';

import { ApiDataService } from '../../../shared/services/api-data/api-data.service';
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
  apiInfo: ApiData | any = {};
  CONST = {
    BODY_TYPE: reverseObj(ApiBodyType),
    JSON_ROOT_TYPE: reverseObj(JsonRootType)
  };
  constructor(private apiService: ApiDataService, private route: ActivatedRoute) {
    console.log(this.CONST.BODY_TYPE);
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
    this.apiService.load(id).subscribe((result: ApiData) => {
      ['requestBody', 'responseBody'].forEach((tableName) => {
        if (['xml', 'json'].includes(result[`${tableName}Type`])) {
          result[tableName] = treeToListHasLevel(result[tableName]);
        }
      });
      this.apiInfo = result;
      console.log(this.apiInfo);
    });
  }
}
