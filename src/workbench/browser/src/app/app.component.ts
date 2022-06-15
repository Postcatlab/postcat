import { Component } from '@angular/core';
import { ThemeService } from './core/services';
import { AppService } from './app.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';

@Component({
  selector: 'eo-root',
  template: `
    <eo-message></eo-message>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private theme: ThemeService, private app: AppService, private remoteService: RemoteService) {
    this.theme.changeTheme();
  }
}
