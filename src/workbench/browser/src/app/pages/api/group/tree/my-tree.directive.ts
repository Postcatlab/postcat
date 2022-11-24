import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[myTree]',
})
export class MyTreeDirective implements OnChanges {
  @Input() node?: any;

  constructor(private readonly el: ElementRef) {}

  ngOnChanges(): void {
    const treeNode = this.el.nativeElement.closest('nz-tree-node-title');
    if (treeNode) {
      treeNode.style.display = 'block';
      treeNode.style.width = `calc(100% - 24px * ${this.node.level + 1})`;
    }
  }
}
