import { Component, OnInit, Input} from '@angular/core';
import { ApiEditQuery } from '../../../../shared/services/api-data/api-edit-params.model';
import { ApiDetailService } from '../api-detail.service';

@Component({
  selector: 'eo-api-detail-query',
  templateUrl: './api-detail-query.component.html',
  styleUrls: ['./api-detail-query.component.scss']
})
export class ApiDetailQueryComponent implements OnInit {
  @Input() model: ApiEditQuery[];
  listConf: object = {};
  constructor(private detailService: ApiDetailService) {}

  ngOnInit(): void {
    this.initListConf();
  }
  private initListConf() {
    this.listConf =this.detailService.initListConf({
      dragCacheVar:'DRAG_VAR_API_EDIT_QUERY'
    });
  }
}
