import type { languages } from 'monaco-editor';

// https://docs.postcat.com/docs/script-function.html
// 自动根据页面中片段生成数组
// $('.language-').querySelector('code').innerText.split(';').map(n => {
//   const [_, comment = '', label, call] = n.match(/\/\/(.*)\n(.*)(\(.*)/) || []
//   return {
//     label,
//     insertText: `${label}${call};`,
//     detail: comment,
//   }
// }).filter(n => n.label)

export const completions: Array<Omit<languages.CompletionItem, 'range' | 'kind'>> = [
  // {
  //   label: 'pc.info(data)',
  //   insertText: 'pc.info(data);',
  //   detail: '输出信息'
  // },
  // {
  //   label: 'pc.stop(data)',
  //   insertText: 'pc.stop(data);',
  //   detail: '中止测试并输出信息',
  // },
  // {
  //   label: 'pc.error(data)',
  //   insertText: 'pc.error(data);',
  //   detail: '断言失败并输出信息',
  // },
  // {
  //   label: 'pc.jsonpath("jsonpath语句",data)',
  //   insertText: 'pc.jsonpath("jsonpath语句",data);',
  //   detail: '使用JsonPath语句提取内容',
  // },
  // {
  //   label: 'pc.xpath("xpath语句",data)',
  //   insertText: 'pc.xpath("xpath语句",data);',
  //   detail: '使用XPath语句提取内容',
  // },
  // {
  //   label: 'pc.file(file Type)',
  //   insertText: 'pc.file(file Type);',
  //   detail: '插入一个内置的文件',
  // },
  // {
  //   label: 'pc.img(file Type)',
  //   insertText: 'pc.img(file Type);',
  //   detail: '插入一个内置的图片文件'
  // },
  // {
  //   label: 'pc.http.url.get()',
  //   insertText: 'pc.http.url.get();',
  //   detail: '获取原始的http协议url，不包含环境的base url，比如/user/login/{user_type}?user_name={{name}}'
  // },
  // {
  //   label: 'pc.http.url.parse()',
  //   insertText: 'pc.http.url.parse();',
  //   detail: '获取经过解析处理后的http协议url，包含环境的base url，比如www.eolinker.com/user/login/admin?user_name=jackliu'
  // },
  // {
  //   label: 'pc.http.url.set("new_url")',
  //   insertText: 'pc.http.url.set("new_url");',
  //   detail: '设置http协议url，比如/user/login/admin?user_name={{name}}'
  // },
  // {
  //   label: 'pc.http.header.get("param_key")',
  //   insertText: 'pc.http.header.get("param_key");',
  //   detail: '获取http协议请求头部参数值'
  // },
  // {
  //   label: 'pc.http.header.set("param_key","param_value")',
  //   insertText: 'pc.http.header.set("param_key","param_value");',
  //   detail: '设置http协议请求头部参数值'
  // },
  // {
  //   label: 'pc.http.header.unset("param_key")',
  //   insertText: 'pc.http.header.unset("param_key");',
  //   detail: '删除http协议header参数'
  // },
  // {
  //   label: 'pc.http.header.clear',
  //   insertText: 'pc.http.header.clear;',
  //   detail: '清空http协议header参数'
  // },
  // {
  //   label: 'pc.http.query.get("param_key")',
  //   insertText: 'pc.http.query.get("param_key");',
  //   detail: '获取http协议query参数'
  // },
  // {
  //   label: 'pc.http.query.set("param_key","param_value")',
  //   insertText: 'pc.http.query.set("param_key","param_value");',
  //   detail: '设置http协议query参数'
  // },
  // {
  //   label: 'pc.http.query.unset("param_key")',
  //   insertText: 'pc.http.query.unset("param_key");',
  //   detail: '删除http协议query参数（删除后不会出现在地址栏中）'
  // },
  // {
  //   label: 'pc.http.query.clear',
  //   insertText: 'pc.http.query.clear;',
  //   detail: '清空http协议query参数'
  // },
  // {
  //   label: 'pc.http.rest.get("param_key")',
  //   insertText: 'pc.http.rest.get("param_key");',
  //   detail: '获取http协议rest参数'
  // },
  // {
  //   label: 'pc.http.rest.set("param_key","param_value")',
  //   insertText: 'pc.http.rest.set("param_key","param_value");',
  //   detail: '设置http协议rest参数'
  // },
  // {
  //   label: 'pc.http.rest.unset("param_key")',
  //   insertText: 'pc.http.rest.unset("param_key");',
  //   detail: '删除http协议rest参数'
  // },
  // {
  //   label: 'pc.http.rest.clear',
  //   insertText: 'pc.http.rest.clear;',
  //   detail: '清空http协议rest参数'
  // },
  // {
  //   label: 'pc.http.response.get()',
  //   insertText: 'pc.http.response.get();',
  //   detail: '获取http协议返回结果'
  // },
  // {
  //   label: 'pc.http.response.set("response_value")',
  //   insertText: 'pc.http.response.set("response_value");',
  //   detail: '设置http协议返回结果'
  // },
  // {
  //   label: 'responseHeaders',
  //   insertText: 'responseHeaders;',
  //   detail: '获取返回头部内容'
  // },
  // {
  //   label: 'responseHeaders["param_key"]',
  //   insertText: 'responseHeaders["param_key"];',
  //   detail: '获取返回头部中的某个参数'
  // }
];

export const postmanCompletions: Array<Omit<languages.CompletionItem, 'range' | 'kind'>> = [
  {
    label: 'pc.request.url',
    insertText: 'pc.request.url',
    detail: ''
  },
  {
    label: 'pc.request.headers',
    insertText: 'pc.request.headers',
    detail: ''
  },
  {
    label: 'pc.request.headers.add',
    insertText: 'pc.request.headers.add',
    detail: ''
  },
  {
    label: 'pc.request.headers.remove',
    insertText: 'pc.request.headers.remove',
    detail: ''
  },
  {
    label: 'pc.request.headers.upsert',
    insertText: 'pc.request.headers.upsert',
    detail: ''
  },
  {
    label: 'pc.request.method',
    insertText: 'pc.request.method',
    detail: ''
  },
  {
    label: 'pc.request.body',
    insertText: 'pc.request.body',
    detail: ''
  }
];

export const getDefaultCompletions = (): Array<Omit<languages.CompletionItem, 'range'>> =>
  [...completions, ...postmanCompletions].map(item => ({
    ...item,
    kind: monaco.languages.CompletionItemKind.Function
  }));
