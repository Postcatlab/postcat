import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import MarkdownIt from 'markdown-it/dist/markdown-it';

@Component({
  selector: 'eo-shadow-dom',
  template: ` <div [innerHTML]="md.render(html || '')"></div> `,
  styles: ['h2, .shadow-message { color: blue; }'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ShadowDomEncapsulationComponent implements OnInit {
  md = new MarkdownIt();

  @Input() html = '';

  ngOnInit() {
    this.customLinkRender();
  }

  customLinkRender() {
    const defaultRender =
      this.md.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    this.md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      // If you are sure other plugins can't add `target` - drop check below
      const aIndex = tokens[idx].attrIndex('target');

      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
      } else {
        tokens[idx].attrs[aIndex][1] = '_blank'; // replace value of existing attr
      }

      // pass token to default renderer.
      return defaultRender(tokens, idx, options, env, self);
    };
  }
}
