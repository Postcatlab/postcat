import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

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
})
export class AppRoutingModule {}
