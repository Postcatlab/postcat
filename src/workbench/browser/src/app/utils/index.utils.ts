import { isNumber } from 'lodash-es';

window.pcConsole = {
  log(...args) {
    console.log('%c EO_LOG: ', 'background-color:#2a4073; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;', ...args);
  },
  warn(...args) {
    console.warn('%c EO_WARN:', 'background-color:#ffd900;padding:3px;box-sizing: border-box;border-radius: 3px;', ...args);
  },
  success(...args) {
    console.log('%c EO_SUCCESS: ', 'background-color:#52c41a; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;', ...args);
  },
  error(...args) {
    console.error(
      '%c EO_ERROR: ',
      'background-color: #a73836; color: #fff;padding:3px;box-sizing: border-box;border-radius: 3px;',
      ...args
    );
  }
};
export const uuid = (): string => Math.random().toString(36).slice(-8);

// const DOMAIN_REGEX =
//   '(^((http|wss|ws|ftp|https)://))|(^(((http|wss|ws|ftp|https)://)|)(([\\w\\-_]+([\\w\\-\\.]*)?(\\.(' +
//   DOMAIN_CONSTANT.join('|') +
//   ')))|((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))|(localhost))((\\/)|(\\?)|(:)|($)))';
export const whatType = (data: any): string => {
  if (data === undefined) {
    return 'undefined';
  }
  if (data === null) {
    return 'null';
  }
  if (data instanceof Array) {
    return 'array';
  }
  if (data instanceof Object) {
    return 'object';
  }
  if (typeof data === 'string') {
    return 'string';
  }
  if (typeof data === 'number') {
    return 'number';
  }
  if (typeof data === 'boolean') {
    return 'boolean';
  }
  return 'unknown';
};
/**
 * judge text content type
 *
 * @returns textType - xml|json|html|text
 */
export const whatTextType = (tmpText): 'xml' | 'json' | 'html' | 'text' => {
  // TODO it can be better
  const tmpCompareText = tmpText.replace(/\s/g, '');
  if (/^({|\[)(.*)(}|])$/.test(tmpCompareText)) {
    try {
      JSON.parse(tmpCompareText);
      return 'json';
    } catch (e) {}
  }
  if (/^(<)(.*)(>)$/.test(tmpCompareText)) {
    if (/^(<!DOCTYPEhtml>)|(html)/i.test(tmpCompareText)) {
      return 'html';
    } else {
      return 'xml';
    }
  } else {
    return 'text';
  }
};
/**
 * Reverse Typescript enum key and value
 *
 * @param enum
 */
export const enumsToObject = tEnum =>
  Object.entries<any>(tEnum).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
/**
 * Reverse Typescript enums key and value
 *
 * @param enum
 */
export const enumsToArr = tEnum =>
  Object.values(tEnum)
    .filter(val => !isNumber(val))
    .map((val: string) => ({
      key: val,
      value: tEnum[val]
    }));

export const isEmptyObj = obj => obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
export const isEmptyValue = obj => {
  const list = Object.keys(obj);
  const emptyList = list.filter(it => !obj[it]);
  // * If they length are equal, means each value of obj is empty. like { name: '', value: '' }
  return emptyList.length === list.length;
};
export const transferFileToDataUrl = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ev => {
      resolve({ name: file.name, content: ev.target.result });
    };
  });
export const parserJsonFile = (file, type = 'UTF-8') =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsText(file, type);
    reader.onload = ev => {
      const fileString: string = ev.target.result as string;
      const json = JSON.parse(fileString);
      resolve({ name: file.name, content: json });
    };
  });

export const getDefaultValue = (list: any[], key) => {
  if (list.length === 0) {
    return '';
  }
  const [target] = list.filter(it => it.default);
  return target[key] || '';
};

