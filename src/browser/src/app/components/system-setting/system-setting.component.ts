import { Component, Input } from '@angular/core';
import { AccountComponent } from 'pc/browser/src/app/components/system-setting/common/account.component';
import { StoreService } from 'pc/browser/src/app/store/state.service';

import { SettingItem } from '../eo-ui/setting/setting.component';
import { AboutComponent, LanguageSwticherComponent, SelectThemeComponent, TokenComponent } from './common';

@Component({
  selector: 'eo-system-setting',
  template: ` <eo-setting [selectedModule]="selectedModule" [nzData]="treeNodes"></eo-setting>`,
  styleUrls: [`./system-setting.component.scss`]
})
export class SystemSettingComponent {
  @Input() selectedModule: string;
  treeNodes: SettingItem[] = [
    {
      title: $localize`:@@Account:Account`,
      id: 'account',
      ifShow: () => {
        return this.store.isLogin;
      },
      comp: AccountComponent
    },
    {
      title: $localize`:@@Theme:Theme`,
      id: 'theme',
      comp: SelectThemeComponent
    },
    // {
    //   title: $localize`:@@Cloud:Cloud Storage`,
    //   id: 'data-storage',
    //   comp: DataStorageComponent,
    //   ifShow: () => !this.webService.isWeb
    // },
    {
      title: $localize`:@@Language:Language`,
      id: 'language',
      comp: LanguageSwticherComponent
    },
    { title: $localize`Token`, id: 'token', comp: TokenComponent },
    {
      title: $localize`About`,
      id: 'about',
      comp: AboutComponent
    }
  ];

  constructor(private store: StoreService) {}
}
