import { Component, Input } from '@angular/core';

@Component({
  // standalone: true,
  selector: 'eo-iconpark-icon',
  template: `<svg class="iconpark-icon" [ngStyle]="{ width: size, height: size }">
    <use [attr.href]="'#' + name"></use>
  </svg>`,
  styles: [
    `
    `,
  ],
})
export class EoIconparkIconComponent {
  @Input() name: string;
  @Input() size?: string;
  constructor() {}
}
