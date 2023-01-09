type ApiResponseOptions<T = any> = {
  success?: boolean;
  code?: number;
  message?: string;
  data?: T;
};

export enum HttpStatus {
  OK = 0
}

const genRes = (data, options: ApiResponseOptions = {}) => {
  return {
    success: true,
    code: 0,
    message: '',
    data,
    ...options
  };
};

export function ApiResponse(options: ApiResponseOptions): MethodDecorator {
  return function (target: object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (...args) {
        const data = await original.apply(this, args);
        return genRes(data, options);
      };
    }
    return descriptor;
  };
}

export const ApiOkResponse = (options: ApiResponseOptions = {}) =>
  ApiResponse({
    ...options,
    code: HttpStatus.OK
  });
