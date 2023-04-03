import { isFunction } from 'lodash-es';
import { convertViewIDtoIndexedDBID } from 'pc/browser/src/app/services/storage/db/dataSource';

/** 普通响应 promise */
export type ApiResponsePromise<T> = Promise<ApiResponseOptions<T>>;
/** 分页 promise */
export type ApiPageResponsePromise<T> = Promise<ApiResponseOptions<ApiPageData<T>>>;

export type Pageintor = {
  page: number;
  size: number;
  total: number;
};

export type ApiPageData<T> = {
  paginator: Pageintor;
  items: T;
};

export type ApiResponseOptions<T = any> = {
  success?: boolean;
  code?: number;
  message?: string;
  data?: T;
};

export enum HttpStatus {
  OK = 0
}

export class ResObj<T> {
  success = true;
  code = HttpStatus.OK;
  message = '';
  data: T;
  constructor(data, options: ApiResponseOptions = {}) {
    Object.entries(options).forEach(([key, value]) => (this[key] = value));
    this.data = data;
  }
}

export function ApiResponse(options: ApiResponseOptions = {}): MethodDecorator {
  return function (target: object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (...args) {
        const fnArr = args.filter(n => isFunction(n));
        try {
          //Simulate network, use JSON.stringify to serialize data
          let params = JSON.parse(JSON.stringify(args))?.[0];

          //Convert View model id to database id,such as apiUuid to uuid
          params = convertViewIDtoIndexedDBID(this.db, params);

          if (typeof propertyKey === 'string' && ['bulkDelete'].includes(propertyKey) && params.ids) {
            params.id = params.ids;
          }

          //Call Function
          const data = await original.call(this, params, ...fnArr);
          if (data instanceof ResObj) {
            return new ResObj(data.data, options);
          } else {
            return new ResObj(data, options);
          }
        } catch (error) {
          console.error(`IndexedDB Error: ${error}`);
          return new ResObj(error, { ...options, code: error?.code ?? 1, success: false });
        }
      };
    }
    return descriptor;
  };
}
