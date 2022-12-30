import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFindModule } from 'eo/workbench/browser/src/app/layouts/page-not-found/page-not-find.module';
import { PageNotFoundComponent } from 'eo/workbench/browser/src/app/layouts/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //Electron user hash to keep router after page refresh
      useHash: !!(window && window.process && window.process.type) ? true : false,
      preloadingStrategy: PreloadAllModules
    }),
    PageNotFindModule
  ],
  exports: [RouterModule],
  // 👇 设置基础路由
  // providers: [
  //   {
  //     provide: APP_BASE_HREF,
  //     // @ts-ignore
  //     useValue: window.__MICRO_APP_BASE_ROUTE__ || '/',
  //   },
  // ],
  schemas: []
})
export class AppRoutingModule {}
