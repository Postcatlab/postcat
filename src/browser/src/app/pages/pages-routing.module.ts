import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { RedirectWorkspace } from './services/redirect.services';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'workspace',
        pathMatch: 'full'
      },
      {
        path: 'workspace',
        canActivate: [RedirectWorkspace],
        runGuardsAndResolvers: 'always',
        loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule)
      },
      {
        path: 'extension',
        loadChildren: () => import('./components/extension/extension.module').then(m => m.ExtensionModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [RedirectWorkspace],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
