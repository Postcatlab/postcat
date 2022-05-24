import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExtensionGroupType } from './extension.model';
import { ExtensionService } from './extension.service';

@Component({
  selector: 'eo-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss'],
})
export class ExtensionComponent implements OnInit {
  groups = [
    {
      id: 'all',
      title: '全部插件',
    },
    {
      id: 'official',
      title: '官方插件',
    },
    {
      id: 'installed',
      title: '已安装',
      showNum: true
    },
  ];
  selectGroup: ExtensionGroupType|string = ExtensionGroupType.all;
  constructor(public extensionService: ExtensionService, private router: Router) {
  }
  clickGroup(id) {
    this.selectGroup = id;
    this.router
      .navigate(['home/extension/list'], {
        queryParams: { type: id },
      })
      .finally();
  }
  ngOnInit(): void {}
}
