import { Directive, ElementRef, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[auto-focus-form]'
})
export class FormFocusDirective implements AfterViewInit {
  focusables = ['.ant-input', 'select', 'textarea', '.ant-select-selection-search-input'];

  constructor(private element: ElementRef, private cdk: ChangeDetectorRef) {}
  ngAfterViewInit() {
    const input = this.element.nativeElement.querySelector(this.focusables.join(','));
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
