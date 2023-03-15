import { Directive, ElementRef } from '@angular/core';

import { TraceService } from '../../services/trace.service';

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
  constructor(private el: ElementRef, private trace: TraceService) {
    this.getNpsPosition();
  }
  hideMask() {
    this.showTitle = false;
    this.showtips = false;
    const tipsDom = this.el.nativeElement.querySelector('.tips');
    tipsDom.innerText = '';
  }
  resetTitlePostion(rect) {
    const titleDom = this.el.nativeElement.querySelector('.title');
    this.batchSetPropery(titleDom, {
      right: `${24 + this.padding / 2}px`,
      bottom: '160px',
      width: `${rect.width - this.padding}px`
    });
  }
  resettipsPostion(rect) {
    const tipsDom = this.el.nativeElement.querySelector('.tips');
    this.batchSetPropery(tipsDom, {
      right: `${24}px`,
      bottom: '40px',
      width: `${rect.width}px`
    });
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
          const hasClose = className.includes('modal-widget_backdropBase') && !className.includes('modal-widget_backdropIn');
          // console.log(step, className, npsSlideIn, hasSubmit, hasClose);
          //* 1. Show mask
          if (iframe && npsSlideIn && step < 1) {
            step = 1;
            // console.log('showMask');
            setTimeout(() => {
              this.showMask(iframe as HTMLIFrameElement);
            }, 150);
            return;
          }
          //* 1.1 Directly Close mask
          if (step === 1 && hasClose) {
            this.hideMask();
            npsDomObserver.disconnect();
            return;
          }

          //* 2. Submit NPS
          if (hasSubmit && step < 2) {
            // console.log('submitNps');
            step = 2;
            this.trace.report('submit_nps');
            this.showTitle = false;
            const tipsDom = this.el.nativeElement.querySelector('.tips');
            // tipsDom.innerText = $localize`Thank you for your feedback`;
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
  batchSetPropery(dom, propsObj) {
    if (!dom) return;
    Object.keys(propsObj).forEach(keyName => {
      dom.style.setProperty(keyName, propsObj[keyName]);
    });
  }
}
