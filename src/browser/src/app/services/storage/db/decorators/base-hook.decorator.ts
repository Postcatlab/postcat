const genHookName = (prefix: string, str: string) => {
  const firstWord = str.charAt(0);
  return str.replace(firstWord, `${prefix}${firstWord.toUpperCase()}`);
};
/**
 * 给 CRUD 添加一些前后置钩子
 * beforeXxx 服务函数执行的前置钩子，在某个动作之前执行，不会对该动作有影响
 * afterXxx 服务的函数执行后置钩子，在某个动作之后执行，如果该钩子有返回值，那么将使用该钩子的返回值作为该动作执行结果的返回值
 * xxxParamTransformer 服务的函数入参前 对参数进行处理(参数转换器)
 */
export function HookGenerator() {
  return function (taget: any, propName: string, descriptor: TypedPropertyDescriptor<any>) {
    const beforeHook = genHookName('before', propName);
    const afterHook = genHookName('after', propName);
    const paramTransformer = genHookName(propName, 'paramTransformer');

    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (...args) {
        args = (await this[paramTransformer]?.(...args)) ?? args;
        await this[beforeHook]?.(...args);
        const result = await original.apply(this, args);
        const afterHookresult = await this[afterHook]?.({ params: args.reduce((p, v) => ({ ...p, ...v }), {}), result });

        return afterHookresult || result;
      };
    }

    return descriptor;
  };
}
