/**
 * get rest param from url,format like {restName}
 * @param url
 * @returns {Array[string]}
 */
export const getRest: (url: string) => string[] = (url) => {
  return [...url.replace(/{{(.*?)}}/g, '').matchAll(/{(.*?)}/g)].map((val) => val[1]);
};

export const addEnvPrefix = (prefix, uri) => {
  // * 需要先判断uri是否已经包含 http:// 前缀
  if (prefix == null) {
    return uri;
  }
  const hasPrefix = /(http|https):\/{2}.+/.test(uri);
  if (hasPrefix) {
    return uri;
  }
  // * 添加前缀
  return prefix + uri;
};
