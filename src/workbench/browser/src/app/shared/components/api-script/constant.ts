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

const commonInputs = [
  { key: 'param_key', value: $localize`Param Name` },
  { key: 'param_value：', value: $localize`Param Value` },
] as const;

const COMMON_DATA: TreeNode[] = [
  {
    name: $localize`Custom Global Variable`, // 自定义全局变量
    children: [
      {
        name: $localize`Set Global Variable`, // 设置全局变量
        caption: 'eo.globals.set',
        value: 'eo.globals.set("param_key","param_value");',
        note: {
          code: 'eo.http.response.get()',
          desc: $localize`Set Global Variable`,
          input: [...commonInputs],
        },
      },
      {
        name: $localize`Get Global Variable`, // 获取全局变量值
        caption: 'eo.globals.get',
        value: 'eo.globals.get("param_key");',
        note: {
          code: 'eo.globals.get("param_key")',
          desc: $localize`Get Global Variable`,
          input: [commonInputs[0]],
          output: $localize`Global Varibale Value`,
        },
      },
      {
        name: $localize`Unset Global Variable`, // 删除全局变量
        caption: 'eo.globals.unset',
        value: 'eo.globals.unset("param_key");',
        note: {
          code: 'eo.globals.unset("param_key")',
          desc: $localize`Unset Global Variable`,
          input: [commonInputs[0]],
        },
      },
      {
        name: $localize`Clear Global Variable`, // 清空所有全局变量
        caption: 'eo.globals.clear',
        value: 'eo.globals.clear()',
        note: {
          code: 'eo.globals.clear()',
          desc: $localize`Clear Global Variable`,
        },
      },
    ],
  },
  {
    name: $localize`Project Environment`, // 项目环境
    children: [
      {
        name: $localize`Get Request Address Prefix`, // 获取请求地址前缀
        caption: 'http.baseUrl.get',
        value: 'http.baseUrl.get()',
        note: {
          code: 'http.baseUrl.get()',
          desc: $localize`Get Request Address Prefix`,
          output: $localize`The request address prefix set in the environment`,
        },
      },
      {
        name: $localize`Get Environment Variables`, // 获取环境变量
        caption: 'eo.env.param.get',
        value: 'eo.env.param.get("param_key")',
        note: {
          code: 'eo.env.param.get("param_key")',
          desc: $localize`Get Environment Variables`,
          input: [commonInputs[0]],
        },
      },
      {
        name: $localize`Set Environment Variables`, // 设置环境变量
        caption: 'eo.env.param.set',
        value: 'eo.env.param.set("param_key","param_value")',
        note: {
          code: 'eo.env.param.set("param_key","param_value")',
          desc: $localize`Set Environment Variables`,
          input: [...commonInputs],
        },
      },
    ],
  },
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
  {
    name: $localize`Encryption And Decryption`, // 加解密
    children: [
      {
        name: $localize`MD5`, // MD5
        caption: 'eo.crypt.md5',
        value: 'eo.crypt.md5(data)',
        note: {
          code: 'eo.crypt.md5(data)',
          desc: $localize`MD5 Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
          ],
          output: $localize`Encrypted Content`,
        },
      },
      {
        name: $localize`SHA1 Encryption`, // SHA1 加密
        caption: 'eo.crypt.sha1',
        value: 'eo.crypt.sha1(data)',
        note: {
          code: 'eo.crypt.sha1(data)',
          desc: $localize`SHA1 Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
          ],
          output: $localize`Encrypted Content`,
        },
      },
      {
        name: $localize`SHA256 Encryption`, // SHA256 加密
        caption: 'eo.crypt.sha256',
        value: 'eo.crypt.sha256(data)',
        note: {
          code: 'eo.crypt.sha256(data)',
          desc: $localize`SHA256 Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
          ],
          output: $localize`Encrypted Content`,
        },
      },
      {
        name: $localize`RSA-SHA1 Signature`, // RSA-SHA1 签名
        caption: 'eo.crypt.rsaSHA1',
        value: 'eo.crypt.rsaSHA1(data,privateKey,"base64")',
        note: {
          code: 'eo.crypt.rsaSHA1(data,privateKey,"base64")',
          desc: $localize`RSA-SHA1 Signature`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'privateKey',
              value: $localize`key`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the result, base64 (default)`,
            },
          ],
          output: $localize`Content After Signing`,
        },
      },
      {
        name: $localize`RSA-SHA256 Signature`, // RSA-SHA256 签名
        caption: 'eo.crypt.rsaSHA256',
        value: 'eo.crypt.rsaSHA256(data,privateKey,"base64")',
        note: {
          code: 'eo.crypt.rsaSHA256(data,privateKey,"base64")',
          desc: $localize`RSA-SHA256 Signature`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'privateKey',
              value: $localize`key`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the result, base64 (default)`,
            },
          ],
          output: $localize`Content After Signing`,
        },
      },
      {
        name: $localize`RSA Public Key Encryption`, // RSA 公钥加密
        caption: 'eo.crypt.rsaPublicEncrypt',
        value: 'eo.crypt.rsaPublicEncrypt(data,publicKey,"base64")',
        note: {
          code: 'eo.crypt.rsaPublicEncrypt(data,publicKey,"base64")',
          desc: $localize`RSA Public Key Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'publicKey',
              value: $localize`publicKey`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the result, base64 (default)`,
            },
          ],
          output: $localize`Content After Signing`,
        },
      },
      {
        name: $localize`RSA Public Key Dencryption`, // RSA 公钥解密
        caption: 'eo.crypt.rsaPublicDecrypt',
        value: 'eo.crypt.rsaPublicDecrypt(data,publicKey,"base64")',
        note: {
          code: 'eo.crypt.rsaPublicDecrypt(data,publicKey,"base64")',
          desc: $localize`RSA Public Key Dencryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'publicKey',
              value: $localize`publicKey`,
            },
            {
              key: 'inputEncoding',
              value: $localize`The encoding format of the content to be decrypted, base64 (default)`,
            },
          ],
          output: $localize`Decrypted content`,
        },
      },
      {
        name: $localize`RSA Private Key Encryption`, // RSA 私钥加密
        caption: 'eo.crypt.rsaPrivateEncrypt',
        value: 'eo.crypt.rsaPrivateEncrypt(data,privateKey,"base64")',
        note: {
          code: 'eo.crypt.rsaPrivateEncrypt(data,privateKey,"base64")',
          desc: $localize`RSA Private Key Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'privateKey',
              value: $localize`privateKey`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the result, base64 (default)`,
            },
          ],
          output: $localize`Encrypted Content`,
        },
      },
      {
        name: $localize`RSA Private Key Encryption`, // RSA 私钥解密
        caption: 'eo.crypt.rsaPrivateDecrypt',
        value: 'eo.crypt.rsaPrivateDecrypt(data,privateKey,"base64")',
        note: {
          code: 'eo.crypt.rsaPrivateDecrypt(data,privateKey,"base64")',
          desc: $localize`RSA Private Key Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be decrypted`,
            },
            {
              key: 'privateKey',
              value: $localize`privateKey`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the content to be decrypted, base64 (default)`,
            },
          ],
          output: $localize`Decrypted Content`,
        },
      },
      {
        name: $localize`AES Encryption`, // AES 加密
        caption: 'eo.crypt.aesEncrypt',
        value: 'eo.crypt.aesEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
        note: {
          code: 'eo.crypt.aesEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
          desc: $localize`AES Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'password',
              value: $localize`password`,
            },
            {
              key: 'padding',
              value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`,
            },
            {
              key: 'mode',
              value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`,
            },
            {
              key: 'iv',
              value: $localize`offset vector`,
            },
          ],
          output: $localize`encrypted content`,
        },
      },
      {
        name: $localize`AES Dencryption`, // AES 解密
        caption: 'eo.crypt.aesDecrypt',
        value: 'eo.crypt.aesDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
        note: {
          code: 'eo.crypt.aesDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
          desc: $localize`AES Dencryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be dencrypted`,
            },
            {
              key: 'password',
              value: $localize`password`,
            },
            {
              key: 'padding',
              value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`,
            },
            {
              key: 'mode',
              value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`,
            },
            {
              key: 'iv',
              value: $localize`offset vector`,
            },
          ],
          output: $localize`dencrypted content`,
        },
      },
      {
        name: $localize`DES Encryption`, // DES 加密
        caption: 'eo.crypt.desEncrypt',
        value: 'eo.crypt.desEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
        note: {
          code: 'eo.crypt.desEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
          desc: $localize`DES Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'password',
              value: $localize`password`,
            },
            {
              key: 'padding',
              value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`,
            },
            {
              key: 'mode',
              value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`,
            },
            {
              key: 'iv',
              value: $localize`offset vector`,
            },
          ],
          output: $localize`Encrypted Content`,
        },
      },
      {
        name: $localize`DES Dencryption`, // DES 解密
        caption: 'eo.crypt.desDecrypt',
        value: 'eo.crypt.desDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
        note: {
          code: 'eo.crypt.desDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
          desc: $localize`DES Dencryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'password',
              value: $localize`password`,
            },
            {
              key: 'padding',
              value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`,
            },
            {
              key: 'mode',
              value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`,
            },
            {
              key: 'iv',
              value: $localize`offset vector`,
            },
          ],
          output: $localize`Encrypted Content`,
        },
      },
    ],
  },
];

export const BEFORE_DATA: TreeNode[] = [
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
  ...COMMON_DATA,
];

export const AFTER_DATA: TreeNode[] = [
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
  ...COMMON_DATA,
];

export const beforeScriptCompletions: Completion[] = BEFORE_DATA.flatMap((n) => n.children).reduce((prev, curr) => {
  const { caption, value } = curr;
  if (caption) {
    prev.push({ caption, value });
  }
  return prev;
}, []);

export const afterScriptCompletions: Completion[] = AFTER_DATA.flatMap((n) => n.children).reduce((prev, curr) => {
  const { caption, value } = curr;
  if (caption) {
    prev.push({ caption, value });
  }
  return prev;
}, []);
