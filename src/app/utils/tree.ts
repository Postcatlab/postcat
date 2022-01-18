import { whatType } from '.';
import { GroupTreeItem } from '../shared/models';
/**
 * Convert array items have level without  parent id to  tree nodes
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

export const parseTree = (key, value, level = 0) => {
  if (whatType(value) === 'object') {
    return {
      name: key,
      required: true,
      example: '',
      type: 'object',
      description: '',
      listDepth: level,
      children: Object.keys(value).map((it) => parseTree(it, value[it], level + 1)),
    };
  }
  if (whatType(value) === 'array') {
    const [data] = value;
    return {
      name: key,
      required: true,
      example: '',
      type: 'array',
      description: '',
      listDepth: level,
      children: data ? Object.keys(data).map((it) => parseTree(it, data[it], level + 1)) : [],
    };
  }
  return {
    name: key,
    value,
    description: '',
    type: whatType(value),
    required: true,
    example: value || '',
    listDepth: level,
  };
};

export const form2json = (tmpl) =>
  tmpl
    .split('\n')
    .filter((it) => it.trim())
    .map((it) => it.split(':'))
    .map((it) => {
      const [key, value] = it;
      return { key: key.trim(), value: value.trim() };
    });

export const xml2json = (tmpl) => {
  // * delete <?xml ... ?>
  let xml = tmpl.replace(/<\?xml.+\?>/g, '').trim();
  if (xml === '') {
    return [];
  }
  const startTag = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m;
  const endTag = /^<\/([^>\s]+)[^>]*>/m;
  const stack = [];
  const result = [];
  let start = null;
  let index = null;
  while (xml) {
    // * handle end tags
    if (xml.substring(0, 2) === '</') {
      const end = xml.match(endTag);
      const [str, label] = end;
      const last = stack.pop();
      if (last.tagName !== label) {
        throw new Error('Parse error 101');
      }
      if (stack.length === 0) {
        result.push(last);
      } else {
        const parent = stack.pop();
        parent.children.push(last);
        stack.push(parent);
      }
      xml = xml.substring(str.length);
      continue;
    }
    // * handle start tags
    if ((start = xml.match(startTag))) {
      const [str, label, attr] = start;
      stack.push({
        tagName: label.trim(),
        attr: attr.trim(),
        content: '',
        children: [],
      });
      xml = xml.trim().substring(str.length);
      continue;
    }
    // * handle text content
    if ((index = xml.indexOf('<') > 0)) {
      const content = xml.slice(0, index);
      const last = stack.pop();
      last.content += content;
      stack.push(last);
      xml = xml.substring(index);
      index = null;
    }
    xml = xml.trim();
  }
  if (stack.length) {
    throw new Error('Parse error 102');
  }
  return result;
};
