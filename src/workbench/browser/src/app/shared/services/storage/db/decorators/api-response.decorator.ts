export type ApiResponsePromise<T> = Promise<ApiResponseOptions<T>>;

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
        try {
          // 模拟 network，使用 JSON.stringify 将数据序列化
          const data = await original.apply(this, JSON.parse(JSON.stringify(args)));
          if (data instanceof ResObj) {
            return new ResObj(data.data, options);
          } else {
            return new ResObj(data, options);
          }
        } catch (error) {
          new ResObj(error, { ...options, code: 1 });
        }
      };
    }
    return descriptor;
  };
}
