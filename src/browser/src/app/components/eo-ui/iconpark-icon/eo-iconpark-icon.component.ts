import { Component, Input } from '@angular/core';

@Component({
  // standalone: true,
  selector: 'eo-iconpark-icon',
  template: `<svg class="iconpark-icon" [ngStyle]="{ width: size, height: size }">
    <use [attr.href]="'#' + name"></use>
  </svg>`,
  styles: [
    `
      ::ng-deep eo-iconpark-icon {
        display: inline-flex;
        vertical-align: middle;
      }
      .ant-btn eo-iconpark-icon {
        color: var(--icon-color);
      }
    `
  ]
})
export class EoIconparkIconComponent {
  @Input() name: string;
  @Input() size?: string;
  constructor() {}
}
