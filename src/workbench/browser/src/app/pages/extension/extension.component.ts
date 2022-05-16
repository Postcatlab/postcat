import { Component, OnInit } from '@angular/core';
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
      showNum: true,
      num: 0,
    },
  ];
  selectGroup: ExtensionGroupType = ExtensionGroupType.all;
  constructor(private extensionService: ExtensionService) {
    this.groups[2].num = this.extensionService.pluginNames.length;
  }
  handleSelect(id: ExtensionGroupType) {
    this.selectGroup = id;
  }
  ngOnInit(): void {}
}
