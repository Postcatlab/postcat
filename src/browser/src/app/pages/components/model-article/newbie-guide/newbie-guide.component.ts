import { Component } from '@angular/core';

// @ts-ignore
import newPeopleGuide from './newPeopleGuide.md';

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
    console.log(newPeopleGuide);
    const newPeopleGuideHtml = newPeopleGuide.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, match =>
      match.replace(/<img /gi, '<img style="width: 100%" ')
    );
    document.getElementById('newbie-guide-markdown').innerHTML = newPeopleGuideHtml;
  }
}
