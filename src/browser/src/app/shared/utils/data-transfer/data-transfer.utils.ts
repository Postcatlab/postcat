import isXml from 'is-xml';

import { ApiBodyType, ApiParamsType, JsonRootType } from '../../../pages/workspace/project/api/api.model';
import { BodyParam } from '../../../services/storage/db/models/apiData';
import { whatType, whatTextType, JSONParse } from '../index.utils';

export const isXML = data => isXml(data);
/**
 * Parse item to eoTableComponent need
 */
const parseTree = (key, value): BodyParam | unknown => {
  if (whatType(value) === 'object') {
    return {
      name: key,
      isRequired: 1,
      'paramAttr.example': '',
      paramAttr: {
        example: ''
      },
      dataType: ApiParamsType.object,
      description: '',
      childList: Object.keys(value).map(it => parseTree(it, value[it]))
    };
  }
  if (whatType(value) === 'array') {
    // * Just pick first element
    const [data] = value;
    // If array element is primitive value
    if (whatType(data) === 'string') {
      return {
        name: key,
        isRequired: 1,
        'paramAttr.example': JSON.stringify(value),
        dataType: ApiParamsType.array,
        paramAttr: {
          example: JSON.stringify(value)
        },
        description: ''
      };
    }
    return {
      name: key,
      isRequired: 1,
      'paramAttr.example': '',
      paramAttr: {
        example: ''
      },
      dataType: ApiParamsType.array,
      description: '',
      childList: data ? Object.keys(data).map(it => parseTree(it, data[it])) : []
    };
  }
  // * value is string & number & null
  return {
    name: key,
    isRequired: 1,
    description: '',
    'paramAttr.example': value == null ? '' : value.toString(),
    paramAttr: {
      example: value == null ? '' : value.toString()
    },
    dataType: ApiParamsType[whatType(value)]
  };
};
/**
 * Parse item to table need row data
 */
export const form2json = tmpl =>
  tmpl
    .split('\n')
    .filter(it => it.trim())
    .map(it => it.split(':'))
    .map(it => {
      const [key, value] = it;
      return { key: key?.trim(), value: value?.trim() };
    });

const xml2jsonArr = (tmpl): Array<{ tagName: string; childList: any[]; content: string; attr: string }> => {
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
        throw new Error(`Parse error 101. [${last.tagName}] is not eq [${label}]`);
      }
      if (stack.length === 0) {
        result.push(last);
      } else {
        const parent = stack.pop();
        parent.childList.push(last);
        stack.push(parent);
      }
      index = xml.indexOf(str) === -1 ? 0 : xml.indexOf(str);
      xml = xml.substring(index + str.length).trim();
      index = null;
      continue;
    }
    // * handle start tags
    if (xml.indexOf('<') === 0 && (start = xml.match(startTag))) {
      const [str, label, attr] = start;
      if (str.slice(-2) === '/>') {
        // * single tag
        const parent = stack.pop();
        parent.childList.push({
          tagName: label.trim(),
          attr: attr.trim(),
          content: '',
          childList: []
        });
        stack.push(parent);
        xml = xml.trim().substring(str.length);
        continue;
      }
      stack.push({
        tagName: label.trim(),
        attr: attr.trim(),
        content: '',
        childList: []
      });
      index = xml.indexOf(str) === -1 ? 0 : xml.indexOf(str);
      xml = xml.substring(index + str.length);
      index = null;
      continue;
    }
    // * handle text content
    if (xml.indexOf('<') > 0) {
      index = xml.indexOf('<');
      const content = xml.slice(0, index);
      const last = stack.pop();
      last.content += content;
      stack.push(last);
      xml = xml.substring(index).trim();
      index = null;
      continue;
    }
    xml = xml.trim();
  }
  if (stack.length) {
    throw new Error('Parse error 102');
  }
  // console.log(JSON.stringify(result, null, 2));
  return result;
};

type uiData = {
  contentType: ApiBodyType;
  data: BodyParam | any;
};

export const xml2json = text => {
  const data: any[] = xml2jsonArr(text);
  const deep = (list = []) =>
    list.reduce(
      (total, { tagName, content, attr, childList }) => ({
        ...total,
        [tagName]: childList?.length > 0 ? deep(childList || []) : content
        // attribute: attr,  // * not support the key for now cause ui has not show it
      }),
      {}
    );
  return deep(data);
};
/**
 * Json object 2 xml
 *
 * @param o Object
 * @param tab tab or indent string for pretty output formatting,omit or use empty string "" to supress.
 * @returns
 */
