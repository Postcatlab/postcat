/**
 * 创建本地缓存对象
 *
 * @param {string=} prefixKey -
 * @param {Object} [storage=localStorage] - sessionStorage | localStorage
 */
export const createStorage = ({ prefixKey = '', storage = localStorage } = {}) => {
  /**
   * 本地缓存类
   *
   * @class Storage
   */
  const StorageUtil = class {
    private storage = storage;
    private prefixKey?: string = prefixKey;

    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     * @description Set storage
     * @param {string} key storage key
     * @param {*} value storage value
     * @param expire unit second,default unexpire
     */
    set(key: string, value: any, expire: number | null = null) {
      const stringData = JSON.stringify({
        value,
        expire: expire !== null ? new Date().getTime() + expire * 1000 : null
      });
      this.storage.setItem(this.getKey(key), stringData);
    }

    /**
     * Get storage
     *
     * @param {string} key storage key
     * @param {*=} def storage value
     */
    get<T = any>(key: string, def: any = null): T {
      const item = this.storage.getItem(this.getKey(key));
      if (item) {
        try {
          const data = JSON.parse(item);
          const { value, expire } = data;
          // 在有效期内直接返回
          if (expire === null || expire >= Date.now()) {
            return value;
          }
          this.remove(this.getKey(key));
        } catch (e) {
          return def;
        }
      }
      return def;
    }

    /**
     * 从缓存删除某项
     *
     * @param {string} key
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key));
    }

    /**
     * 清空所有缓存
     *
     * @memberOf Cache
     */
    clear() {
      this.storage.clear();
    }

    /**
     * 设置cookie
     *
     * @param {string} name cookie 名称
     * @param {*} value cookie 值
     * @param {number=} expire 过期时间
     * 如果过期时间为设置，默认关闭浏览器自动删除
     * @example
     */
    setCookie(name: string, value: any, expire: number | null = 60 * 60 * 24 * 7) {
      document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`;
    }

    /**
     * 根据名字获取cookie值
     *
     * @param name
     */
    getCookie(name: string): string {
      const cookieArr = document.cookie.split('; ');
      for (let i = 0, length = cookieArr.length; i < length; i++) {
        const kv = cookieArr[i].split('=');
        if (kv[0] === this.getKey(name)) {
          return kv[1];
        }
      }
      return '';
    }

    /**
     * 根据名字删除指定的cookie
     *
     * @param {string} key
     */
    removeCookie(key: string) {
      this.setCookie(key, 1, -1);
    }

    /**
     * 清空cookie，使所有cookie失效
     */
    clearCookie(): void {
      const keys = document.cookie.match(/[^ =;]+(?==)/g);
      if (keys) {
        for (let i = keys.length; i--; ) {
          document.cookie = `${keys[i]}=0;expire=${new Date(0).toUTCString()}`;
        }
      }
    }
  };
  return new StorageUtil();
};

export const StorageUtil = createStorage();

export default StorageUtil;
