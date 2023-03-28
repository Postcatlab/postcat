import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiModule } from 'pc/browser/src/app/pages/workspace/project/api/api.module';
import { API_TABS, BASIC_TABS_INFO, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';

import { NavbarModule } from '../../layouts/navbar/navbar.module';
import { SharedModule } from '../../shared/shared.module';
import { ShareRoutingModule } from './share-routing.module';
import { ShareComponent } from './view/share-project.component';

const tabs = API_TABS.map(val => ({ ...val, pathname: `/share${val.pathname}` }));

@NgModule({
  imports: [ShareRoutingModule, NavbarModule, CommonModule, SharedModule, ApiModule],
  declarations: [ShareComponent],
  providers: [
    {
      provide: BASIC_TABS_INFO,
      useValue: {
        BASIC_TABS: tabs,
        pathByName: tabs.reduce((acc, curr) => ({ ...acc, [curr.uniqueName]: curr.pathname }), {})
      } as TabsConfig
    }
  ]
})
export class ShareProjectModule {}
