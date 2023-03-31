import { Component } from '@angular/core';
import markdownIt from 'markdown-it/dist/markdown-it';
import UPDATE_LOG from 'pc/browser/src/app/shared/constans/update-log';

@Component({
  selector: 'pc-update-log',
  template: `
    <div class="update-log">
      <div id="update-log-markdown"></div>
    </div>
  `,
  styleUrls: ['./update-log.component.scss']
})
export class UpdateLogComponent {
  async ngAfterViewInit() {
    let md = new markdownIt();
    const html = md.render(UPDATE_LOG);

    const updateLogHtml = html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, match =>
      match.replace(/<img /gi, '<img style="width: 100%" ')
    );
    document.getElementById('update-log-markdown').innerHTML = updateLogHtml;
  }
}
