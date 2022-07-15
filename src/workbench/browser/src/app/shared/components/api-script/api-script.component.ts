import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EoEditorComponent } from 'eo/workbench/browser/src/app/eoui/editor/eo-editor/eo-editor.component';

import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import type { TreeNode, FlatNode } from './constant';

@Component({
  selector: 'eo-api-script',
  templateUrl: './api-script.component.html',
  styleUrls: ['./api-script.component.scss'],
})
export class ApiScriptComponent implements OnInit {
  @Input() code = '';
  @Input() treeData = [];
  @Input() completions = [];
  @Output() codeChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(EoEditorComponent, { static: false }) eoEditor?: EoEditorComponent;
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;

  selectListSelection = new SelectionModel<FlatNode>(true);

  dataSource: NzTreeNodeOptions[] = [];
  expandedKeys = [];

  constructor() {}

  nzClick($event) {
    const { node } = $event;
    if (node.isLeaf) {
      // * insert code
      return;
    }
    // *  expand node
    if (this.expandedKeys.includes(node.key)) {
      this.expandedKeys = this.expandedKeys.filter((it) => it !== node.key);
      node.isExpanded = false;
      return;
    }
    this.expandedKeys = [...this.expandedKeys, node.key];
  }
  ngOnInit(): void {
    this.dataSource = this.treeData.map(({ name, children, ...it }, index) => ({
      title: name,
      key: index,
      name,
      children: children.map(({ caption, ...child }) => ({
        title: child.name,
        key: caption,
        caption,
        ...child,
        isLeaf: true,
      })),
      ...it,
    }));
    console.log(this.dataSource);
  }

  handleChange(code) {
    this.codeChange.emit(code);
  }

  insertCode = (event) => {
    const { value } = event.origin;
    this.eoEditor.handleInsert(value);
  };

  getCode = () => this.code;
}
