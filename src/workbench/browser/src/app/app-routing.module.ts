import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { APP_BASE_HREF } from '@angular/common';

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
  providers: [
    {
      provide: APP_BASE_HREF,
      // @ts-ignore __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
      useValue: window.__MICRO_APP_BASE_ROUTE__ || '/',
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule {}
