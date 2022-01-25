import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiTabService } from './tab/api-tab.service';
@Component({
  selector: 'eo-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit {
  /**
   * API uuid
   */
  id: number;

  TABS = [
    {
      routerLink: 'detail',
      title: '文档',
    },
    {
      routerLink: 'edit',
      title: '编辑',
    },
    {
      routerLink: 'test',
      title: '测试',
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private tabSerive: ApiTabService
  ) {}

  ngOnInit(): void {
    this.watchChangeRouter();
  }


  /**
   * Get current API ID to show content tab
   */
  watchChangeRouter() {
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.route.queryParamMap.subscribe((params) => {
      this.id = Number(params.get('uuid'));
    });
  }
  clickContentMenu(data) {
    this.tabSerive.apiEvent$.next({ action: 'beforeChangeRouter', data: data });
  }
}
