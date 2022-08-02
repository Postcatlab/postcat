import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';

type EventListener = HTMLElement['removeEventListener'] | HTMLElement['addEventListener'];
@Component({
  selector: 'eo-split-panel',
  templateUrl: './split.panel.component.html',
  styleUrls: ['./split.panel.component.scss'],
})
export class SplitPanelComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() direction: 'column' | 'row' = 'column';
  @Input() topStyle;
  @Input() bottomStyle;
  @Input() hideSeparator = false;

  @ViewChild('scalable') scalableRef: ElementRef;
  @ViewChild('separator') separatorRef: ElementRef;
  @ViewChild('bottomRef') bottomRef: ElementRef;

  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  maxRightWidth: number;
  intersectionObserver: IntersectionObserver;

  constructor() {}
  ngAfterViewInit(): void {
    this.intersectionObserver = new IntersectionObserver(
      ([change]) => {
        // @ts-ignore
        // ⚠️ Feature detection
        if (typeof change.isVisible === 'undefined') {
          // The browser doesn't support Intersection Observer v2, falling back to v1 behavior.
          // change.isVisible = true;
          return;
        }
        // @ts-ignore
        if (change.isIntersecting && change.isVisible) {
          // console.log('显示了');
        } else {
          const scalableEl = this.scalableRef.nativeElement;
          const bottomEl = this.bottomRef.nativeElement;
          const { bottom } = change.boundingClientRect;
          if (this.direction === 'column' && bottom >= document.documentElement.offsetHeight - 30) {
            const h =
              document.documentElement.offsetHeight - change.target.parentElement.getBoundingClientRect().top - 30 - 10;
            scalableEl.style.height = `${h}px`;
            bottomEl.style.height = `calc(100% - 12px - ${scalableEl.style.height})`;
          }
        }
      },
      {
        threshold: [1.0],
        // @ts-ignore
        // 🆕 Set a minimum delay between notifications
        delay: 600,
        // 🆕 Track the actual visibility of the element
        trackVisibility: true,
      }
    );
    this.intersectionObserver.observe(this.separatorRef.nativeElement);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.intersectionObserver.disconnect();
  }

  // 拖拽中
  onDrag = (e: MouseEvent) => {
    const scalableEl = this.scalableRef.nativeElement;
    const bottomEl = this.bottomRef.nativeElement;
    if (scalableEl) {
      if (this.direction === 'column') {
        if (e.clientY >= document.documentElement.offsetHeight - 30) {
          return;
        }
        scalableEl.style.height = `${this.startHeight + e.clientY - this.startY}px`;
        bottomEl.style.height = `calc(100% - 12px - ${scalableEl.style.height})`;
      } else {
        scalableEl.style.width = `${this.startWidth + e.clientX - this.startX}px`;
        bottomEl.style.width = `calc(100% - 12px - ${scalableEl.style.width})`;
      }
    }
  };

  // 拖拽结束
  dragEnd = () => {
    document.documentElement.style.userSelect = 'unset';
    this.handleEventListener('remove');
  };

  // 鼠标按下
  startDrag = (e: MouseEvent) => {
    this.startY = e.clientY;
    this.startX = e.clientX;
    const scalableEl = this.scalableRef.nativeElement;

    if (scalableEl) {
      this.startWidth = parseInt(window.getComputedStyle(scalableEl).width, 10);
      this.startHeight = parseInt(window.getComputedStyle(scalableEl).height, 10);
    }

    document.documentElement.style.userSelect = 'none';
    this.handleEventListener('add');
  };

  handleEventListener = (type: 'add' | 'remove') => {
    const eventListener = document.documentElement[`${type}EventListener`] as EventListener;
    eventListener('mousemove', this.onDrag);
    eventListener('mouseup', this.dragEnd);
  };
}
