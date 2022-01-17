import { Component, OnInit } from '@angular/core';
import { ApiData } from '../../../shared/services/api-data/api-data.model';
import { ApiDataService } from '../../../shared/services/api-data/api-data.service';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private apiService: ApiDataService, private route: ActivatedRoute) {}
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
      this.apiInfo = result;
      console.log(this.apiInfo);
    });
  }
}
