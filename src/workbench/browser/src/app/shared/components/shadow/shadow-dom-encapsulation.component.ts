import { Component, Input, ViewEncapsulation } from '@angular/core';
import MarkdownIt from 'markdown-it/dist/markdown-it';

@Component({
  selector: 'eo-shadow-dom',
  template: ` <div [innerHTML]="md.render(html || '')"></div> `,
  styles: ['h2, .shadow-message { color: blue; }'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ShadowDomEncapsulationComponent {
  md = new MarkdownIt();

  @Input() html = '';
}
