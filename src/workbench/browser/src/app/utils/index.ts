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
 * @returns textType - xml|json|html|text
 */
export const whatTextType = (tmpText) => {
  // TODO it can be better
  const tmpCompareText = tmpText.replace(/\s/g, '');
  if (/^({|\[)(.*)(}|])$/.test(tmpCompareText) && JSON.parse(tmpCompareText)) {
    return 'json';
  } else if (/^(<)(.*)(>)$/.test(tmpCompareText)) {
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
 * reverse object key and value
 * @param obj
 */
export const reverseObj = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[obj[key]] = key;
    return acc;
  }, {});
};
/**
 * reverse object key and value
 * @param obj
 */
export const objectToArray = (obj) => {
  return Object.keys(obj).map((val) => ({
    key: val,
    value: obj[val],
  }));
};

export const isEmptyValue = (obj) => {
  const list = Object.keys(obj);
  const emptyList = list.filter((it) => !obj[it]);
  // * If they length are equal, means each value of obj is empty. like { name: '', value: '' }
  return emptyList.length === list.length;
};

export const parserJsonFile = (file, type = 'UTF-8') =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file, type);
    reader.onload = (ev) => {
      const fileString: string = ev.target.result as string;
      const json = JSON.parse(fileString);
      resolve({ name: file.name, content: json });
    };
  });

export const getDefaultValue = (list: any[], key) => {
  if (list.length === 0) {
    return '';
  }
  const [target] = list.filter((it) => it.default);
  return target[key] || '';
};

export const parserProperties = (properties) => Object.keys(properties).map((it) => ({ value: it, ...properties[it] }));
const base64ToUint8Array = (inputBase64String) => {
  const tmpPadding = '='.repeat((4 - (inputBase64String.length % 4)) % 4);
  const tmpBase64 = (inputBase64String + tmpPadding).replace(/\-/g, '+').replace(/_/g, '/');

  const tmpRawData = window.atob(tmpBase64);
  const tmpOutputArray = new Uint8Array(tmpRawData.length);
  for (let i = 0; i < tmpRawData.length; ++i) {
    tmpOutputArray[i] = tmpRawData.charCodeAt(i);
  }
  return tmpOutputArray;
};
export const getBlobUrl = (inputStream, inputFileType) => {
  let tmpBlob;
  try {
    inputStream = base64ToUint8Array(inputStream);
    if (typeof window.Blob === 'function') {
      tmpBlob = new Blob([inputStream], {
        type: inputFileType,
      });
    } else {
      const tmpBlobBuilder =
        window['BlobBuilder'] || window['MozBlobBuilder'] || window['WebKitBlobBuilder'] || window['MSBlobBuilder'];
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

export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return Promise.resolve(text);
  } catch (e) {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.setSelectionRange(0, 9999);
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      console.log($localize`复制成功`);
    }
    document.body.removeChild(input);
    return Promise.resolve(text);
  }
};
