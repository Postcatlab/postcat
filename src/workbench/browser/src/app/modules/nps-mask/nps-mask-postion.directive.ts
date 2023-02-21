import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[pcNpsPosition]',
  standalone: true,
  host: {
    '[class.nps-show]': 'hasShow'
  }
})
export class NpsPositionDirective {
  hasShow = false;
  padding = 30;
  constructor(private el: ElementRef) {
    this.getNpsPosition();
  }
  hideMask() {
    this.hasShow = false;
  }
  resetMaskPostion(dom: HTMLIFrameElement) {
    if (!dom.src.includes('howxm')) return;
    const rect = dom.getBoundingClientRect();
    const titleDom = this.el.nativeElement.querySelector('.title');
    const blankDom = this.el.nativeElement.querySelector('.blank');
    titleDom.style.right = `${24 + this.padding / 2}px`;
    titleDom.style.bottom = '160px';
    titleDom.style.width = `${rect.width - this.padding}px`;
    blankDom.style.right = `${24}px`;
    blankDom.style.bottom = '40px';
    blankDom.style.width = `${rect.width}px`;
  }
  showMask(iframe: HTMLIFrameElement) {
    this.hasShow = true;
    this.resetMaskPostion(iframe);
  }
  getNpsPosition() {
    const targetNode = document.body;
    const config = { childList: true };
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          const npsDom = mutation.addedNodes[0];
          console.log(npsDom);
          if (!npsDom.id.includes('howxmSDK')) return;
          const npsDomObserver = new MutationObserver(e => {
            console.log(e);
            // if (e[0].removedNodes) {
            //   this.hideMask();
            //   // npsDomObserver.disconnect();
            // }
            // const iframe = document.querySelectorAll('iframe');
            // iframe.forEach((dom: HTMLIFrameElement) => {
            //   if (!dom.src.includes('howxm')) return;
            //   console.log('frame', dom);
            // observer.disconnect();
            //   // this.showMask(dom);
            // });
          });
          npsDomObserver.observe(npsDom, { subtree: true });
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }
}
