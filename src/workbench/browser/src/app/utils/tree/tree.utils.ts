import omitDeep from 'omit-deep-lodash';

import { GroupTreeItem } from '../../shared/models';
import { whatType } from '../index.utils';
export type TreeToObjOpts = {
  key?: string;
  valueKey?: string;
  childKey?: string;
};
export const getTreeTotalCount = (trees): number => {
  if (whatType(trees) !== 'array') return 0;
  let result = 0;
  result += trees.length;
  trees.forEach(val => {
    if (val.children?.length) {
      result += getTreeTotalCount(val.children);
    }
  });
  return result;
};

const filterTree = (
  result,
  filterFn,
  opts = {
    childKey: 'children'
  }
) =>
  result.filter(item => {
    const hasKeep = filterFn ? filterFn(item) : true;
    if (!hasKeep) {
      return false;
    }
    if (item[opts.childKey]) {
      item[opts.childKey] = filterTree(item[opts.childKey], filterFn, opts);
    }
    return true;
  });
export const filterTableData = (
  inData: any[],
  opts: {
    childKey?: string;
    primaryKey?: string;
    pickBy?: string[];
    omitBy?: string[];
    filterFn?: (item: any) => boolean;
  } = {}
) => {
  //TODO add pickBy support
  //Set default Options
  opts.childKey = opts.childKey || 'children';
  opts.omitBy = opts.omitBy || ['eoKey'];
  //Omit useless fieild
  const result = inData.map(val => omitDeep(val, opts.omitBy));
  if (!opts.filterFn) {
    if (!opts.primaryKey) {
      pcConsole.error('filterTableData need primaryKey');
    } else {
      opts.filterFn = item => item[opts.primaryKey];
    }
  }
  return filterTree(result, opts.filterFn, {
    childKey: opts.childKey
  });
};

/**
 * Convert array items which has parent id to tree nodes.
 *
 * @param list Array<GroupTreeItem>
 * @param tree Array<GroupTreeItem>
 * @param parentID number|string
 */
export const listToTree = (list: GroupTreeItem[], tree: GroupTreeItem[], parentID: number | string): void => {
  list.forEach(data => {
    if (data.parentID === parentID) {
      const child = {
        ...data,
        children: []
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
export const flatData = data => {
  // * DFS
  const arr = [];
  data.forEach(item => {
    const loop = ({ children = [], ...it }) => {
      arr.push(it);
      children.forEach(x => loop(x));
    };
    loop(item);
  });
  return arr;
};

export const getExpandGroupByKey: (component, key) => string[] = (component, key) => {
  if (!component) {
    return [];
  }
  let treeNode = component.getTreeNodeByKey(key);
  if (!treeNode) {
    return;
  }
  const expandKeys = [];
  while (treeNode.parentNode) {
    expandKeys.push(treeNode.parentNode.key);
    treeNode = treeNode.parentNode;
  }
  return expandKeys;
};

/**
 * 将树形数据转成 key => value 对象
 *
 * @param list
 * @param opts
 * @returns
 */
export const tree2obj = (list: any[] = [], opts: TreeToObjOpts = {}, initObj = {}) => {
  const { key = 'name', valueKey = 'description', childKey = 'children' } = opts;
  return list?.reduce?.((prev, curr) => {
    try {
      curr = typeof curr === 'string' ? JSON.parse(curr) : curr;
      prev[curr[key]] = curr[valueKey] || fieldTypeMap.get(curr.type);
      if (Array.isArray(curr[childKey]) && curr[childKey].length > 0) {
        tree2obj(curr[childKey], opts, (prev[curr[key]] = {}));
      } else if (curr?.example) {
        prev[curr[key]] = curr?.example;
      }
    } catch (error) {
      console.log('error==>', `prev: ${prev} == curr: ${curr} == key: ${key}`);
    }
    return prev;
  }, initObj);
};

export const fieldTypeMap = new Map<string, any>([
  ['boolean', false],
  ['array', []],
  ['object', {}],
  ['number', 0],
  ['null', null],
  ['string', 'default_value']
]);
