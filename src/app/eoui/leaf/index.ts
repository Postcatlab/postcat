class Leaf {
  realData: any[] = [];
  constructor(treeData = []) {
    this.realData = Leaf.tree2list(treeData);
  }

  getData() {
    // return render data
    const list = JSON.parse(JSON.stringify(this.realData));
    // filter by __isExpand
    const shrinkPid = list.filter((it) => it.__isExpand === false).map((it) => it.__mid);
    return list.filter((it) => {
      // * It must be filter same like 1-1-1 & 1-11-1
      const shrinkChild = shrinkPid.filter((item) => it.__mid.indexOf(`${item}-`) === 0);
      // * If shrinkChild.length > 0 , it means children of some shrinked data
      return shrinkChild.length > 0 ? false : true;
    });
  }

  setData(id: string[], data: object) {
    console.log('kko', data);
    this.realData = this.realData.map((it) => (id.includes(it.__mid) ? { ...it, ...data } : it));
    return this.getData();
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

  static list2tree(list) {}
}

export default Leaf;
