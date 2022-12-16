import { Component, Input, OnInit } from '@angular/core';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { AccountComponent } from 'eo/workbench/browser/src/app/modules/system-setting/common/account.component';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

import { SettingItem } from '../eo-ui/setting/setting.component';
import { AboutComponent, DataStorageComponent, LanguageSwticherComponent, SelectThemeComponent } from './common';

@Component({
  selector: 'eo-system-setting',
  template: ` <eo-setting [selectedModule]="selectedModule" [nzData]="treeNodes"></eo-setting>`
})
export class SystemSettingComponent {
  @Input() selectedModule: string;
  treeNodes: SettingItem[] = [
    {
      title: $localize`:@@Account:Account`,
      id: 'eoapi-account',
      ifShow: () => {
        return this.store.isLogin;
      },
      comp: AccountComponent
    },
    {
      title: $localize`:@@Theme:Theme`,
      id: 'eoapi-theme',
      comp: SelectThemeComponent
    },
    {
      title: $localize`:@@Cloud:Cloud Storage`,
      id: 'eoapi-common',
      comp: DataStorageComponent,
      ifShow: () => !this.webService.isWeb
    },
    {
      title: $localize`:@@Language:Language`,
      id: 'eoapi-language',
      comp: LanguageSwticherComponent
    },
    {
      title: $localize`About`,
      id: 'eoapi-about',
      comp: AboutComponent
    }
  ];

  constructor(private store: StoreService, private webService: WebService) {}
}
