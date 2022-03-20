import {
  Component,
  OnChanges,
  AfterContentInit,
  Input,
  QueryList,
  ContentChildren,
  TemplateRef,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CellDirective } from './cell.directive';
import { isEmptyValue } from '../../utils/index';
import Leaf from '../leaf';

type Column = {
  title: string;
  key?: string;
  slot?: string;
  filterFn?: any;
  isHidden?: false;
  filterMultiple?: boolean;
  isCopy?: boolean;
  filterKey?: string;
  filterListFn?: () => any[];
  width?: string;
  isExpand?: boolean;
  isEdit?: boolean;
};

const mock = [
  { required: true, name: 'FFF-0', type: 'string', value: 'fff-0' },
  {
    required: true,
    name: 'FFF-1',
    type: 'object',
    value: 'fff-1',
    children: [
      { required: true, name: 'FFF-1-0', type: 'string', value: 'fff-1-0' },
      {
        required: true,
        name: 'FFF-1-1',
        type: 'object',
        value: 'fff-1-1',
        children: [{ required: true, name: 'FFF-1-1-0', type: 'string', value: 'fff-1-1-0' }],
      },
      { required: true, name: 'FFF-1-2', type: 'string', value: 'fff-1-2' },
    ],
  },
  { required: true, name: 'FFF-2', type: 'string', value: 'fff-2' },
];

@Component({
  selector: 'eo-table',
  templateUrl: './eo-table.component.html',
  styleUrls: ['./eo-table.component.scss'],
})
export class EoTableComponent implements OnInit, AfterContentInit {
  @Input() dataModel: any = {};
  @Input() rules: [] = [];
  @Input() isCheckChild = true;
  @Input() addChildCallback: () => {} = null;
  @Output() modelChange = new EventEmitter<any>();
  @ViewChild('colTable') colTableRef: ElementRef;

  // * about share scope
  @ContentChildren(CellDirective) slotList: QueryList<CellDirective>;
  slotMap: { [key: string]: TemplateRef<any> } = {};

  isColTableActive = false;
  private leaf = null; // 引擎的实例引用
  private isUpdate = false;
  private isSelectAll = true;
  private isSelectColAll = false;
  private modelData: any[];
  private columnData: any[];

  constructor() {}

  @Input() set model(value) {
    if (this.isUpdate) {
      this.isUpdate = false;
      return;
    }
    this.isSelectAll = true;
    this.leaf = new Leaf(mock, this.dataModel);
    // this.modelData = this.leaf.getData();
    this.modelData = this.leaf.checkAll(this.isSelectAll);
    const tree = this.leaf.getTreeData();
    this.isUpdate = true;
    this.modelChange.emit(tree);
  }

  @Input() set columns(value) {
    this.columnData = value.map(({ isHidden, ...it }) => ({ ...it, isHidden: isHidden || false }));
    const len = this.columnData.filter(({ isHidden }) => !isHidden).length;
    this.isSelectColAll = len === this.columnData.length;
  }

  ngOnInit(): void {}
  ngAfterContentInit() {
    this.slotList.forEach(({ cellName, templateRef }) => {
      this.slotMap[cellName] = templateRef;
    });
  }

  handleChange(event, key, id) {
    this.leaf.updateData(this.modelData, { id, data: { [key]: event.target.value } });

    const tree = this.leaf.getTreeData();
    this.isUpdate = true;
    this.modelChange.emit(tree);
  }

  handleExpand(mid, isExpand) {
    this.modelData = this.leaf.expandData([mid], isExpand);
  }

  switchColTable(bool) {
    this.isColTableActive = bool;
    if (bool) {
      setTimeout(() => {
        console.log(this.colTableRef.nativeElement);
        this.colTableRef.nativeElement.focus();
      }, 0);
    }
  }

  handleColMenu(event, index) {
    if (index == null) {
      this.isSelectColAll = !this.isSelectColAll;
      this.columnData = this.columnData.map(({ isHidden, ...it }) => ({ ...it, isHidden: !this.isSelectColAll }));
      return;
    }
    const isHidden = !event.target.checked;
    this.columnData = this.columnData.map((it, i) => {
      if (index === i) {
        return { ...it, isHidden };
      }
      return it;
    });
  }

  handleCheckboxs(event, node = null) {
    // * select checkbox
    if (node == null) {
      this.modelData = this.leaf.checkAll(this.isSelectAll);
      return;
    }
    this.modelData = this.leaf.checkNode(node.__mid, event.target.checked, this.isCheckChild);
    const tree = this.leaf.getTreeData();
    this.isUpdate = true;
    this.modelChange.emit(tree);
  }

  handleSelect(event, key, mid) {
    this.modelData = this.leaf.setData([mid], { [key]: event });
    const tree = this.leaf.getTreeData();
    this.isUpdate = true;
    this.modelChange.emit(tree);
  }

  addChild(node) {
    const { __mid } = node;
    this.modelData = this.leaf.addChildNode(__mid, { afterCallback: this.addChildCallback });
    const tree = this.leaf.getTreeData();
    this.isUpdate = true;
    this.modelChange.emit(tree);
  }

  deleteNode(node) {
    const { __mid, __pid, __index } = node;
    this.modelData = this.leaf.deleteNode(__mid, __pid, __index);
    const tree = this.leaf.getTreeData();
    this.isUpdate = true;
    this.modelChange.emit(tree);
  }
}
