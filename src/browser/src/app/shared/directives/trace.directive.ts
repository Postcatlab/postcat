import { Directive, HostListener, Input } from '@angular/core';
import { TraceService } from 'pc/browser/src/app/services/trace.service';

@Directive({
  selector: '[trace]'
})
export class TraceDirective {
  @Input() traceID: string;
  @Input() traceParams: any = {};
  constructor(private trace: TraceService) {}

  @HostListener('click', ['$event'])
  tClick(event) {
    this.trace.report(this.traceID, this.traceParams);
  }

  @HostListener('keydown')
  tKeyDown() {}

  @HostListener('focus', ['$event'])
  onFocus(event) {
    const tagName = event.target.tagName;
    if (!['INPUT', 'SELECT', 'RADIO'].includes(tagName)) {
      return;
    }
    this.trace.report(this.traceID, this.traceParams);
  }
}
