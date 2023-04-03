export type Note = {
  code?: string;
  desc?: string;
  input?: Array<{ key: string; value: string }>;
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
const generateEoExcuteSnippet = bodyType => {
  const variableByBodyType = {
    formdata: {
      id: 'formdata',
      name: 'FORM-DATA',
      contentType: 'application/x-www-form-urlencoded',
      bodyType: 'form-data',
      body: `{
     "param_1": "value_1",
     "param_2": "value_2"
     }`
    },
    json: {
      id: 'json',
      name: 'JSON',
      contentType: 'application/json',
      bodyType: 'json',
      body: `{
     "param_1": "value_1",
     "param_2": "value_2"
     }`
    },
    xml: {
      id: 'xml',
      name: 'XML',
      contentType: 'application/xml',
      bodyType: 'xml',
      body: `{
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
  }`
    },
    raw: {
      id: 'raw',
      name: 'RAW',
      contentType: 'text/plain',
      bodyType: 'raw',
      body: `"hello world"`
    }
  };

  const variables = variableByBodyType[bodyType];
  // Because i18n compile complex line error,safe way
  const localizes = {
    apidefind: $localize`API Definite`,
    url: $localize`[Required][string] Request url`,
    name: $localize`[Required][string] API name,for report detail`,
    header: $localize`[Not Required][object] Request headers`,
    bodyType: $localize`[Not Required][string] Body type，formdata|json|xml|raw`,
    body: $localize`[Not Required][object] Request Body`,
    timelimit: $localize`[Not Required]If it exceeds the judgment, the request fails, and the default is 1000ms`,
    execute: $localize`Execute request,${variables.id}_api_demo_1_result={time:"Test time",code:"HTTP status code",response:"API response",header:"response headers"}，`,
    assert: $localize`Assert response`,
    info: $localize`Print info`,
    infoError: $localize`Print error info`
  };
  const result = `//${localizes.apidefind}
  var ${variables.id}_api_demo_1 = {
    "url": "https://www.postcat.com", //${localizes.url}
    "name": "${variables.name} API Demo", //${localizes.name}
      "method": "POST",
      "headers": {
          "Content-Type": "${variables.contentType}"
      }, //${localizes.header}
      "bodyType": " ${variables.bodyType}", //${localizes.bodyType}
      "body": ${variables.body},//${localizes.body}
      "timelimit": 1000 //${localizes.timelimit}
  };
  //${localizes.execute}
  var ${variables.id}_api_demo_1_result = pc.execute(${variables.id}_api_demo_1);
  //${localizes.assert}
  if (${variables.id}_api_demo_1_result.response !== "") {
      pc.info("info_1"); //${localizes.info}
  } else {
      pc.stop("info_2"); //${localizes.infoError}
  }`;
  return result;
};
export type Completion = { caption: string; value: string };

const commonInputs = [
  { key: 'param_key', value: $localize`Param Name` },
  { key: 'param_value：', value: $localize`Param Value` }
] as const;

const COMMON_DATA: TreeNode[] = [
  {
    name: $localize`Custom Global Variable`,
    children: [
      {
        name: $localize`Set an global variable`,
        caption: 'pc.globals.set',
        value: 'pc.globals.set("param_key","param_value");',
        note: {
          code: 'pc.http.response.get()',
          desc: $localize`Set an global variable`,
          input: [...commonInputs]
        }
      },
      {
        name: $localize`Get an global variable`,
        caption: 'pc.globals.get',
        value: 'pc.globals.get("param_key");',
        note: {
          code: 'pc.globals.get("param_key")',
          desc: $localize`Get an global variable`,
          input: [commonInputs[0]],
          output: $localize`Global Varibale Value`
        }
      },
      {
        name: $localize`Clear an global variable`,
        caption: 'pc.globals.unset',
        value: 'pc.globals.unset("param_key");',
        note: {
          code: 'pc.globals.unset("param_key")',
          desc: $localize`Clear an global variable`,
          input: [commonInputs[0]]
        }
      },
      {
        name: $localize`Clear all global variable`,
        caption: 'pc.globals.clear',
        value: 'pc.globals.clear()',
        note: {
          code: 'pc.globals.clear()',
          desc: $localize`Clear all global variable`
        }
      }
    ]
  }
  // {
  //   name: $localize`Encode and Decode`,
  //   children: [
  //     {
  //       name: $localize`JSON Encode`,
  //       caption: 'pc.json.encode',
  //       value: 'pc.json.encode(json_object)',
  //       note: {
  //         code: 'pc.json.encode(json_object)',
  //         desc: $localize`JSON Encode`,
  //         input: [{ key: 'json_object', value: $localize`JSON object` }],
  //         output: $localize`JSON string`
  //       }
  //     },
  //     {
  //       name: $localize`JSON Decode`,
  //       caption: 'pc.json.decode',
  //       value: 'pc.json.decode(json)',
  //       note: {
  //         code: 'pc.json.decode(json)',
  //         desc: $localize`JSON Decode`,
  //         input: [{ key: 'json', value: $localize`JSON string` }],
  //         output: $localize`JSON object`
  //       }
  //     },
  //     {
  //       name: $localize`XML Encode`,
  //       caption: 'pc.xml.encode',
  //       value: 'pc.xml.encode(xml_object)',
  //       note: {
  //         code: 'pc.xml.encode(xml_object)',
  //         desc: $localize`XML Encode`,
  //         input: [{ key: 'xml_object', value: $localize`XML object` }],
  //         output: $localize`XML string`
  //       }
  //     },
  //     {
  //       name: $localize`XML Decode`,
  //       caption: 'pc.xml.decode',
  //       value: 'pc.xml.decode(xml)',
  //       note: {
  //         code: 'pc.xml.decode(xml)',
  //         desc: $localize`XML Decode`,
  //         input: [{ key: 'xml', value: $localize`XML string` }],
  //         output: $localize`XML code`
  //       }
  //     },
  //     {
  //       name: $localize`Base64 Encode`,
  //       caption: 'pc.base64.encode',
  //       value: 'pc.base64.encode(data)',
  //       note: {
  //         code: 'pc.base64.encode(data)',
  //         desc: $localize`Base64 Encode`,
  //         input: [{ key: 'data', value: $localize`string of wait for encode` }],
  //         output: $localize`string after encode`
  //       }
  //     },
  //     {
  //       name: $localize`Base64 Decode`,
  //       caption: 'pc.base64.decode',
  //       value: 'pc.base64.decode(data)',
  //       note: {
  //         code: 'pc.base64.decode(data)',
  //         desc: $localize`Base64 Decode`,
  //         input: [{ key: 'data', value: $localize`string of wait for decode` }],
  //         output: $localize`string after decode`
  //       }
  //     },
  //     {
  //       name: $localize`UrlEncode Encode`,
  //       caption: 'pc.urlEncode',
  //       value: 'pc.urlEncode(data)',
  //       note: {
  //         code: 'pc.urlEncode(data)',
  //         desc: $localize`UrlEncode Encode`,
  //         input: [{ key: 'data', value: $localize`string of wait for encode` }],
  //         output: $localize`string after encode`
  //       }
  //     },
  //     {
  //       name: $localize`UrlEncode Decode`,
  //       caption: 'pc.urlDecode',
  //       value: 'pc.urlDecode(data)',
  //       note: {
  //         code: 'pc.urlDecode(data)',
  //         desc: $localize`UrlEncode Decode`,
  //         input: [{ key: 'data', value: $localize`string of wait for decode` }],
  //         output: $localize`string after decode`
  //       }
  //     },
  //     {
  //       name: $localize`Gzip zip`,
  //       caption: 'pc.gzip.zip',
  //       value: 'pc.gzip.zip(data)',
  //       note: {
  //         code: 'pc.gzip.zip(data)',
  //         desc: $localize`Gzip zip`,
  //         input: [{ key: 'data', value: $localize`string of wait for zip` }],
  //         output: $localize`string after zip`
  //       }
  //     },
  //     {
  //       name: $localize`Gzip unzip`,
  //       caption: 'pc.gzip.unzip',
  //       value: 'pc.gzip.unzip(data)',
  //       note: {
  //         code: 'pc.gzip.unzip(data)',
  //         desc: $localize`Gzip unzip`,
  //         input: [{ key: 'data', value: $localize`string of wait for unzip` }],
  //         output: $localize`string after unzip`
  //       }
  //     },
  //     {
  //       name: $localize`Deflate zip`,
  //       caption: 'pc.deflate.zip',
  //       value: 'pc.deflate.zip(data)',
  //       note: {
  //         code: 'pc.deflate.zip(data)',
  //         desc: $localize`Deflate zip`,
  //         input: [{ key: 'data', value: $localize`string of wait for zip` }],
  //         output: $localize`string after zip`
  //       }
  //     },
  //     {
  //       name: $localize`Deflate unzip`,
  //       caption: 'pc.deflate.unzip',
  //       value: 'pc.deflate.unzip(data)',
  //       note: {
  //         code: 'pc.deflate.unzip(data)',
  //         desc: $localize`Deflate unzip`,
  //         input: [{ key: 'data', value: $localize`string of wait for unzip` }],
  //         output: $localize`string after unzip`
  //       }
  //     }
  //   ]
  // },
  // {
  //   name: $localize`Encryption and Decryption`,
  //   children: [
  //     {
  //       name: `MD5`,
  //       caption: 'pc.crypt.md5',
  //       value: 'pc.crypt.md5(data)',
  //       note: {
  //         code: 'pc.crypt.md5(data)',
  //         desc: $localize`MD5 Encryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           }
  //         ],
  //         output: $localize`Encrypted result`
  //       }
  //     },
  //     {
  //       name: $localize`SHA1 Encryption`,
  //       caption: 'pc.crypt.sha1',
  //       value: 'pc.crypt.sha1(data)',
  //       note: {
  //         code: 'pc.crypt.sha1(data)',
  //         desc: $localize`SHA1 Encryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           }
  //         ],
  //         output: $localize`Encrypted result`
  //       }
  //     },
  //     {
  //       name: $localize`SHA256 Encryption`, // SHA256 加密
  //       caption: 'pc.crypt.sha256',
  //       value: 'pc.crypt.sha256(data)',
  //       note: {
  //         code: 'pc.crypt.sha256(data)',
  //         desc: $localize`SHA256 Encryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           }
  //         ],
  //         output: $localize`Encrypted result`
  //       }
  //     },
  //     {
  //       name: $localize`RSA-SHA1 Signature`,
  //       caption: 'pc.crypt.rsaSHA1',
  //       value: 'pc.crypt.rsaSHA1(data,privateKey,"base64")',
  //       note: {
  //         code: 'pc.crypt.rsaSHA1(data,privateKey,"base64")',
  //         desc: $localize`RSA-SHA1 Signature`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           },
  //           {
  //             key: 'privateKey',
  //             value: $localize`private key`
  //           },
  //           {
  //             key: 'outputEncoding',
  //             value: $localize`The encoding format of the result, base64 (default)`
  //           }
  //         ],
  //         output: $localize`Content After Signing`
  //       }
  //     },
  //     {
  //       name: $localize`RSA-SHA256 Signature`, // RSA-SHA256 签名
  //       caption: 'pc.crypt.rsaSHA256',
  //       value: 'pc.crypt.rsaSHA256(data,privateKey,"base64")',
  //       note: {
  //         code: 'pc.crypt.rsaSHA256(data,privateKey,"base64")',
  //         desc: $localize`RSA-SHA256 Signature`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           },
  //           {
  //             key: 'privateKey',
  //             value: $localize`private key`
  //           },
  //           {
  //             key: 'outputEncoding',
  //             value: $localize`The encoding format of the result, base64 (default)`
  //           }
  //         ],
  //         output: $localize`Content After Signing`
  //       }
  //     },
  //     {
  //       name: $localize`RSA Public Key Encryption`, // RSA 公钥加密
  //       caption: 'pc.crypt.rsaPublicEncrypt',
  //       value: 'pc.crypt.rsaPublicEncrypt(data,publicKey,"base64")',
  //       note: {
  //         code: 'pc.crypt.rsaPublicEncrypt(data,publicKey,"base64")',
  //         desc: $localize`RSA Public Key Encryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           },
  //           {
  //             key: 'publicKey',
  //             value: $localize`public key`
  //           },
  //           {
  //             key: 'outputEncoding',
  //             value: $localize`The encoding format of the result, base64 (default)`
  //           }
  //         ],
  //         output: $localize`Content After Signing`
  //       }
  //     },
  //     {
  //       name: $localize`RSA Public Key Dencryption`, // RSA 公钥解密
  //       caption: 'pc.crypt.rsaPublicDecrypt',
  //       value: 'pc.crypt.rsaPublicDecrypt(data,publicKey,"base64")',
  //       note: {
  //         code: 'pc.crypt.rsaPublicDecrypt(data,publicKey,"base64")',
  //         desc: $localize`RSA Public Key Dencryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           },
  //           {
  //             key: 'publicKey',
  //             value: $localize`public key`
  //           },
  //           {
  //             key: 'inputEncoding',
  //             value: $localize`The encoding format of the content to be decrypted, base64 (default)`
  //           }
  //         ],
  //         output: $localize`Decrypted content`
  //       }
  //     },
  //     {
  //       name: $localize`RSA Private Key Encryption`, // RSA 私钥加密
  //       caption: 'pc.crypt.rsaPrivateEncrypt',
  //       value: 'pc.crypt.rsaPrivateEncrypt(data,privateKey,"base64")',
  //       note: {
  //         code: 'pc.crypt.rsaPrivateEncrypt(data,privateKey,"base64")',
  //         desc: $localize`RSA Private Key Encryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           },
  //           {
  //             key: 'privateKey',
  //             value: $localize`private key`
  //           },
  //           {
  //             key: 'outputEncoding',
  //             value: $localize`The encoding format of the result, base64 (default)`
  //           }
  //         ],
  //         output: $localize`Encrypted result`
  //       }
  //     },
  //     {
  //       name: $localize`RSA Private Key Encryption`, // RSA 私钥解密
  //       caption: 'pc.crypt.rsaPrivateDecrypt',
  //       value: 'pc.crypt.rsaPrivateDecrypt(data,privateKey,"base64")',
  //       note: {
  //         code: 'pc.crypt.rsaPrivateDecrypt(data,privateKey,"base64")',
  //         desc: $localize`RSA Private Key Encryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be decrypted`
  //           },
  //           {
  //             key: 'privateKey',
  //             value: $localize`private key`
  //           },
  //           {
  //             key: 'outputEncoding',
  //             value: $localize`The encoding format of the content to be decrypted, base64 (default)`
  //           }
  //         ],
  //         output: $localize`Decrypted Content`
  //       }
  //     },
  //     {
  //       name: $localize`AES Encryption`, // AES 加密
  //       caption: 'pc.crypt.aesEncrypt',
  //       value: 'pc.crypt.aesEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
  //       note: {
  //         code: 'pc.crypt.aesEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
  //         desc: $localize`AES Encryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           },
  //           {
  //             key: 'password',
  //             value: $localize`password`
  //           },
  //           {
  //             key: 'padding',
  //             value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`
  //           },
  //           {
  //             key: 'mode',
  //             value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`
  //           },
  //           {
  //             key: 'iv',
  //             value: $localize`offset vector`
  //           }
  //         ],
  //         output: $localize`Encrypted result`
  //       }
  //     },
  //     {
  //       name: $localize`AES Dencryption`, // AES 解密
  //       caption: 'pc.crypt.aesDecrypt',
  //       value: 'pc.crypt.aesDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
  //       note: {
  //         code: 'pc.crypt.aesDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
  //         desc: $localize`AES Dencryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           },
  //           {
  //             key: 'password',
  //             value: $localize`password`
  //           },
  //           {
  //             key: 'padding',
  //             value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`
  //           },
  //           {
  //             key: 'mode',
  //             value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`
  //           },
  //           {
  //             key: 'iv',
  //             value: $localize`offset vector`
  //           }
  //         ],
  //         output: $localize`Encrypted result`
  //       }
  //     },
  //     {
  //       name: $localize`DES Encryption`, // DES 加密
  //       caption: 'pc.crypt.desEncrypt',
  //       value: 'pc.crypt.desEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
  //       note: {
  //         code: 'pc.crypt.desEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
  //         desc: $localize`DES Encryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           },
  //           {
  //             key: 'password',
  //             value: $localize`password`
  //           },
  //           {
  //             key: 'padding',
  //             value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`
  //           },
  //           {
  //             key: 'mode',
  //             value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`
  //           },
  //           {
  //             key: 'iv',
  //             value: $localize`offset vector`
  //           }
  //         ],
  //         output: $localize`Encrypted result`
  //       }
  //     },
  //     {
  //       name: $localize`DES Dencryption`, // DES 解密
  //       caption: 'pc.crypt.desDecrypt',
  //       value: 'pc.crypt.desDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
  //       note: {
  //         code: 'pc.crypt.desDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
  //         desc: $localize`DES Dencryption`,
  //         input: [
  //           {
  //             key: 'data',
  //             value: $localize`Content to be encrypted`
  //           },
  //           {
  //             key: 'password',
  //             value: $localize`password`
  //           },
  //           {
  //             key: 'padding',
  //             value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`
  //           },
  //           {
  //             key: 'mode',
  //             value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`
  //           },
  //           {
  //             key: 'iv',
  //             value: $localize`offset vector`
  //           }
  //         ],
  //         output: $localize`Encrypted result`
  //       }
  //     }
  //   ]
  // }
];

export const BEFORE_DATA: TreeNode[] = [
  // {
  //   name: $localize`HTTP API request`,
  //   children: [
  //     {
  //       name: $localize`Set Request URL`,
  //       caption: 'pc.http.url.set',
  //       value: 'pc.http.url.set("new_url")',
  //       note: {
  //         code: 'pc.http.url.set("new_url")',
  //         desc: $localize`Set HTTP API request path`,
  //         input: [{ key: 'new_url', value: $localize`new url` }]
  //       }
  //     },
  //     {
  //       name: $localize`Set Header`,
  //       caption: 'pc.http.header.set',
  //       value: 'pc.http.header.set("param_key","param_value")',
  //       note: {
  //         code: 'pc.http.header.set("param_key","param_value")',
  //         desc: $localize`Set HTTP API request header params`,
  //         input: [
  //           { key: 'param_key', value: $localize`params name` },
  //           { key: 'param_value', value: $localize`params value` }
  //         ]
  //       }
  //     },

  //     {
  //       name: $localize`Request body[Form-data]`,
  //       caption: 'pc.http.bodyParseParam',
  //       value: 'pc.http.bodyParseParam'
  //     },

  //     {
  //       name: $localize`Request body[Raw]`,
  //       caption: 'pc.http.bodyParam',
  //       value: 'pc.http.bodyParam'
  //     },
  //     {
  //       name: $localize`Set REST params`,
  //       caption: 'pc.http.rest.set',
  //       value: 'pc.http.rest.set("param_key","param_value")',
  //       note: {
  //         code: 'pc.http.rest.set("param_key","param_value")',
  //         desc: $localize`Set HTTP API REST params`,
  //         input: [
  //           { key: 'param_key', value: $localize`params name` },
  //           { key: 'param_value', value: $localize`params value` }
  //         ]
  //       }
  //     },
  //     {
  //       name: $localize`Set Query params`,
  //       caption: 'pc.http.query.set',
  //       value: 'pc.http.query.set("param_key","param_value")',
  //       note: {
  //         code: 'pc.http.query.set("param_key","param_value")',
  //         desc: $localize`Set HTTP API Query params`,
  //         input: [
  //           { key: 'param_key', value: $localize`params name` },
  //           { key: 'param_value', value: $localize`params value` }
  //         ]
  //       }
  //     },
  //     {
  //       name: $localize`Insert new API test[Form-data]`,
  //       caption: '',
  //       value: generateEoExcuteSnippet('formdata')
  //     },
  //     {
  //       name: $localize`Insert new API test[JSON]`,
  //       caption: '',
  //       value: generateEoExcuteSnippet('json')
  //     },
  //     {
  //       name: $localize`Insert new API test[XML]`,
  //       caption: '',
  //       value: generateEoExcuteSnippet('xml')
  //     },
  //     {
  //       name: $localize`Insert new API test[Raw]`,
  //       caption: '',
  //       value: generateEoExcuteSnippet('raw')
  //     }
  //   ]
  // },
  ...COMMON_DATA
];

export const AFTER_DATA: TreeNode[] = [
  // {
  //   name: $localize`HTTP API request`,
  //   children: [
  //     {
  //       name: $localize`Get Response Results`,
  //       caption: 'pc.http.response.get',
  //       value: 'pc.http.response.get();',
  //       note: {
  //         code: 'pc.http.response.get()',
  //         desc: $localize`Get the response result of the HTTP API`
  //       }
  //     },
  //     {
  //       name: $localize`Set Response Result`,
  //       caption: 'pc.http.response.set',
  //       value: 'pc.http.response.set("response_value");',
  //       note: {
  //         code: 'pc.http.response.set("response_value")',
  //         desc: $localize`Set the response result of the HTTP API`,
  //         input: [{ key: 'response_value', value: $localize`response result` }]
  //       }
  //     }
  //   ]
  // },
  ...COMMON_DATA
];

export const beforeScriptCompletions: any[] = BEFORE_DATA.flatMap(n => n.children).reduce((prev, curr) => {
  const { caption, value } = curr;
  if (caption) {
    prev.push({
      label: caption,
      insertText: value,
      kind: 1
    });
  }
  return prev;
}, []);
export const afterScriptCompletions: Completion[] = AFTER_DATA.flatMap(n => n.children).reduce((prev, curr) => {
  const { caption, value } = curr;
  if (caption) {
    prev.push({
      label: caption,
      insertText: value,
      kind: 1
    });
  }
  return prev;
}, []);
