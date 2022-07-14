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

const COMMON_DATA: TreeNode[] = [
  {
    name: $localize`Encode & Decode`, // 编解码
    children: [
      {
        name: $localize`JSON Encode`, // JSON 编码
        caption: 'eo.json.encode',
        value: 'eo.json.encode(json_object)',
        note: {
          code: 'eo.json.encode(json_object)',
          desc: $localize`JSON Encode`, // JSON 编码
          input: [{ key: 'json_object', value: $localize`JSON object` }], // 待 JSON 序列化处理的对象
          output: $localize`JSON string`, // JSON字符串
        },
      },
      {
        name: $localize`JSON Decode`, // JSON 解码
        caption: 'json.decode',
        value: 'json.decode(json)',
        note: {
          code: 'json.decode(json)',
          desc: $localize`JSON Decode`, // JSON 解码
          input: [{ key: 'json', value: $localize`JSON string` }], // JSON 字符串
          output: $localize`JSON object`, // JSON 反序列化处理后的对象
        },
      },
      {
        name: $localize`XML Encode`, // XML 编码
        caption: 'xml.encode',
        value: 'xml.encode(xml_object)',
        note: {
          code: 'xml.encode(xml_object)',
          desc: $localize`XML code`, // XML 编码
          input: [{ key: 'xml_object', value: $localize`XML code` }], // 待XML序列化处理的对象
          output: $localize`XML string`, // XML 字符串
        },
      },
      {
        name: $localize`XML Decode`, // XML 解码
        caption: 'xml.decode',
        value: 'xml.decode(xml)',
        note: {
          code: 'xml.decode(xml)',
          desc: $localize`XML code`, // XML 解码
          input: [{ key: 'xml', value: $localize`XML string` }], // XML字符串
          output: $localize`XML code`, // XML反序列化处理后的对象
        },
      },
      {
        name: $localize`Base64 Encode`, // Base64 编码
        caption: 'base64.encode',
        value: 'base64.encode(data)',
        note: {
          code: 'base64.encode(data)',
          desc: $localize`Base64 Encode`, // Base64 编码
          input: [{ key: 'data', value: $localize`string of wait for encode` }], // 待编码字符串
          output: $localize`string after encode`, // 编码后字符串
        },
      },
      {
        name: $localize`Base64 Decode`, // Base64 解码
        caption: 'base64.decode',
        value: 'base64.decode(data)',
        note: {
          code: 'base64.decode(data)',
          desc: $localize`Base64 Decode`, // Base64 解码
          input: [{ key: 'data', value: $localize`string of wait for decode` }], // 待解码字符串
          output: $localize`string after decode`, // 解码后字符串
        },
      },
      {
        name: $localize`UrlEncode Encode`, // UrlEncode 编码
        caption: 'eo.urlEncode',
        value: 'eo.urlEncode(data)',
        note: {
          code: 'eo.urlEncode(data)',
          desc: $localize`UrlEncode Encode`, // UrlEncode 编码
          input: [{ key: 'data', value: $localize`string of wait for encode` }], // 待编码字符串
          output: $localize`string after encode`, // 编码后字符串
        },
      },
      {
        name: $localize`UrlEncode Decode`, // UrlEncode 解码
        caption: 'eo.urlDecode',
        value: 'eo.urlDecode(data)',
        note: {
          code: 'eo.urlDecode(data)',
          desc: $localize`UrlEncode Decode`, // UrlEncode 解码
          input: [{ key: 'data', value: $localize`string of wait for decode` }], // 待解码字符串
          output: $localize`string after decode`, // 解码后字符串
        },
      },
      {
        name: $localize`Gzip zip`, // gzip 压缩
        caption: 'eo.gzip.zip',
        value: 'eo.gzip.zip(data)',
        note: {
          code: 'eo.gzip.zip(data)',
          desc: $localize`Gzip zip`, // gzip 压缩
          input: [{ key: 'data', value: $localize`string of wait for zip` }], // 待压缩字符串
          output: $localize`string after zip`, // 压缩后字符串
        },
      },
      {
        name: $localize`Gzip unzip`, // gzip 解压
        caption: 'eo.gzip.unzip',
        value: 'eo.gzip.unzip(data)',
        note: {
          code: 'eo.gzip.unzip(data)',
          desc: $localize`Gzip unzip`, // gzip 解压缩
          input: [{ key: 'data', value: $localize`string of wait for unzip` }], // 待解压字符串
          output: $localize`string after unzip`, // 解压后字符串
        },
      },
      {
        name: $localize`Deflate zip`, // deflate 压缩
        caption: 'eo.deflate.zip',
        value: 'eo.deflate.zip(data)',
        note: {
          code: 'eo.deflate.zip(data)',
          desc: $localize`Deflate zip`, // deflate 压缩
          input: [{ key: 'data', value: $localize`string of wait for zip` }], // 待压缩字符串
          output: $localize`string after zip`, // 压缩后字符串
        },
      },
      {
        name: $localize`Deflate unzip`, // deflate 解压
        caption: 'eo.deflate.unzip',
        value: 'eo.deflate.unzip(data)',
        note: {
          code: 'eo.deflate.unzip(data)',
          desc: $localize`Deflate unzip`, // deflate 解压缩
          input: [{ key: 'data', value: $localize`string of wait for unzip` }], // 待解压字符串
          output: $localize`string after unzip`, // 解压后字符串
        },
      },
    ],
  },
];

