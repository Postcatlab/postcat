type HookParams = { beforeHook?: string; afterHook?: string };

const genHookName = (prefix: string, str: string) => {
  return str.replace(str.charAt(0), `${prefix}${str.charAt(0).toUpperCase()}`);
};

export function HookFactory(params: HookParams = {}) {
  return function (taget: any, propName: string, descriptor: TypedPropertyDescriptor<any>) {
    const { beforeHook = genHookName('before', propName), afterHook = genHookName('after', propName) } = params;
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (...args) {
        await this[beforeHook]?.(...args);
        const result = await original.apply(this, args);
        const afterHookresult = await this[afterHook]?.({ params: args, result });

        return afterHookresult || result;
      };
    }

    return descriptor;
  };
}
