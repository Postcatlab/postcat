import { Component } from '@angular/core';

@Component({
  selector: 'eo-root',
  template: `<router-outlet ngClass="{'console-page':openConsole}"></router-outlet><pc-console *ngIf="openConsole"></pc-console>`
})
export class AppComponent {
  openConsole = false;
  constructor() {
    //@ts-ignore
    window.tooglePcConsole = (isOpen = true) => {
      this.openConsole = isOpen;
    };

    // this.removeNpsTips();
  }
  /**
   * Remove NPS logo tips
   */
  removeNpsTips() {
    const targetNode = document.body;
    const config = { childList: true };

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          const npsDom = mutation.addedNodes[0];
          if (!npsDom.id.includes('howxmSDK')) return;
          setTimeout(() => {
            const iframe = document.querySelectorAll('iframe');
            iframe.forEach((dom: HTMLIFrameElement) => {
              if (!dom.src.includes('howxm')) return;
              const tipsDom = dom.contentWindow.document;
              console.log(dom.contentWindow, tipsDom, 'A child node has been added or removed.');
            });
            observer.disconnect();
          }, 2000);
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }
}
