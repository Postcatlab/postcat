import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[auto-focus-form]',
})
export class FormFocusDirective implements AfterViewInit {
  focusables = ['.ant-input', 'select', 'textarea'];

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    const input = this.element.nativeElement.querySelector(this.focusables.join(','));
    if (input) {
      // Promise.resolve().then(() => {
      //   input.focus();
      //   console.log(input);
      // });
    }
  }

  @HostListener('submit')
  submit() {
    console.log('submit');
    const input = this.element.nativeElement.querySelector(this.focusables.map((x) => `${x}.ng-invalid`).join(','));
    if (input) {
      input.focus();
    }
  }
}
