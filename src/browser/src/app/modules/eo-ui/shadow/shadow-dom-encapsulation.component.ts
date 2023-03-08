import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import MarkdownIt from 'markdown-it/dist/markdown-it';

@Component({
  selector: 'eo-shadow-dom',
  template: ` <article class="markdown-body" [innerHTML]="content"></article> `,
  styleUrls: ['./eo-shadow-dom.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ShadowDomEncapsulationComponent implements OnInit {
  md: MarkdownIt;

  @Input() text = '';
  @Input() options = {
    html: false
  };

  get content() {
    const html = this.md.render(this.text || '');
    if (html && this.options.html) {
      const domParser = new DOMParser();
      const doc = domParser.parseFromString(html, 'text/html');
      const a = doc.querySelectorAll('a');
      a.forEach(n => n.setAttribute('target', '_blank'));
      return doc.body.innerHTML;
    } else {
      return html;
    }
  }

  constructor() {}

  ngOnInit() {
    this.md = new MarkdownIt(this.options);
    this.customLinkRender();
  }

  customLinkRender() {
    const defaultRender = this.md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

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
