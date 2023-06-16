import memoizee from 'memoizee';

/**
 * memo decorator
 *
 * @returns memoization
 */
export function memo() {
  return function (target: any, key: keyof any, descriptor: PropertyDescriptor) {
    const oldFn = descriptor.value;
    const newFn = memoizee(oldFn);
    descriptor.value = function () {
      return newFn.apply(this, arguments);
    };
  };
}
