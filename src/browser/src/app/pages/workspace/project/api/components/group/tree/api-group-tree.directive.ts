import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[apiGroupTree]'
})
export class ApiGroupTreeDirective implements OnChanges {
  @Input() node?: any;

  treeNodeTitle: HTMLDivElement;
  constructor(private readonly el: ElementRef) {}

  ngOnChanges(): void {
    this.treeNodeTitle = this.el.nativeElement.closest('nz-tree-node-title');
    if (this.treeNodeTitle) {
      this.treeNodeTitle.style.display = 'block';
      this.treeNodeTitle.style.width = `calc(100% - 24px * ${this.node.level + 1})`;
      // const treenode = this.treeNodeTitle.closest('.ant-tree-treenode');
      // treenode.removeEventListener('click', this.clickTitle);
      // treenode.addEventListener('click', this.clickTitle);
    }
  }

  // clickTitle = (e) => {
  //   const isIndent = e.target.closest('.ant-tree-indent');
  //   if (isIndent) {
  //     this.treeNodeTitle.click();
  //   }
  // };
}
