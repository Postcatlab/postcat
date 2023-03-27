import { flatten, map, union } from 'lodash';
import { toJS } from 'mobx';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import omitDeep from 'omit-deep-lodash';
import { ApiParamsType } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { GroupModuleType, GroupType } from 'pc/browser/src/app/services/storage/db/dto/group.dto';
import { Group } from 'pc/browser/src/app/services/storage/db/models';

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
export const flatTree = trees => {
  // * DFS
  const arr = [];
  trees.forEach(item => {
    const loop = ({ children = [], ...it }) => {
      arr.push(it);
      children?.forEach(x => loop(x));
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
 * Parse group data from database to view tree
 *
 * @param list P
 * @returns
 */
export const parseGroupDataToViewTree = list => {
  return list.map(it => {
    const isAPI = it.type === GroupType.virtual && it.module === GroupModuleType.api;
    if (isAPI) {
      const apiItem = it.relationInfo || it;
      return {
        ...apiItem,
        id: apiItem.apiUuid,
        isLeaf: true,
        parentId: it.parentId,
        type: it.type,
        module: it.module,
        _group: {
          id: it.id,
          parentId: it.parentId,
          sort: it.sort
        }
      };
    }
    return {
      ...it,
      children: parseGroupDataToViewTree(it.children || [])
    };
  });
};
/**
 * Generate Group for tree view
 *
 * @param apiGroups
 * @param groupId
 * @returns
 */
export const genComponentTree = (groups: Group[] = []) => {
  groups = parseGroupDataToViewTree(groups);
  return [
    ...groups.map(group => ({
      ...group,
      title: group.name || '',
      key: group.id,
      children: genComponentTree([...(group?.children || [])])
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
      const isGroup = group?.type !== GroupType.virtual;
      if (!isGroup) return false;
      Object.assign(group, {
        title: group.name || '',
        key: group.id,
        children: getPureGroup([...(group?.children || [])])
      });
      return true;
    })
  ];
};

const loopFindTreeID = (list, id): Group => {
  let result;
  list.find(group => {
    if (group.id === id) {
      return (result = group);
    }
    if (group.children) {
      return (result = loopFindTreeID(group.children, id));
    }
  });
  return result;
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
  findTreeNodeByID(id): Group {
    return loopFindTreeID(this.list, id);
  }

  add(group: Group) {
    const isRootDir = group.parentId === this.rootGroupID;
    if (isRootDir) {
      this.list.push(group);
      return;
    }

    const parent = this.findTreeNodeByID(group.parentId);
    parent?.children.push(group);
  }
  update(group: Group) {
    const origin = this.findTreeNodeByID(group.id);
    Object.assign(origin, group);
  }
  delete(group: Group) {
    const isRootDir = group.parentId === this.rootGroupID;
    const list = isRootDir ? this.list : this.findTreeNodeByID(group.parentId).children;
    list.splice(
      list.findIndex(val => val.id === group.id),
      1
    );
  }
  sort() {}
}

export const getSubGroupIds = (groups: Group[] = [], defaultIds = []) => {
  return groups.reduce((prev, curr) => {
    if (curr.children?.length) {
      getSubGroupIds(curr.children, prev);
    }
    prev.push(curr.id);
    return prev;
  }, defaultIds);
};
