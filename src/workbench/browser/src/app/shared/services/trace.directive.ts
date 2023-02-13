import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { TraceService } from 'eo/workbench/browser/src/app/shared/services/trace.service';

@Directive({
  selector: '[trace]'
})
export class TraceDirective implements OnInit {
  @Input() traceID: string;
  @Input() traceParams: any = {};
  constructor(private trace: TraceService) {}
  ngOnInit(): void {
    console.log('TraceDirective');
  }

  @HostListener('click', ['$event'])
  tClick(event) {
    this.trace.report(this.traceID, this.traceParams);
  }

  @HostListener('focus', ['$event'])
  fFocus(event) {
    const tagName = event.target.tagName;
    if (!['INPUT', 'SELECT', 'RADIO'].includes(tagName)) {
      return;
    }
    this.trace.report(this.traceID, this.traceParams);
  }
}
