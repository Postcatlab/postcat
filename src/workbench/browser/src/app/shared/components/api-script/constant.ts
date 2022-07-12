export type Note = {
  code?: string;
  desc?: string;
  input?: { key: string; value: string }[];
  output?: string;
};

export interface TreeNode {
  name: string;
  caption?: string;
  note?: Note;
  value?: string;
  children?: TreeNode[];
}

export interface FlatNode extends TreeNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}

export type Completion = { caption: string; value: string };

export const TREE_DATA: TreeNode[] = [
  {
    name: 'HTTP API 请求',
    children: [
      {
        name: '获取响应结果',
        caption: 'eo.http.response.get',
        value: 'eo.http.response.get();',
        note: {
          code: 'eo.http.response.get()',
          desc: '获取 HTTP API 的响应结果',
        },
      },
      {
        name: '设置响应结果',
        caption: 'eo.http.response.set',
        value: 'eo.http.response.set("response_value");',
        note: {
          code: 'eo.http.response.set("response_value")',
          desc: '设置 HTTP API 的响应结果',
          input: [{ key: 'response_value：', value: '响应结果' }],
        },
      },
    ],
  },
  {
    name: '自定义全局变量',
    children: [
      {
        name: '设置全局变量',
        caption: 'eo.globals.set',
        value: 'eo.globals.set("param_key","param_value")',
        note: {
          code: 'eo.globals.set("param_key","param_value")',
          desc: '设置全局变量',
          input: [
            { key: 'param_key', value: '参数名' },
            { key: 'param_value', value: '参数值' },
          ],
        },
      },
      {
        name: '获取全局变量值',
        caption: 'eo.globals.get',
        value: 'eo.globals.get("param_key")',
        note: {
          code: 'eo.globals.set("param_key","param_value")',
          desc: '设置全局变量',
          input: [
            { key: 'param_key', value: '参数名' },
            { key: 'param_value', value: '参数值' },
          ],
          output: '全局变量值',
        },
      },
      {
        name: '删除全局变量',
        caption: 'eo.globals.unset',
        value: 'eo.globals.unset("param_key")',
        note: {
          code: 'eo.globals.unset("param_key")',
          desc: '删除全局变量',
          input: [{ key: 'param_key', value: '参数名' }],
        },
      },
      {
        name: '清空所有全局变量',
        caption: 'eo.globals.clear',
        value: 'eo.globals.clear()',
        note: {
          code: 'eo.globals.clear()',
          desc: '清空所有全局变量',
        },
      },
    ],
  },
];

export const completions: Completion[] = TREE_DATA.flatMap((n) => n.children).reduce((prev, curr) => {
  const { caption, value } = curr;
  if (caption) {
    prev.push({ caption, value });
  }
  return prev;
}, []);
