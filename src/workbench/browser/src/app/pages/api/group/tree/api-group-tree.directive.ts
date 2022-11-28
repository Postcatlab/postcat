import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[apiGroupTree]',
})
export class ApiGroupTreeDirective implements OnChanges {
  @Input() node?: any;

  constructor(private readonly el: ElementRef) {}

  ngOnChanges(): void {
    const treeNodeTitle = this.el.nativeElement.closest('nz-tree-node-title');
    if (treeNodeTitle) {
      treeNodeTitle.style.display = 'block';
      treeNodeTitle.style.width = `calc(100% - 24px * ${this.node.level + 1})`;
      const treenode = treeNodeTitle.closest('.ant-tree-treenode');
      treenode.addEventListener('click', (e) => {
        const isIndent = e.target.closest('.ant-tree-indent');
        if (isIndent) {
          treeNodeTitle.click(e);
        }
      });
    }
  }
}
