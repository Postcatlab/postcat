import { toJS } from 'mobx';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import omitDeep from 'omit-deep-lodash';
import { ApiParamsType, ApiParamsTypeByNumber } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { Group, ApiData } from 'pc/browser/src/app/services/storage/db/models';

import { eoDeepCopy, whatType } from '../index.utils';

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
    if (val.childList?.length) {
      result += getTreeTotalCount(val.childList);
    }
  });
  return result;
};
const getValueByChian = (chain, object) => {
  return chain.reduce((o, i) => o?.[i], object);
};
/**
 * Table column key has quote child attribute,such as 'a.b.c'
 * Generate a new array with quote child attribute
 */
export const generateQuoteKeyValue = (chains, nzData, opts = { childKey: 'childList' }) => {
  let result = eoDeepCopy(nzData) || [];
  const loop = items => {
    items.forEach((item, index) => {
      chains.forEach(chain => {
        const value = getValueByChian(chain.arr, item);
        if (value) {
          item[chain.str] = value;
        }
      });
      if (item[opts.childKey]) {
        item[opts.childKey] = loop(item[opts.childKey]);
      }
    });
    return items;
  };
  result = loop(result);
  return result;
};
const filterTree = (
  result,
  filterFn,
  opts = {
    childKey: 'childList'
  }
) =>
  result.filter((item, index) => {
    const hasKeep = filterFn ? filterFn(item, index) : true;
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
  if (whatType(inData) !== 'array') return inData;
  //TODO add pickBy support
  //Set default Options
  opts.childKey = opts.childKey || 'childList';
  opts.omitBy = opts.omitBy || ['eoKey'];
  const result = inData.map(val => omitDeep(val, opts.omitBy));
  //Omit useless fieild
  // const result = JSON.parse(
  //   JSON.stringify(inData, (key, value) => {
  //     if (typeof key === 'string' && opts.omitBy.includes(key)) {
  //       return undefined;
  //     } else {
  //       return value;
  //     }
  //   })
  // );
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
export const flatData = data => {
  // * DFS
  const arr = [];
  data.forEach(item => {
    const loop = ({ childList = [], ...it }) => {
      arr.push(it);
      childList.forEach(x => loop(x));
    };
    loop(item);
  });
  return arr;
};

export const getExpandGroupByKey: (component: NzTreeComponent | NzTreeSelectComponent, key) => string[] = (component, key) => {
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
  const { key = 'name', valueKey = 'description', childKey = 'childList' } = opts;
  return list?.reduce?.((prev, curr) => {
    try {
      curr = typeof curr === 'string' ? JSON.parse(curr) : curr;
      const namePath = valueKey.split('.');
      const lastKey = namePath.pop();
      prev[curr[key]] = namePath.reduce((p, v) => p?.[v], curr)?.[lastKey] ?? fieldTypeMap.get(curr.dataType);
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

export const fieldTypeMap = new Map<number, any>([
  [ApiParamsType.boolean, false],
  [ApiParamsType.array, []],
  [ApiParamsType.object, {}],
  [ApiParamsType.number, 0],
  [ApiParamsType.null, null],
  [ApiParamsType.string, 'default_value']
]);

/**
 * Generate Group for tree view
 *
 * @param apiGroups
 * @param groupId
 * @returns
 */
export const genApiGroupTree = (apiGroups: Group[] = []) => {
  return [
    ...apiGroups.map(group => ({
      ...group,
      title: group.name || '',
      key: group.id,
      children: genApiGroupTree([...(group?.children || [])])
    }))
  ];
};
/**
 * Get group after shrink api data
 */
export const getPureGroup = groupList => {
  return [
    ...groupList.filter(group => {
      if (!group) return;
      const isApi = group._group?.type === 2;
      if (isApi) return false;
      Object.assign(group, {
        title: group.name || '',
        key: group.id,
        children: getPureGroup([...(group?.children || [])])
      });
      return true;
    })
  ];
};
export class PCTree {
  private list: Group[];
  private rootGroupID: number;
  constructor(list, opts?) {
    this.list = eoDeepCopy(list);
    this.rootGroupID = opts?.rootGroupID;
  }
  getList() {
    return this.list;
  }
  findGroupByID(id): Group {
    return this.loopFindGroupByID(this.list, id);
  }
  private loopFindGroupByID(list, id): Group {
    let result;
    list.find(group => {
      if (group.id === id) {
        return (result = group);
      }
      if (group.children) {
        return (result = this.loopFindGroupByID(group.children, id));
      }
    });
    return result;
  }
  add(group: Group) {
    const isRootDir = group.parentId === this.rootGroupID;
    if (isRootDir) {
      this.list.push(group);
      return;
    }

    const parent = this.findGroupByID(group.parentId);
    parent?.children.push(group);
  }
  update(group: Group) {
    const origin = this.findGroupByID(group.id);
    Object.assign(origin, group);
  }
  delete(group: Group) {
    const isRootDir = group.parentId === this.rootGroupID;
    const list = isRootDir ? this.list : this.findGroupByID(group.parentId).children;
    list.splice(
      list.findIndex(val => val.id === group.id),
      1
    );
  }
  sort() {}
}
export const hangGroupToApi = list => {
  return list.map(it => {
    if (it.type === 2) {
      return {
        ...it.relationInfo,
        id: it.relationInfo.apiUuid,
        isLeaf: true,
        parentId: it.parentId,
        _group: {
          id: it.id,
          type: it.type,
          parentId: it.parentId,
          sort: it.sort
        }
      };
    }
    return {
      ...it,
      children: hangGroupToApi(it.children || [])
    };
  });
};
