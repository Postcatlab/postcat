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
  filterMultiple?: boolean;
  isCopy?: boolean;
  filterKey?: string;
  filterListFn?: () => any[];
  width?: string;
  isExpand?: boolean;
  isEdit?: boolean;
};

@Component({
  selector: 'eo-table',
  templateUrl: './eo-table.component.html',
  styleUrls: ['./eo-table.component.scss'],
})
export class EoTableComponent implements OnInit, AfterContentInit {
  @Input() columns: Column[] = [];
  @Input() dataModel: any = {};
  @Input() rules: [] = [];
  @Output() modelChange = new EventEmitter<any>();
  @ViewChild('colTable') colTableRef: ElementRef;

  // * about share scope
  @ContentChildren(CellDirective) slotList: QueryList<CellDirective>;
  slotMap: { [key: string]: TemplateRef<any> } = {};

  isColTableActive = false;
  private leaf = null; // 引擎的实例引用
  private modelData: any[];

  constructor() {}

  @Input() set model(value) {
    // this.modelData = value.flat(Infinity);
    const mock = [
      { required: true, name: 'FFF-0', type: 'object', value: 'fff-0' },
      {
        required: true,
        name: 'FFF-1',
        type: 'object',
        value: 'fff-1',
        children: [
          { required: true, name: 'FFF-1-0', type: 'object', value: 'fff-1-0' },
          {
            required: true,
            name: 'FFF-1-1',
            type: 'object',
            value: 'fff-1-1',
            children: [{ required: true, name: 'FFF-1-1-0', type: 'object', value: 'fff-1-1-0' }],
          },
          { required: true, name: 'FFF-1-2', type: 'object', value: 'fff-1-2' },
        ],
      },
      { required: true, name: 'FFF-2', type: 'object', value: 'fff-2' },
    ];
    this.leaf = new Leaf(mock);
    this.modelData = this.leaf.getData();
    console.log(JSON.stringify(this.modelData, null, 2));
    const emptyList = this.modelData.filter(isEmptyValue);
    if (emptyList.length === 0) {
      // * If has no empty line, then add a new line.
      this.modelData = this.modelData.concat([JSON.parse(JSON.stringify(this.dataModel))]);
    }
  }

  ngOnInit(): void {}
  ngAfterContentInit() {
    this.slotList.forEach(({ cellName, templateRef }) => {
      this.slotMap[cellName] = templateRef;
    });
  }

  handleChange(event, key, id) {
    console.log('lllll');
    this.leaf.setData([id], { [key]: event.target.value });
    // this.modelChange.emit(this.modelData);
    // const emptyList = this.modelData.filter(isEmptyValue);
    // if (emptyList.length === 0) {
    //   // * If has no empty line, then add a new line.
    //   this.modelData = this.modelData.concat([JSON.parse(JSON.stringify(this.dataModel))]);
    // }
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

  handleColMenu(index) {
    if (index == null) {
    }
  }

  stopEvent($event) {
    $event.stopPropagation();
  }
}
