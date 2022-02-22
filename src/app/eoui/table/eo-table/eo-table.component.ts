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
import { NzMessageService } from 'ng-zorro-antd/message';
import { addKeyInTree, findDataInTree, flatData } from '../../../utils/tree/tree.utils';
import { CellDirective } from './cell.directive';
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

interface TreeNodeInterface {
  [propName: string]: any;
  nodeKey: string;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

const eoFilterFn = (key) => (list: string[], item: any) => list.some((text) => item[key].indexOf(text) !== -1);

@Component({
  selector: 'eo-table',
  templateUrl: './eo-table.component.html',
  styleUrls: ['./eo-table.component.scss'],
})
export class EoTableComponent implements OnInit, OnChanges, AfterContentInit {
  @Input() data: any[] = [];
  @Input() columns: Column[];
  @Input() isShowPagination = false; // * 是否显示页脚
  @Input() isVirtualScroll = false; // * 是否开启虚拟滚动
  @Input() isExpand = false; // * show expand column or not
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  // * about share scope
  @ContentChildren(CellDirective) slotList: QueryList<CellDirective>;
  slotMap: { [key: string]: TemplateRef<any> } = {};

  listOfMapData: any[] = [];
  renderColumns: any[] = [];
  renderData: any[] = [];
  expandIndexList: number[] = [];
  /**
   * row data by node key
   */
  mapOfExpandedData: { [nodeKey: string]: TreeNodeInterface[] } = {};

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    this.renderColumns = this.columns.map(
      ({
        filterListFn = null,
        filterKey = null,
        filterFn = null,
        isCopy = false,
        isExpand = false,
        isEdit = false,
        key = '',
        ...it
      }) => ({
        listOfFilter: filterListFn
          ? Array.from(new Set(flatData(this.data || [])?.map((item) => item[filterKey]))).map(filterListFn)
          : undefined,
        filterFn: filterFn || eoFilterFn(filterKey),
        filterMultiple: true,
        isCopy,
        isExpand,
        key,
        isEdit,
        ...it,
      })
    );
  }
  ngOnChanges(changes): void {
    this.mapOfExpandedData = {};
    this.listOfMapData = this.data?.map((it, index) => addKeyInTree(it, index));
    this.listOfMapData?.forEach((item) => {
      this.mapOfExpandedData[item.nodeKey] = this.convertTreeToList(item);
    });
  }

  ngAfterContentInit() {
    this.slotList.forEach(({ cellName, templateRef }) => {
      this.slotMap[cellName] = templateRef;
    });
  }
  handleEditData(event, nodeKey, key) {
    this.data = this.listOfMapData.map((it) => findDataInTree(it, event.target.value, { id: nodeKey, key }));
    let elLocation = event.relatedTarget.getBoundingClientRect();
    this.dataChange.emit(this.data);
    /**
     * ! Angular Onpush will reRender table cause input blur
     * TODO use native dom to refator this component
     */
    setTimeout(() => {
      let dom = document.elementFromPoint(elLocation.x, elLocation.y);
      if (dom.tagName !== 'INPUT') {
        dom = dom.getElementsByClassName('ant-input')[0];
      }
      (dom as HTMLInputElement).focus();
    }, 0);
  }
  handleCopy(value) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
      this.message.success('复制成功');
      return;
    }
  }

  handleExpand(index: number | null = null) {
    if (index === null) {
      // * If every row data is expand then close all, other wise expand all.
      this.expandIndexList =
        this.expandIndexList.length === this.data.length
          ? []
          : Array(this.data.length)
              .fill(null)
              .map((_, i) => i);
      return;
    }
    // * Handle single row data expand or close by index-cache array
    this.expandIndexList = this.expandIndexList.includes(index)
      ? this.expandIndexList.filter((it) => it !== index)
      : this.expandIndexList.concat([index]);
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      data.children?.forEach((d) => {
        const target = array.find((a) => a.nodeKey === d.nodeKey)!;
        target.expand = false;
        this.collapse(array, target, false);
      });
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
        }
      }
    }
    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [nodeKey: string]: boolean }, array: TreeNodeInterface[]) {
    if (!hashMap[node.nodeKey]) {
      hashMap[node.nodeKey] = true;
      array.push(node);
    }
  }

  // pushData(data) {
  // this.data = [...this.data, data];
  // console.log('loo');
  // this.listOfMapData.push(data);
  // this.listOfMapData?.forEach((item) => {
  //   this.mapOfExpandedData[item.nodeKey] = this.convertTreeToList(item);
  // });
  // }
}
