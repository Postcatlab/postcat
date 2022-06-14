import { Component } from '@angular/core';
import { ThemeService } from './core/services';
@Component({
  selector: 'eo-root',
  template: `
    <eo-message></eo-message>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private theme: ThemeService) {
    this.theme.changeTheme();
  }
}
