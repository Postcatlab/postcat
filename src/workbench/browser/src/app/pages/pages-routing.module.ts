import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  UrlTree,
} from '@angular/router';
import { Injectable, NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PageBlankComponent } from '../layout/page-blank/page-blank.component';
import { ExtensionAppComponent } from 'eo/workbench/browser/src/app/shared/components/extension-app/extension-app.component';
import { Observable } from 'rxjs';
import { StoreService } from '../shared/store/state.service';
// import { Vue3Component } from 'eo/workbench/browser/src/app/pages/vue3/vue3.component';

@Injectable()
class RedirectProjectID implements CanActivate {
  constructor(private store: StoreService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const urlTree = this.router.parseUrl(state.url);
    if(!urlTree.queryParams.shareId&& this.store.shareId){
      urlTree.queryParams.shareId = this.store.shareId;
      return urlTree;
    }
    return true;
  }
}

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'api',
        pathMatch: 'full',
      },
      {
        path: 'blank',
        component: PageBlankComponent,
      },
      {
        path: 'api',
        loadChildren: () => import('./api/api.module').then((m) => m.ApiModule),
      },
      {
        path: 'workspace',
        loadChildren: () => import('./workspace/workspace.module').then((m) => m.EoWorkspaceModule),
      },
      {
        path: 'share',
        canActivate: [RedirectProjectID],
        runGuardsAndResolvers: 'always',
        loadChildren: () => import('./share-project/share-project.module').then((m) => m.ShareProjectModule),
      },
      {
        path: 'member',
        loadChildren: () => import('./member.module').then((m) => m.MemberModule),
      },
      {
        path: 'extension',
        loadChildren: () => import('./extension/extension.module').then((m) => m.ExtensionModule),
      },
      {
        path: 'extensionSidebarView/:extName',
        component: ExtensionAppComponent,
      },
      // {
      //   path: 'app-vue3',
      //   children: [
      //     {
      //       path: '**',
      //       component: Vue3Component,
      //     },
      //   ],
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [RedirectProjectID],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
