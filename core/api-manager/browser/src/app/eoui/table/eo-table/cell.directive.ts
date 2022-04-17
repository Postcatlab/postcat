import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[cell]',
})
export class CellDirective {
  @Input('cell') cellName: string;
  constructor(public templateRef: TemplateRef<unknown>) {}
}
