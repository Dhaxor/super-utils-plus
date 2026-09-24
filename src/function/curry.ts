/**
 * Creates a function that accepts arguments of func and either invokes func returning
 * its result, if at least arity number of arguments have been provided, or returns a
 * function that accepts the remaining func arguments, and so on. The arity of func may
 * be specified if func.length is not sufficient.
 *
 * @param func - The function to curry
 * @param arity - The arity of func
 * @returns The new curried function
 *
 * @example
 * ```ts
 * const abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * const curried = curry(abc);
 *
 * curried(1)(2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 * ```
 */
export function curry<T extends (...args: any[]) => any>(
  func: T,
  arity: number = func.length
): (...args: any[]) => any {
  function curried(this: any, ...args: any[]): any {
    if (args.length >= arity) {
      return func.apply(this, args);
    }

    return (...moreArgs: any[]) => curried.apply(this, [...args, ...moreArgs]);
  }

  return curried;
}

/**
 * This method is like `curry` except that arguments are applied to func in the
 * manner of `partialRight` instead of `partial`: each call's arguments are
 * prepended to those collected so far.
 *
 * @param func - The function to curry
 * @param arity - The arity of func
 * @returns The new curried function
 *
 * @example
 * ```ts
 * const abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * const curried = curryRight(abc);
 *
 * curried(3)(2)(1);
 * // => [1, 2, 3]
 *
 * curried(2, 3)(1);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 * ```
 */
export function curryRight<T extends (...args: any[]) => any>(
  func: T,
  arity: number = func.length
): (...args: any[]) => any {
  function curried(this: any, ...args: any[]): any {
    if (args.length >= arity) {
      return func.apply(this, args);
    }

    return (...moreArgs: any[]) => curried.apply(this, [...moreArgs, ...args]);
  }

  return curried;
}
