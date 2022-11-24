import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[myTree]',
})
export class MyTreeDirective implements OnInit {
  @Input() node?: any;

  constructor(private readonly el: ElementRef) {}

  ngOnInit(): void {
    const treeNode = this.el.nativeElement.closest('nz-tree-node-title');
    if (treeNode) {
      treeNode.style.display = 'block';
      treeNode.style.width = `calc(100% - 24px * ${this.node.level + 1})`;
    }
  }
}
