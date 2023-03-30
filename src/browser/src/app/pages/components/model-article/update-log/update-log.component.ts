import { Component } from '@angular/core';

// @ts-ignore
import updateLog from './update-log.md';

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
    const updateLogHtml = updateLog.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, match =>
      match.replace(/<img /gi, '<img style="width: 100%" ')
    );
    document.getElementById('update-log-markdown').innerHTML = updateLogHtml;
  }
}