export const json2xml: (o: object, tab?) => string = (o, tab) => {
  const toXml = function (v, name, ind) {
    let xml = '';
    if (v instanceof Array) {
      for (let i = 0, n = v.length; i < n; i++) {
        xml += `${ind + toXml(v[i], name, `${ind}\t`)}\n`;
      }
    } else if (typeof v == 'object') {
      let hasChild = false;
      xml += `${ind}<${name}`;
      for (var m in v) {
        if (m.charAt(0) == '@') {
          xml += ` ${m.substr(1)}="${v[m].toString()}"`;
        } else {
          hasChild = true;
        }
      }
      xml += hasChild ? '>' : '/>';
      if (hasChild) {
        for (var m in v) {
          if (m == '#text') {
            xml += v[m];
          } else if (m == '#cdata') {
            xml += `<![CDATA[${v[m]}]]>`;
          } else if (m.charAt(0) != '@') {
            xml += toXml(v[m], m, `${ind}\t`);
          }
        }
        xml += `${xml.charAt(xml.length - 1) == '\n' ? ind : ''}</${name}>`;
      }
    } else {
      xml += `${ind}<${name}>${v.toString()}</${name}>`;
    }
    return xml;
  };
  let xml = '';
  for (const m in o) {
    if (Object.prototype.hasOwnProperty.call(o, m)) {
      xml += toXml(o[m], m, '');
    }
  }
  return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, '');
};

/**
 * Transfer text to json/xml/raw table data,such as request body/response body
 *
 * @returns body info
 */
export const text2table: (text: string) => uiData = text => {
  const result: uiData = {
    contentType: ApiBodyType.Raw,
    data: text
  };
  const textType = whatTextType(text);
  result.contentType =
    textType === 'xml'
      ? ApiBodyType.XML
      : textType === 'json'
      ? whatType(JSONParse(text)) === 'array'
        ? ApiBodyType.JSONArray
        : ApiBodyType.JSON
      : ApiBodyType.Raw;
  switch (result.contentType) {
    case ApiBodyType.XML: {
      result.data = json2Table(xml2json(text));
      break;
    }
    case ApiBodyType.JSON: {
      result.data = json2Table(JSON.parse(result.data));
      break;
    }
    default: {
      break;
    }
  }
  return result;
};

/**
 * Format postcat body to json
 * !TODO Current just from sass apikit,need refactor
 *
 * @param arr
 * @param inputOptions
 * @returns
 */
export const table2json = function (arr: BodyParam[], inputOptions: { checkXmlAttr?: boolean; rootType?: JsonRootType } = {}) {
  let result = {};
  const loopFun = (inputArr, inputObject) => {
    if (inputOptions.checkXmlAttr) {
      inputObject['@eo_attr'] = inputObject['@eo_attr'] || {};
    }
    for (const val of inputArr || []) {
      if (!val.name) {
        continue;
      }
      // if (!val.required && !inputOptions.ignoreCheckbox) {
      //   continue;
      // }
      const tmpKey = val.name;
      if (inputOptions.checkXmlAttr) {
        if (val.isErrorXmlAttr) {
          throw new Error('errorXmlAttr');
        }
        if (inputObject['@eo_attr'].hasOwnProperty(tmpKey)) {
          inputObject['@eo_attr'][tmpKey] = [inputObject['@eo_attr'][tmpKey], (val.attribute || '').replace(/\s+/, ' ')];
        } else {
          inputObject['@eo_attr'][tmpKey] = (val.attribute || '').replace(/\s+/, ' ');
        }
      }
      inputObject[tmpKey] = val['paramAttr.example'];
      if (val.childList && val.childList.length > 0) {
        switch (val.dataType) {
          case ApiParamsType.array: {
            if (inputOptions.checkXmlAttr) {
              inputObject['@eo_attr'][tmpKey] = [inputObject['@eo_attr'][tmpKey]];
            }
            inputObject[tmpKey] = [{}];
            loopFun(val.childList, inputObject[tmpKey][0]);
            break;
          }
          default: {
            inputObject[tmpKey] = {};
            loopFun(val.childList, inputObject[tmpKey]);
            break;
          }
        }
      } else {
        const tmpDefaultTypeValueObj = {
          [ApiParamsType.boolean]: 'false',
          [ApiParamsType.array]: '[]',
          [ApiParamsType.object]: '{}',
          [ApiParamsType.number]: '0',
          [ApiParamsType.int]: '0'
        };
        switch (val.dataType) {
          case ApiParamsType.string: {
            inputObject[tmpKey] = inputObject[tmpKey] || '';
            break;
          }
          case ApiParamsType.null: {
            inputObject[tmpKey] = null;
            break;
          }
          default: {
            try {
              inputObject[tmpKey] = JSON.parse(inputObject[tmpKey] || tmpDefaultTypeValueObj[val.dataType]);
            } catch (JSON_PARSE_ERROR) {
              inputObject[tmpKey] = inputObject[tmpKey] || '';
            }
            break;
          }
        }
      }
    }
  };
  loopFun(arr, result);
  if (inputOptions.rootType === JsonRootType.Array) {
    result = [result];
  }
  return result;
};

export const json2Table = json => Object.entries(json).map(([key, value]) => parseTree(key, value));
