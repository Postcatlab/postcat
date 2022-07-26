import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'eo-split-panel',
  templateUrl: './split.panel.component.html',
  styleUrls: ['./split.panel.component.scss'],
})
export class SplitPanelComponent implements OnInit, OnDestroy {
  @Input() direction = 'column';
  @Input() topStyle;
  @Input() bottomStyle;
  @Input() hideSeparator = false;

  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;

  @ViewChild('scalable') scalableRef: ElementRef;
  @ViewChild('bottomRef') bottomRef: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  // 拖拽中
  onDrag = (e: MouseEvent) => {
    const scalableEl = this.scalableRef.nativeElement;
    if (scalableEl) {
      scalableEl.style.height = `${this.startHeight + e.clientY - this.startY}px`;
      this.bottomRef.nativeElement.style.height = `calc(100% - 12px - ${scalableEl.style.height})`;
    }
  };

  // 拖拽结束
  dragEnd = () => {
    document.documentElement.style.userSelect = 'unset';
    document.documentElement.removeEventListener('mousemove', this.onDrag);
    document.documentElement.removeEventListener('mouseup', this.dragEnd);
  };

  // 鼠标按下
  startDrag = (e: MouseEvent) => {
    this.startY = e.clientY;
    const scalableEl = this.scalableRef.nativeElement;

    scalableEl && (this.startHeight = parseInt(window.getComputedStyle(scalableEl).height, 10));

    document.documentElement.style.userSelect = 'none';
    document.documentElement.addEventListener('mousemove', this.onDrag);
    document.documentElement.addEventListener('mouseup', this.dragEnd);
  };
}
