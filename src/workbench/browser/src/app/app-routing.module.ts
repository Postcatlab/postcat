import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';

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
    component: PageNotFoundComponent,
  },
];
@NgModule({
  imports: [
    //electron user hash to keep router after page refresh
    RouterModule.forRoot(routes, { useHash: !!(window && window.process && window.process.type) ? true : false }),
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
