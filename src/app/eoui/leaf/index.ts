import * as _ from 'lodash';

class Leaf {
  realData: any[] = [];
  dataModel: {} = {};
  constructor(treeData = [], dataModel = {}) {
    this.dataModel = dataModel;
    this.realData = this.addEmptyData(Leaf.tree2list(treeData.length ? treeData : [dataModel]));
  }

  addEmptyData(data: any[]): any[] {
    const list = JSON.parse(JSON.stringify(data));
    const pidList = Array.from(new Set(list.map((it) => it.__pid)));
    pidList.forEach((pid) => {
      const $index = _.findLastIndex(list, { __pid: pid });
      const { __index, __mid, __pid, __isExpand, __hasChild, ...last } = list[$index];
      if (!_.isEqual(last, this.dataModel)) {
        list.splice($index + 1, 0, {
          ...this.dataModel,
          __mid: pid == null ? `${__index + 1}` : `${pid}-${__index + 1}`,
          __pid: pid,
          __index: __index + 1,
          __isExpand: true,
          __hasChild: false,
        });
      }
    });
    return list;
  }

  getData() {
    // * return render data
    const list = JSON.parse(JSON.stringify(this.realData));
    // * filter by __isExpand
    const shrinkPid = list.filter((it) => it.__isExpand === false).map((it) => it.__mid);
    return list.filter((it) => {
      // * It must be filter same like 1-1-1 & 1-11-1
      const shrinkChild = shrinkPid.filter((item) => it.__mid.indexOf(`${item}-`) === 0);
      // * If shrinkChild.length > 0 , it means children of some shrinked data
      return shrinkChild.length > 0 ? false : true;
    });
  }

  setData(id: string[], data: object) {
    const list = this.realData.map((it) => (id.includes(it.__mid) ? { ...it, ...data } : it));
    this.realData = this.addEmptyData(list);
    return this.getData();
  }

  updateData(list, { id, data }) {
    this.setData([id], data);
    let $i = null,
      $pid = null,
      $index = null;
    list.forEach((it, i) => {
      if (it.__mid === id) {
        $i = i;
        $pid = it.__pid;
        $index = it.__index + 1;
        Object.keys(data).forEach((item) => {
          it[item] = data[item];
        });
      }
    });
    const { __pid } = list[$i + 1] || { __pid: undefined };
    if (__pid !== undefined && __pid === $pid) {
      // * If node has little borther, then it no need to handle whatever it is empty or not.
      return;
    }
    // * add empty line
    list.splice($i + 1, 0, {
      ...this.dataModel,
      __mid: $pid == null ? `${$index}` : `${$pid}-${$index}`,
      __pid: $pid,
      __index: $index,
      __isExpand: true,
      __isHasChild: false,
    });
  }

  expandData(mids: string[], isExpand: boolean) {
    this.realData = this.realData.map((it) => {
      if (!mids.includes(it.__mid)) {
        return it;
      }
      return {
        ...it,
        __isExpand: isExpand,
      };
    });
    return this.getData();
  }

  getTreeData() {
    return Leaf.list2tree(this.realData, this.dataModel);
  }

  static tree2list(data) {
    // * DFS
    const arr = [];
    data.forEach((item, i) => {
      const loop = ({ children = null, __mid = '0', ...it }) => {
        arr.push({ ...it, __mid, __hasChild: !!children, __isExpand: true });
        children?.forEach((x, $i) => loop({ ...x, __index: $i, __mid: `${__mid}-${$i}`, __pid: __mid }));
      };
      loop({ ...item, __mid: `${i}`, __pid: null, __index: i });
    });
    return arr;
  }

  static list2tree(data, dataModel) {
    // * clear all empty data
    const list = data.filter(({ __index, __mid, __pid, __hasChild, __isExpand, ...it }) => !_.isEqual(it, dataModel));
    const filterArray = (data, pid) => {
      const tree = [];
      let temp;
      for (let i = 0; i < data.length; i++) {
        if (data[i].__pid === pid) {
          const obj = data[i];
          temp = filterArray(data, data[i].__mid);
          if (temp.length > 0) {
            obj.children = temp.map(({ __index, __mid, __pid, __hasChild, __isExpand, ...it }) => it);
          }
          const { __index, __mid, __pid, __hasChild, __isExpand, ...node } = obj;
          tree.push(node);
        }
      }
      return tree;
    };
    return filterArray(list, null);
  }
}

export default Leaf;
