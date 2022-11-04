import { languages } from 'monaco-editor/esm/vs/editor/editor.api';

// https://docs.eoapi.io/docs/script-function.html
// 自动根据页面中片段生成数组
// $('.language-').querySelector('code').innerText.split(';').map(n => {
//   const [_, comment = '', label, call] = n.match(/\/\/(.*)\n(.*)(\(.*)/) || []
//   return {
//     label,
//     insertText: `${label}${call};`,
//     detail: comment,
//     kind: 'languages.CompletionItemKind.Function',
//   }
// }).filter(n => n.label)

export const defaultCompletions: Omit<languages.CompletionItem, 'range'>[] = [
  {
    label: 'eo.info(data)',
    insertText: 'eo.info(data);',
    detail: '输出信息',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.stop(data)',
    insertText: 'eo.stop(data);',
    detail: '中止测试并输出信息',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.error(data)',
    insertText: 'eo.error(data);',
    detail: '断言失败并输出信息',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.jsonpath("jsonpath语句",data)',
    insertText: 'eo.jsonpath("jsonpath语句",data);',
    detail: '使用JsonPath语句提取内容',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.xpath("xpath语句",data)',
    insertText: 'eo.xpath("xpath语句",data);',
    detail: '使用XPath语句提取内容',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.file(file Type)',
    insertText: 'eo.file(file Type);',
    detail: '插入一个内置的文件',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.img(file Type)',
    insertText: 'eo.img(file Type);',
    detail: '插入一个内置的图片文件',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.url.get()',
    insertText: 'eo.http.url.get();',
    detail: '获取原始的http协议url，不包含环境的base url，比如/user/login/{user_type}?user_name={{name}}',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.url.parse()',
    insertText: 'eo.http.url.parse();',
    detail:
      '获取经过解析处理后的http协议url，包含环境的base url，比如www.eolinker.com/user/login/admin?user_name=jackliu',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.url.set("new_url")',
    insertText: 'eo.http.url.set("new_url");',
    detail: '设置http协议url，比如/user/login/admin?user_name={{name}}',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.header.get("param_key")',
    insertText: 'eo.http.header.get("param_key");',
    detail: '获取http协议请求头部参数值',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.header.set("param_key","param_value")',
    insertText: 'eo.http.header.set("param_key","param_value");',
    detail: '设置http协议请求头部参数值',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.header.unset("param_key")',
    insertText: 'eo.http.header.unset("param_key");',
    detail: '删除http协议header参数',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.header.clear',
    insertText: 'eo.http.header.clear;',
    detail: '清空http协议header参数',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.query.get("param_key")',
    insertText: 'eo.http.query.get("param_key");',
    detail: '获取http协议query参数',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.query.set("param_key","param_value")',
    insertText: 'eo.http.query.set("param_key","param_value");',
    detail: '设置http协议query参数',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.query.unset("param_key")',
    insertText: 'eo.http.query.unset("param_key");',
    detail: '删除http协议query参数（删除后不会出现在地址栏中）',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.query.clear',
    insertText: 'eo.http.query.clear;',
    detail: '清空http协议query参数',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.rest.get("param_key")',
    insertText: 'eo.http.rest.get("param_key");',
    detail: '获取http协议rest参数',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.rest.set("param_key","param_value")',
    insertText: 'eo.http.rest.set("param_key","param_value");',
    detail: '设置http协议rest参数',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.rest.unset("param_key")',
    insertText: 'eo.http.rest.unset("param_key");',
    detail: '删除http协议rest参数',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.rest.clear',
    insertText: 'eo.http.rest.clear;',
    detail: '清空http协议rest参数',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.response.get()',
    insertText: 'eo.http.response.get();',
    detail: '获取http协议返回结果',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'eo.http.response.set("response_value")',
    insertText: 'eo.http.response.set("response_value");',
    detail: '设置http协议返回结果',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'responseHeaders',
    insertText: 'responseHeaders;',
    detail: '获取返回头部内容',
    kind: languages.CompletionItemKind.Function,
  },
  {
    label: 'responseHeaders["param_key"]',
    insertText: 'responseHeaders["param_key"];',
    detail: '获取返回头部中的某个参数',
    kind: languages.CompletionItemKind.Function,
  },
];
