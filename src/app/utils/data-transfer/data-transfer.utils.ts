import { whatType, whatTextType } from '..';
import { ApiBodyType, JsonRootType } from '../../shared/services/api-data/api-data.model';
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
  console.log('=>', data);
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
 * @returns {object} body info
 */
export const text2UiData: (text: string) => uiData = (text) => {
  let result: uiData = {
    textType: 'raw',
    rootType: 'object',
    data: text,
  };
  let textType = whatTextType(text);
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
