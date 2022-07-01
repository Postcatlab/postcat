import { Component, Input } from '@angular/core';

@Component({
  // standalone: true,
  selector: 'eo-iconpark-icon',
  template: `<iconpark-icon [name]="name" [ngStyle]="{ fontSize: size }"></iconpark-icon>`,
  styleUrls: [],
  host: {
    class: 'inline-flex',
  },
})
export class EoIconparkIconComponent {
  @Input() name: string;
  @Input() size = '18px';

  constructor() {}
}