export const BEFORE_DATA: TreeNode[] = [
  ...COMMON_DATA,
  {
    name: $localize`HTTP API request`,
    children: [
      {
        name: $localize`Set Request URL`, // 设置请求地址
        caption: 'eo.http.url.set',
        value: 'eo.http.url.set("new_url")',
        note: {
          code: 'eo.http.url.set("new_url")',
          desc: $localize`Set HTTP API request path`, // 设置 HTTP API 的请求路径
          input: [{ key: 'new_url', value: $localize`new url` }], // 新的请求路径
        },
      },
      {
        name: $localize`Set Header`, // 设置 Header 参数
        caption: 'eo.http.header.set',
        value: 'eo.http.header.set("param_key","param_value")',
        note: {
          code: 'eo.http.header.set("param_key","param_value")',
          desc: $localize`Set HTTP API request header params`, // 设置 HTTP API 的请求头部参数
          input: [
            { key: 'param_key', value: $localize`params name` }, // 参数名
            { key: 'param_value', value: $localize`params value` }, // 参数值
          ],
        },
      },

      {
        name: $localize`Request body variable[Form-data/JSON/XML]`, //请求体变量[对象：表单/JSON/XML]
        caption: 'eo.http.bodyParseParam',
        value: 'eo.http.bodyParseParam',
      },

      {
        name: $localize`Request body variable[Raw]`, //请求体变量[文本：Raw]
        caption: 'eo.http.bodyParam',
        value: 'eo.http.bodyParam',
      },
      {
        name: $localize`Set REST params`, //设置 REST 参数
        caption: 'eo.http.rest.set',
        value: 'eo.http.rest.set("param_key","param_value")',
        note: {
          code: 'eo.http.rest.set("param_key","param_value")',
          desc: $localize`Set HTTP API REST params`, // 设置 HTTP API 的 REST 参数
          input: [
            { key: 'param_key', value: $localize`params name` }, //参数名
            { key: 'param_value', value: $localize`params value` }, // 参数值
          ],
        },
      },
      {
        name: $localize`Set Query params`, // 设置 Query 参数
        caption: 'eo.http.query.set',
        value: 'eo.http.query.set("param_key","param_value")',
        note: {
          code: 'eo.http.query.set("param_key","param_value")',
          desc: $localize`Set HTTP API Query params`, //设置 HTTP API 的 Query 参数
          input: [
            { key: 'param_key', value: $localize`params name` }, //参数名
            { key: 'param_value', value: $localize`params value` }, // 参数值
          ],
        },
      },
      {
        name: $localize`Insert new API test[Form-data]`, //插入新 API 测试[Form-data]
        caption: '',
        value: `//定义需要测试的API
var formdata_api_demo_1 = {
    "url": "https://api.eolink.com", //[必填][string]请求地址,若不存在请求协议，默认http
    "name": "FORM-DATA API Demo", //[选填][string]，API名称，方便检索，不填则默认为系统生成API编号
    "method": "POST", //[选填][string],请求方式,可能值有[GET/POST/PUT/PATCH/DELETE/HEAD/OPTION],兼容大小写,默认为GET
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
    }, //[选填][object],请求头部
    "bodyType": "form-data", //[选填][string],请求体类型
    "body": { //[选填][object],请求参数
        "param_1": "value_1",
        "param_2": "value_2"
    },    
    "timelimit": 1000 //[选填],超时限制,单位为ms,超过时间则判断为请求失败，默认为1000ms
};
//执行请求，返回格式为{time:"请求时间",code:"HTTP状态码",response:"返回结果",header:"返回头部"}，
var formdata_api_demo_1_result = eo.execute(formdata_api_demo_1);
//判断返回结果
if (formdata_api_demo_1_result.response !== "") {
    eo.info("info_1"); //输出信息
} else {
    eo.info("info_2"); //输出信息
}`,
      },
      {
        name: $localize`Insert new API test[JSON]`, // 插入新 API 测试[JSON]
        caption: '',
        value: `//定义需要测试的API
var json_api_demo_1 = {
    "url": "https://api.eolink.com", //[必填][string]请求地址,若不存在请求协议，默认http
    "name": "JSON API Demo", //[选填][string]，API名称，方便检索，不填则默认为系统生成API编号
    "method": "POST", //[选填][string],请求方式,可能值有[GET/POST/PUT/PATCH/DELETE/HEAD/OPTION],兼容大小写,默认为GET
    "headers": {
        "Content-Type": "application/json"
    }, //[选填][object],请求头部
    "bodyType": "json", //[选填][string],请求体类型
    "body": { //[选填][object],请求参数
        "param_1": "value_1",
        "param_2": "value_2"
    },    
    "timelimit": 1000 //[选填],超时限制,单位为ms,超过时间则判断为请求失败，默认为1000ms
};
//执行请求，返回格式为{time:"请求时间",code:"HTTP状态码",response:"返回结果",header:"返回头部"}，
var json_api_demo_1_result = eo.execute(json_api_demo_1);
//判断返回结果
if (json_api_demo_1_result.response !== "") {
    eo.info("info_1"); //输出信息
} else {
    eo.info("info_2"); //输出信息
}`,
      },
      {
        name: $localize`Insert new API test[XML]`, //插入新 API 测试[XML]
        caption: '',
        value: `//定义需要测试的API
var xml_api_demo_1 = {
    "url": "https://api.eolink.com", //[必填][string]请求地址,若不存在请求协议，默认http
    "name": "XML API Demo", //[选填][string]，API名称，方便检索，不填则默认为系统生成API编号
    "method": "POST", //[选填][string],请求方式,可能值有[GET/POST/PUT/PATCH/DELETE/HEAD/OPTION],兼容大小写,默认为GET
    "headers": {
        "Content-Type": "application/xml"
    }, //[选填][object],请求头部
    "bodyType": "xml", //[选填][string],请求体类型
    "body": { //[选填][object],请求参数
        "root": {
            "book":[
                {
                    "name":"eolinker_book_1"
                },
                {
                    "name":"eolinker_book_2"
                }
            ]
        }
    },    
    "timelimit": 1000 //[选填],超时限制,单位为ms,超过时间则判断为请求失败，默认为1000ms
};
//执行请求，返回格式为{time:"请求时间",code:"HTTP状态码",response:"返回结果",header:"返回头部"}，
var xml_api_demo_1_result = eo.execute(xml_api_demo_1);
//判断返回结果
if (xml_api_demo_1_result.response !== "") {
    eo.info("info_1"); //输出信息
} else {
    eo.info("info_2"); //输出信息
}`,
      },
      {
        name: $localize`Insert new API test[Raw]`, //插入新 API 测试[Raw]
        caption: '',
        value: `//定义需要测试的API
var raw_api_demo_1 = {
    "url": "https://api.eolink.com", //[必填][string]请求地址,若不存在请求协议，默认http
    "name": "RAW API Demo", //[选填][string]，API名称，方便检索，不填则默认为系统生成API编号
    "method": "POST", //[选填][string],请求方式,可能值有[GET/POST/PUT/PATCH/DELETE/HEAD/OPTION],兼容大小写,默认为GET
    "headers": {
        "Content-Type": "text/plain"
    }, //[选填][object],请求头部
    "bodyType": "raw", //[选填][string],请求体类型
    "body": "hello world",    
    "timelimit": 1000 //[选填],超时限制,单位为ms,超过时间则判断为请求失败，默认为1000ms
};
//执行请求，返回格式为{time:"请求时间",code:"HTTP状态码",response:"返回结果",header:"返回头部"}，
var raw_api_demo_1_result = eo.execute(raw_api_demo_1);
//判断返回结果
if (raw_api_demo_1_result.response !== "") {
    eo.info("info_1"); //输出信息
} else {
    eo.info("info_2"); //输出信息
}`,
      },
    ],
  },
];

