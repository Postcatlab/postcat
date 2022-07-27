import { whatType, whatTextType } from '..';
import { ApiBodyType, ApiEditBody, JsonRootType } from '../../shared/services/storage/index.model';
import { flatData } from '../tree/tree.utils';

export const isXML = (data) => {
  const parser = new DOMParser();
  let xml = null;
  try {
    const xmlContent = parser.parseFromString(data, 'text/xml');
    xml = xmlContent.getElementsByTagName('parsererror');
  } catch (error) {
    return false;
  }
  if (xml.length > 0) {
    return false;
  }
  return true;
};
/**
 * Parse item to table need row data
 */
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
    // * just by first
    const [data] = value;
    if (whatType(data) === 'string') {
      return {
        name: key,
        required: true,
        value: JSON.stringify(value),
        example: JSON.stringify(value),
        type: 'array',
        description: '',
        listDepth: level,
      };
    }
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
/**
 * Parse item to table need row data
 */
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

interface uiData {
  textType: ApiBodyType | string;
  rootType: JsonRootType | string;
  data: any;
}
export const xml2UiData = (text) => {
  const data: any[] = xml2json(text);
  const result = {};
  const mapAttr = (obj: any) => {
    const { tagName, attr, children, content } = obj;
    return {
      [tagName]: children.length ? mapAttr(children[0]) : attr,
    };
  };
  data.forEach((it) => {
    const { tagName, attr, children } = it;
    result[tagName] = children.length ? mapAttr(children[0]) : attr;
  });
  return JSON.parse(JSON.stringify(result));
};

/**
 * Transfer text to json/xml/raw ui data,such as request body/response body
 *
 * @returns body info
 */
export const text2UiData: (text: string) => uiData = (text) => {
  const result: uiData = {
    textType: 'raw',
    rootType: 'object',
    data: text,
  };
  const textType = whatTextType(text);
  result.textType = ['xml', 'json'].includes(textType) ? textType : 'raw';
  switch (result.textType) {
    case 'xml': {
      result.data = xml2UiData(text);
      result.data = flatData(Object.keys(result.data).map((it) => parseTree(it, result.data[it])));
      break;
    }
    case 'json': {
      try {
        result.data = JSON.parse(result.data);
        result.data = flatData(Object.keys(result.data).map((it) => parseTree(it, result.data[it])));
      } catch (error) {
        result.textType = 'raw';
      }
      break;
    }
    default: {
      break;
    }
  }
  return result;
};

/**
 * Format eoapi body to json
 *
 * @param eoapiList
 * @param inputOptions
 * @returns
 */
export const parseEoapiBody2Json = function(eoapiArr: ApiEditBody, inputOptions) {
  inputOptions = inputOptions || {};
  const output = {};
  const loopFun = (inputArr, inputObject) => {
    if (inputOptions.checkXmlAttr) {inputObject['@eo_attr'] = inputObject['@eo_attr'] || {};}
    for (const val of inputArr) {
      if (!val.paramKey) {continue;}
      if (val.checkbox || val.paramNotNull || inputOptions.ignoreCheckbox) {
        if (inputOptions.callback) {inputOptions.callback(val);}
        const tmpKey = val.paramKeyHtml || val.paramKey;
        if (inputOptions.checkXmlAttr) {
          if (val.isErrorXmlAttr) {
            // $rootScope.InfoModal('请填写正确格式的XML属性列表再进行转换', 'warning');
            throw new Error('errorXmlAttr');
          }
          if (inputObject['@eo_attr'].hasOwnProperty(tmpKey)) {
            inputObject['@eo_attr'][tmpKey] = [
              inputObject['@eo_attr'][tmpKey],
              (val.attribute || '').replace(/\s+/, ' '),
            ];
          } else {
            inputObject['@eo_attr'][tmpKey] = (val.attribute || '').replace(/\s+/, ' ');
          }
        }
        if (inputOptions.defaultValueKey) {
          inputObject[tmpKey] = val[inputOptions.defaultValueKey];
        } else {
          inputObject[tmpKey] = val.paramInfo;
        }
        if (val.childList && val.childList.length > 0) {
          switch (val.paramType.toString()) {
            case '12': {
              // 数组
              const tmp_child_zero_item = val.childList[0];
              if (tmp_child_zero_item.isArrItem) {
                // 判断是否为新数组格式
                if (inputOptions.checkXmlAttr) {
                  inputObject['@eo_attr'][tmpKey] = [];
                }
                inputObject[tmpKey] = [];
                val.childList.map((tmp_arr_item) => {
                  if (!(tmp_arr_item.checkbox || tmp_arr_item.paramNotNull || inputOptions.ignoreCheckbox)) {return;}
                  if (inputOptions.checkXmlAttr) {
                    const tmp_attr = typeof tmp_arr_item.attribute === 'string' ? tmp_arr_item.attribute : '';
                    inputObject['@eo_attr'][tmpKey].push(tmp_attr.replace(/\s+/, ' '));
                  }
                  let tmp_result_arr_item = {};
                  if (
                    tmp_arr_item.paramType.toString() === '12' ||
                    !(tmp_arr_item.childList && tmp_arr_item.childList.length > 0)
                  ) {
                    loopFun([tmp_arr_item], tmp_result_arr_item);
                    tmp_result_arr_item = tmp_result_arr_item[tmp_arr_item.paramKeyHtml || tmp_arr_item.paramKey];
                  } else {
                    loopFun(tmp_arr_item.childList, tmp_result_arr_item);
                  }
                  inputObject[tmpKey].push(tmp_result_arr_item);
                });
              } else {
                if (inputOptions.checkXmlAttr) {
                  inputObject['@eo_attr'][tmpKey] = [inputObject['@eo_attr'][tmpKey]];
                }
                inputObject[tmpKey] = [{}];
                loopFun(val.childList, inputObject[tmpKey][0]);
              }
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
            8: 'false',
            12: '[]',
            13: '{}',
            14: '0',
            3: '0',
          };
          const tmpParamType = val.paramType.toString();
          if (inputOptions.defaultValueKey === 'paramName') {continue;}
          switch (tmpParamType) {
            case '0': {
              inputObject[tmpKey] = inputObject[tmpKey] || '';
              break;
            }
            case '15': {
              inputObject[tmpKey] = null;
              break;
            }
            default: {
              try {
                inputObject[tmpKey] = JSON.parse(inputObject[tmpKey] || tmpDefaultTypeValueObj[tmpParamType]);
              } catch (JSON_PARSE_ERROR) {
                inputObject[tmpKey] = inputObject[tmpKey] || '';
              }
              break;
            }
          }
        }
      }
    }
  };
  loopFun(eoapiArr, output);
  return output;
};
