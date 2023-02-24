import { Directive, ElementRef, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[auto-focus-form]'
})
export class FormFocusDirective implements AfterViewInit {
  /**
   * Priority: input > textarea > select > search
   */
  focusables = ['.ant-input', 'textarea', 'select', '.ant-select-selection-search-input'];

  constructor(private element: ElementRef, private cdk: ChangeDetectorRef) {}
  ngAfterViewInit() {
    let input;
    this.focusables.some(className => {
      const dom = this.element.nativeElement.querySelector(className);
      if (dom) {
        input = dom;
        return true;
      }
    });
    if (input) {
      setTimeout(() => {
        input.focus();
        this.cdk.detectChanges();
      }, 300);
    }
  }

  @HostListener('submit')
  submit() {
    const input = this.element.nativeElement.querySelector(this.focusables.map(x => `${x}.ng-invalid`).join(','));
    if (input) {
      input.focus();
    }
  }
}
