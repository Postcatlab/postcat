import { Component } from '@angular/core';

@Component({
  selector: 'eo-root',
  template: `<router-outlet ngClass="{'console-page':openConsole}"></router-outlet>
    <pc-console *ngIf="openConsole"></pc-console>
    <pc-nps-mask></pc-nps-mask>`
})
export class AppComponent {
  openConsole = false;
  constructor() {
    //@ts-ignore
    window.tooglePcConsole = (isOpen = true) => {
      this.openConsole = isOpen;
    };
  }
}
