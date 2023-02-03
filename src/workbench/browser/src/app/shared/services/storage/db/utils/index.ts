/**
 *  将对象进行序列化及反序列化，因为 dexie.js 会将 属性 为 undefined 的属性删掉
 *  同时也是为了过滤掉不能够被序列化的数据
 * */
export const serializeObj = <T extends object>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;
