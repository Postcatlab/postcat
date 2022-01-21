import { GroupTreeItem } from '../shared/models';
/**
 * Convert old component listBlock array items has level without  parent id to  tree nodes
 * @param list Array<GroupTreeItem>
 */
export const listToTreeHasLevel = (
  list,
  opts: {
    childKey: string;
  } = {
    childKey: 'children',
  }
) => {
  const listDepths = [];
  //delete useless key
  const uselessKeys = ['listDepth', 'isHide'];
  list = list.map((item) => {
    listDepths.push(item.listDepth);
    return Object.keys(item).reduce(
      (pre, itemKey) => (uselessKeys.includes(itemKey) ? pre : { ...pre, [itemKey]: item[itemKey] }),
      {}
    );
  });

  const result = [];
  list.forEach((item, key) => {
    const listDepth = listDepths[key];
    if (listDepth === 0) {
      result.push(item);
    } else {
      const parent = list[listDepths.lastIndexOf(listDepth - 1, key)];
      if (!parent) {
        console.error(`can't find the parent`);
        return;
      }
      parent[opts.childKey] = parent[opts.childKey] || [];
      parent[opts.childKey].push(item);
    }
  });
  return result;
};
export const treeToListHasLevel = (tree, opts: { listDepth: number; mapItem?: (val) => object } = { listDepth: 0 }) => {
  let result = [];
  tree.forEach((val) => {
    val.listDepth = opts.listDepth;
    if (opts.mapItem) {
      val = opts.mapItem(val);
    }
    result.push(val);
    if (val.children && val.children.length) {
      result = result.concat(
        treeToListHasLevel(val.children, {
          listDepth: opts.listDepth + 1,
        })
      );
      delete val.children;
    }
  });
  return result;
};

/**
 * Convert array items which has parent id to tree nodes.
 * @param list Array<GroupTreeItem>
 * @param tree Array<GroupTreeItem>
 * @param parentID number|string
 */
export const listToTree = (list: Array<GroupTreeItem>, tree: Array<GroupTreeItem>, parentID: number | string): void => {
  list.forEach((data) => {
    if (data.parentID === parentID) {
      const child = {
        ...data,
        children: [],
      };
      if (!data.isLeaf) {
        listToTree(list, child.children, data.key);
      }
      if (child.children.length <= 0) {
        delete child.children;
      }
      tree.push(child);
    }
  });
};
export const flatData = (data) => {
  // * DFS
  const arr = [];
  data.forEach((item) => {
    const loop = ({ children = [], ...it }) => {
      arr.push(it);
      children.forEach((x) => loop(x));
    };
    loop(item);
  });
  return arr;
};

export const addKeyInTree = ({ children, ...data }, index = 0, key = '1') => {
  if (!children) {
    return {
      ...data,
      nodeKey: `${key}-${index}`,
    };
  }
  return {
    ...data,
    children: children.map((it, i) => addKeyInTree(it, i, `${key}-${index}`)),
    nodeKey: `${key}-${index}`,
  };
};
/**
 * Find tree node and give value to it
 * @param _data seach pool tree node
 * @param value value need to be set
 * @param param2 should be find tree node
 */
export const findDataInTree = (_data: any, value, { nodeId = 'nodeKey', id, key }): any => {
  const findData = ({ children, ...it }) => {
    if (it[nodeId] === id) {
      return {
        ...it,
        children,
        [key]: value,
      };
    }
    if (children?.length) {
      return {
        children: children.map((item) => findData(item)),
        ...it,
      };
    }
    return it;
  };
  return findData(_data);
};
