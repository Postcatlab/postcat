import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: '**',
    loadChildren: () => import('./layouts/page-not-found/page-not-find.module').then((m) => m.PageNotFindModule),
  },
];
@NgModule({
  imports: [
    //electron user hash to keep router after page refresh
    RouterModule.forRoot(routes, {
      useHash: !!(window && window.process && window.process.type) ? true : false,
      preloadingStrategy: PreloadAllModules,
    }),
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
  schemas: [],
})
export class AppRoutingModule {}
