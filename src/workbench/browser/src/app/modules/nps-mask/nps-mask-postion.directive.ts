import { Directive, ElementRef } from '@angular/core';

import { waitNextTick } from '../../utils/index.utils';

@Directive({
  selector: '[pcNpsPosition]',
  standalone: true,
  host: {
    '[class.nps-show]': 'showTitle&&showTitle',
    '[class.nps-show-title]': 'showTitle',
    '[class.nps-show-tips]': 'showtips'
  }
})
export class NpsPositionDirective {
  showTitle = false;
  showtips = false;
  padding = 30;
  constructor(private el: ElementRef) {
    this.getNpsPosition();
  }
  hideMask() {
    this.showTitle = false;
    this.showtips = false;
  }
  resetTitlePostion(rect) {
    const titleDom = this.el.nativeElement.querySelector('.title');
    titleDom.style.right = `${24 + this.padding / 2}px`;
    titleDom.style.bottom = '160px';
    titleDom.style.width = `${rect.width - this.padding}px`;
  }
  resettipsPostion(rect) {
    const tipsDom = this.el.nativeElement.querySelector('.tips');
    tipsDom.style.right = `${24}px`;
    tipsDom.style.bottom = '40px';
    tipsDom.style.width = `${rect.width}px`;
  }
  resetMaskPostion(dom: HTMLIFrameElement) {
    const rect = dom.getBoundingClientRect();
    this.resetTitlePostion(rect);
    this.resettipsPostion(rect);
  }
  showMask(iframe: HTMLIFrameElement) {
    this.showTitle = true;
    this.showtips = true;
    this.resetMaskPostion(iframe);
  }
  getNPSIframe(): HTMLIFrameElement | boolean {
    let result;
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (!iframe.src.includes('howxm')) return;
      result = iframe;
    });
    return result;
  }
  getNpsPosition() {
    const targetNode = document.body;
    let npsDomObserver;
    const config = { childList: true };
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type !== 'childList' || !mutation.addedNodes.length) return;
        const npsDom = mutation.addedNodes[0];
        if (!npsDom.id.includes('howxmSDK')) return;

        //* Reset status after update body,such as refresh page
        this.hideMask();
        npsDomObserver?.disconnect();

        let iframe;
        let step = 0;
        npsDomObserver = new MutationObserver(e => {
          iframe = e[0].target.nodeName === 'IFRAME' ? e[0].target : iframe;
          if (!iframe) return;

          const className = e[0].target['className'] || '';
          const npsSlideIn = className.includes('widget_SlideInRightBottom');
          const hasSubmit = className.includes('modal-widget_widgetTransition') && e[0].attributeName === 'style';
          // console.log(iframe, step, className, hasSubmit, e);
          //* 1. Show mask
          if (iframe && npsSlideIn && step < 1) {
            step = 1;
            // console.log('showMask');
            setTimeout(() => {
              this.showMask(iframe as HTMLIFrameElement);
            }, 150);
            return;
          }
          //* 2. Submit NPS
          if (hasSubmit && step < 2) {
            // console.log('submitNps');
            step = 2;
            this.showTitle = false;
            const tipsDom = this.el.nativeElement.querySelector('.tips');
            tipsDom.innerText = $localize`Thanks for you feedback`;
            return;
          }

          //* 3. Nps finish
          if (step === 2 && !hasSubmit) {
            // console.log('closeMask');
            npsDomObserver.disconnect();
            setTimeout(() => {
              this.showtips = false;
            }, 50);
          }
        });
        npsDomObserver.observe(npsDom, { subtree: true, attributes: true });
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }
}
