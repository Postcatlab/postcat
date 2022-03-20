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
      const { __index, __mid, __pid, __isExpand, __isHasChild, __isCheck, ...last } = list[$index];
      if (!_.isEqual(last, this.dataModel)) {
        list.splice($index + 1, 0, {
          ...this.dataModel,
          __mid: pid == null ? `${__index + 1}` : `${pid}-${__index + 1}`,
          __pid: pid,
          __index: __index + 1,
          __isExpand: true,
          __isHasChild: false,
          __isCheck: true,
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

  checkAll(bool: boolean) {
    const list = JSON.parse(JSON.stringify(this.realData));
    this.realData = list.map((it) => ({ ...it, __isCheck: bool }));
    return this.getData();
  }

  checkNode(mid, isCheck, isCheckChild = true) {
    if (isCheck) {
      this.realData = this.realData.map((it) => {
        if (mid === it.__mid) {
          // * the node and its children
          return { ...it, __isCheck: isCheck };
        }
        if (isCheckChild && it.__mid.indexOf(`${mid}-`) === 0) {
          return { ...it, __isCheck: isCheck };
        }
        return it;
      });
    } else {
      this.realData = this.realData.map((it) => {
        if (mid === it.__mid || it.__mid.indexOf(`${mid}-`) === 0) {
          // * the node and its children
          return { ...it, __isCheck: isCheck };
        }
        return it;
      });
    }
    return this.getData();
  }

  addChildNode(mid, { afterCallback }) {
    const list = this.realData.map((it, i) => ({ ...it, __i: i }));
    const chilList = list.filter((it) => it.__pid === mid);

    if (chilList.length) {
      const [last] = chilList
        .filter((it) => it.__pid === mid)
        .sort((a, b) => a.__index - b.__index)
        .slice(-1);
      list.splice(last.__i + 1, 0, {
        ...this.dataModel,
        // for debug
        // name: `${mid}-${last.__index + 1}`,
        __mid: `${mid}-${last.__index + 1}`,
        __pid: mid,
        __index: last.__index + 1,
        __isExpand: last.__isExpand,
        __isHasChild: false,
        __isCheck: true,
      });
    } else {
      const [last] = list.filter((it) => it.__mid === mid);
      list.splice(last.__i + 1, 0, {
        ...this.dataModel,
        // for debug
        // name: `${mid}-0`,
        __mid: `${mid}-0`,
        __pid: mid,
        __index: 0,
        __isExpand: true,
        __isHasChild: false,
        __isCheck: true,
      });
    }

    this.realData = list.map(({ __i, ...it }) => {
      if (it.__mid === mid) {
        return {
          ...(afterCallback ? afterCallback(it) : it),
          __isHasChild: true,
        };
      }
      return it;
    });
    return this.getData();
  }

  deleteNode(mid, pid, index) {
    this.realData = this.realData
      .filter((it) => it.__mid !== mid && it.__mid.indexOf(`${mid}-`) !== 0)
      .map((it) => {
        if (it.__pid === pid) {
          return {
            ...it,
            __index: it.__index < index ? it.__index : it.__index - 1,
          };
        }
        return it;
      });
    return this.getData();
  }

  static tree2list(data) {
    // * DFS
    const arr = [];
    data.forEach((item, i) => {
      const loop = ({ children = null, __mid = '0', ...it }) => {
        arr.push({ ...it, __mid, __isHasChild: !!children, __isExpand: true });
        children?.forEach((x, $i) => loop({ ...x, __index: $i, __mid: `${__mid}-${$i}`, __pid: __mid }));
      };
      loop({ ...item, __mid: `${i}`, __pid: null, __index: i });
    });
    return arr;
  }

  static list2tree(data, dataModel) {
    // * clear all empty or not checked data
    const list = data
      .filter(({ __isCheck }) => __isCheck)
      .filter(({ __index, __mid, __pid, __isHasChild, __isExpand, __isCheck, ...it }) => !_.isEqual(it, dataModel));
    const filterArray = (data, pid) => {
      const tree = [];
      let temp;
      for (let i = 0; i < data.length; i++) {
        if (data[i].__pid === pid) {
          const obj = data[i];
          temp = filterArray(data, data[i].__mid);
          if (temp.length > 0) {
            obj.children = temp.map(({ __index, __mid, __pid, __isHasChild, __isExpand, __isCheck, ...it }) => it);
          }
          const { __index, __mid, __pid, __isHasChild, __isExpand, __isCheck, ...node } = obj;
          tree.push(node);
        }
      }
      return tree;
    };
    return filterArray(list, null);
  }
}

export default Leaf;
