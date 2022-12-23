import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtensionAppComponent } from 'eo/workbench/browser/src/app/shared/components/extension-app/extension-app.component';

import { PageBlankComponent } from '../layouts/page-blank/page-blank.component';
import { PagesComponent } from './pages.component';
import { RedirectSharedID, RedirectWorkspace } from './services/redirect.services';

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
        path: 'blank',
        component: PageBlankComponent
      },
      {
        path: 'workspace',
        canActivate: [RedirectWorkspace],
        runGuardsAndResolvers: 'always',
        loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule)
      },
      {
        path: 'share',
        canActivate: [RedirectSharedID],
        runGuardsAndResolvers: 'always',
        loadChildren: () => import('./share-project/share-project.module').then(m => m.ShareProjectModule)
      },
      {
        path: 'extension',
        loadChildren: () => import('./extension/extension.module').then(m => m.ExtensionModule)
      },
      {
        path: 'extensionSidebarView/:extName',
        component: ExtensionAppComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [RedirectSharedID, RedirectWorkspace],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