export const parserProperties = properties => Object.keys(properties).map(it => ({ value: it, ...properties[it] }));
const base64ToUint8Array = inputBase64String => {
  const tmpPadding = '='.repeat((4 - (inputBase64String.length % 4)) % 4);
  const tmpBase64 = (inputBase64String + tmpPadding).replace(/\-/g, '+').replace(/_/g, '/');

  const tmpRawData = window.atob(tmpBase64);
  const tmpOutputArray = new Uint8Array(tmpRawData.length);
  for (let i = 0; i < tmpRawData.length; ++i) {
    tmpOutputArray[i] = tmpRawData.charCodeAt(i);
  }
  return tmpOutputArray;
};
// 字符串转ArrayBuffer
const s2ab = s => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
};

export const getBlobUrl = (inputStream, inputFileType) => {
  let tmpBlob;
  try {
    // inputStream = base64ToUint8Array(inputStream);
    if (typeof window.Blob === 'function') {
      tmpBlob = new Blob([s2ab(inputStream)], {
        type: inputFileType
      });
    } else {
      const tmpBlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
      const tmpBlobClass = new tmpBlobBuilder();
      tmpBlobClass.append(inputStream);
      tmpBlob = tmpBlobClass.getBlob(inputFileType);
    }
  } catch (GET_BLOB_ERR) {
    tmpBlob = inputStream;
  }
  const tmpUrlObj = window.URL || window.webkitURL;
  return tmpUrlObj.createObjectURL(tmpBlob);
};

// fn 是需要防抖处理的函数
// wait 是时间间隔
export function debounce(fn, wait = 50) {
  // 通过闭包缓存一个定时器 id
  let timer = null;
  // 将 debounce 处理结果当作函数返回
  // 触发事件回调时执行这个返回函数
  return function (...args) {
    // this保存给context
    // 如果已经设定过定时器就清空上一次的定时器
    if (timer) {
      clearTimeout(timer);
    }

    // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

export function throttle(fn, gap) {
  let timerId = null;
  return function (...rest) {
    if (timerId === null) {
      fn(...rest); // 立即执行
      timerId = setTimeout(() => {
        // 在间隔时间后清除标识
        timerId = null;
      }, gap);
    }
  };
}

export const eoDeepCopy = obj => {
  if (structuredClone) {
    return structuredClone(obj);
  }
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = eoDeepCopy(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = eoDeepCopy(obj[attr]);
      }
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

// TODO 该方法不完善
export function isBase64(str) {
  if (str === '' || str.trim() === '') {
    return false;
  }
  try {
    return window.btoa(window.atob(str)) === str;
  } catch (err) {
    return false;
  }
}

export const copy = text => {
  const el = document.createElement('input');
  el.setAttribute('value', text);
  document.body.appendChild(el);
  el.select();
  const flag = document.execCommand('copy');
  document.body.removeChild(el);
  return !!flag;
};

export const compareVersion = (v1, v2) => {
  const _v1 = v1.split('.');
  const _v2 = v2.split('.');
  const _r = parseInt(_v1[0] || 0, 10) - parseInt(_v2[0] || 0, 10);

  return _r === 0 && v1 !== v2 ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.')) : _r;
};

// more see https://developer.mozilla.org/zh-CN/docs/Glossary/Base64#solution_4_–_escaping_the_string_before_encoding_it
export const b64DecodeUnicode = (str: string) => {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    window
      .atob(str)
      .split('')
      .map(function (c) {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join('')
  );
};

export const decodeUnicode = (str: string) => {
  return unescape(str.replace(/\\u/gi, '%u'));
};

export const JSONParse = (text, defaultVal = {}, reviver?) => {
  if (typeof text === 'object') return text;
  try {
    return JSON.parse(text, reviver);
  } catch (ex) {
    pcConsole.warn('JSONParse error:', ex);
    return defaultVal;
  }
};

export const waitNextTick = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(true), 0);
  });

export const getUrlParams = url => {
  const u = new URL(url);
  const s = new URLSearchParams(u.search);
  const obj = {};
  s.forEach((v, k) => (obj[k] = v));
  return obj;
};
