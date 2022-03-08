import { Component, OnInit, Input} from '@angular/core';
import { ApiEditRest } from '@eoapi/storage';
import { ApiDetailService } from '../api-detail.service';
@Component({
  selector: 'eo-api-detail-rest',
  templateUrl: './api-detail-rest.component.html',
  styleUrls: ['./api-detail-rest.component.scss'],
})
export class ApiDetailRestComponent implements OnInit {
  @Input() model: ApiEditRest[];
  listConf: object = {};
  constructor(private detailService: ApiDetailService) {}
  ngOnInit(): void {
    this.initListConf();
  }
  private initListConf() {
    this.listConf = this.detailService.initListConf({
      dragCacheVar: 'DRAG_VAR_API_EDIT_REST',
    });
  }
}
