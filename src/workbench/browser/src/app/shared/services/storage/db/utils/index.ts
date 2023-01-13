export const reverseObjKV = (obj = {}) => {
  return Object.entries<any>(obj).reduce((prev, [key, value]) => {
    prev[value] = key;
    return prev;
  }, {});
};