export const AFTER_DATA: TreeNode[] = [
  ...COMMON_DATA,
  {
    name: $localize`HTTP API request`,
    children: [
      {
        name: $localize`Get Response Results`,
        caption: 'eo.http.response.get',
        value: 'eo.http.response.get();',
        note: {
          code: 'eo.http.response.get()',
          desc: $localize`Get the response result of the HTTP API`,
        },
      },
      {
        name: $localize`Set Response Result`,
        caption: 'eo.http.response.set',
        value: 'eo.http.response.set("response_value");',
        note: {
          code: 'eo.http.response.set("response_value")',
          desc: $localize`Set the response result of the HTTP API`,
          input: [{ key: 'response_value', value: $localize`response result` }],
        },
      },
    ],
  },
  {
    name: $localize`Custom Global Variable`,
    children: [
      {
        name: $localize`Set Global Variable`,
        caption: 'eo.globals.set',
        value: 'eo.globals.set("param_key","param_value")',
        note: {
          code: 'eo.globals.set("param_key","param_value")',
          desc: $localize`Set Global Variable`,
          input: [
            { key: 'param_key', value: $localize`parameter name` },
            { key: 'param_value', value: $localize`parameter value` },
          ],
        },
      },
      {
        name: $localize`Get global variable value`,
        caption: 'eo.globals.get',
        value: 'eo.globals.get("param_key")',
        note: {
          code: 'eo.globals.set("param_key","param_value")',
          desc: $localize`Get global variable value`,
          input: [
            { key: 'param_key', value: $localize`parameter name` },
            { key: 'param_value', value: $localize`parameter value` },
          ],
          output: $localize`Global Variable Value`,
        },
      },
      {
        name: $localize`Delete Global Variable`,
        caption: 'eo.globals.unset',
        value: 'eo.globals.unset("param_key")',
        note: {
          code: 'eo.globals.unset("param_key")',
          desc: $localize`Delete Global Variable`,
          input: [{ key: 'param_key', value: $localize`parameter name` }],
        },
      },
      {
        name: $localize`Clear All Global Variables`,
        caption: 'eo.globals.clear',
        value: 'eo.globals.clear()',
        note: {
          code: 'eo.globals.clear()',
          desc: $localize`Clear All Global Variables`,
        },
      },
    ],
  },
];

export const completions: Completion[] = AFTER_DATA.flatMap((n) => n.children).reduce((prev, curr) => {
  const { caption, value } = curr;
  if (caption) {
    prev.push({ caption, value });
  }
  return prev;
}, []);
