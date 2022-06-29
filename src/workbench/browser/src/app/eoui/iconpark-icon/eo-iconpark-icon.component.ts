import { Component, Input } from '@angular/core';

@Component({
  // standalone: true,
  selector: 'eo-iconpark-icon',
  template: `<iconpark-icon [name]="name"></iconpark-icon>`,
  styleUrls: [],
})
export class EoIconparkIconComponent {
  @Input() name: string;

  constructor() {}
}
