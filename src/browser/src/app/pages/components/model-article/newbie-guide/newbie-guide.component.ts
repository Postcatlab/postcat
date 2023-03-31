import { Component } from '@angular/core';
import NEWBIE_GUIDE from 'pc/browser/src/app/shared/constans/newbie-guide';

const markdownIt = require('markdown-it');

@Component({
  standalone: true,
  selector: 'pc-newbie-guide',
  template: `
    <div class="newbie-guide">
      <img src="../../../../assets/images/newbie-guide.png" style="width: 100%" alt="" />
      <div id="newbie-guide-markdown"></div>
    </div>
  `,
  styleUrls: ['./newbie-guide.component.scss']
})
export class NewbieGuideComponent {
  async ngAfterViewInit() {
    let md = new markdownIt();
    const newbieGuideHtml = md.render(NEWBIE_GUIDE);

    document.getElementById('newbie-guide-markdown').innerHTML = newbieGuideHtml;
  }
}
