import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { debug } from 'console';
import { throttle } from 'eo/workbench/browser/src/app/utils/index.utils';

type EventListener = HTMLElement['removeEventListener'] | HTMLElement['addEventListener'];
@Component({
  selector: 'eo-split-panel',
  templateUrl: './split.panel.component.html',
  styleUrls: ['./split.panel.component.scss'],
  host: {
    '[style.--separator-height]': `separatorHeight`,
    '[style.--top-height]': `topHeight`,
    '[style.--bottom-height]': `bottomHeight`,
  },
})
export class SplitPanelComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() direction: 'column' | 'row' = 'column';
  @Input() topStyle;
  @Input() bottomStyle;
  @Input() hideSeparator = false;
  @Output() eoDrag = new EventEmitter<[HTMLDivElement, HTMLDivElement]>();

  @ViewChild('scalable') scalableRef: ElementRef<HTMLDivElement>;
  @ViewChild('separator') separatorRef: ElementRef<HTMLDivElement>;
  @ViewChild('bottomRef') bottomRef: ElementRef<HTMLDivElement>;

  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  maxRightWidth: number;

  separatorHeight = '6px';
  topHeight = '';
  bottomHeight = '';

  constructor() {}
  ngAfterViewInit(): void {
    if (this.direction === 'column' && this.topStyle.height) {
      const bottomEl = this.bottomRef.nativeElement;
      bottomEl.style.height = `calc(100% - ${this.topStyle.height} - ${this.separatorHeight})`;
    }
    this.updateTopAndBottomCssVar();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  updateTopAndBottomCssVar() {
    requestAnimationFrame(() => {
      this.topHeight = getComputedStyle(this.scalableRef.nativeElement).height;
      this.bottomHeight = getComputedStyle(this.bottomRef.nativeElement).height;
    });
  }

  updateLayout = throttle(({ clientY, clientX }) => {
    const scalableEl = this.scalableRef.nativeElement;
    const bottomEl = this.bottomRef.nativeElement;
    const { offsetHeight, offsetWidth } = scalableEl.parentElement;
    if (scalableEl) {
      if (this.direction === 'column') {
        if (clientY >= document.documentElement.offsetHeight - (30 + 6)) {
          return;
        }
        const h = ((this.startHeight + clientY - this.startY) / offsetHeight) * 100;
        scalableEl.style.height = `min(${h}%, calc(100% - ${this.separatorHeight}))`;
        bottomEl.style.height = `calc(100% - ${scalableEl.style.height} - ${this.separatorHeight})`;
      } else {
        const w = ((this.startWidth + clientX - this.startX) / offsetWidth) * 100;
        scalableEl.style.width = `min(${w}%, calc(100% - ${this.separatorHeight}))`;
        bottomEl.style.width = `calc(100% - ${scalableEl.style.width} - ${this.separatorHeight})`;
      }
      this.updateTopAndBottomCssVar();
      this.eoDrag.emit([scalableEl, bottomEl]);
    }
  }, 20);

  // 拖拽中
  onDrag = (e: MouseEvent) => {
    this.updateLayout(e);
  };

  // 拖拽结束
  dragEnd = () => {
    document.documentElement.style.removeProperty('user-select');
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

    document.documentElement.style.setProperty('user-select', 'none');
    this.handleEventListener('add');
  };

  handleEventListener = (type: 'add' | 'remove') => {
    const eventListener = document.documentElement[`${type}EventListener`] as EventListener;
    eventListener('mousemove', this.onDrag);
    eventListener('mouseup', this.dragEnd);
  };
}
