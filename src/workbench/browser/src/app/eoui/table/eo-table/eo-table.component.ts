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
} from '@angular/core';
import { CellDirective } from './cell.directive';
import { isEmptyValue } from '../../../utils/index';

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
  @Input() dataModel: {} = {};
  @Input() rules: [] = [];
  @Output() modelChange = new EventEmitter<any>();

  // * about share scope
  @ContentChildren(CellDirective) slotList: QueryList<CellDirective>;
  slotMap: { [key: string]: TemplateRef<any> } = {};

  modelData: any[];
  get model(): any[] {
    return this.modelData;
  }
  @Input() set model(value) {
    this.modelData = (value ?? []).flat(Infinity);
    const emptyList = this.modelData.filter(isEmptyValue);
    if (emptyList.length === 0) {
      // * If has no empty line, then add a new line.
      this.modelData = this.modelData.concat([JSON.parse(JSON.stringify(this.dataModel))]);
    }
  }
  constructor() {}

  ngOnInit(): void {
    // console.log('->', this.columns);
  }
  ngAfterContentInit() {
    this.slotList.forEach(({ cellName, templateRef }) => {
      this.slotMap[cellName] = templateRef;
    });
  }

  handleChange(value) {
    this.modelChange.emit(this.modelData);
    const emptyList = this.modelData.filter(isEmptyValue);
    if (emptyList.length === 0) {
      // * If has no empty line, then add a new line.
      this.modelData = this.modelData.concat([JSON.parse(JSON.stringify(this.dataModel))]);
    }
  }
}
