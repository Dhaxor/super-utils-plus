/**
 * A minimal cache interface compatible with `Map` and `WeakMap`.
 */
export interface MemoizeCache<K = any, V = any> {
  has(key: K): boolean;
  get(key: K): V | undefined;
  set(key: K, value: V): this;
  delete(key: K): boolean;
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key.
 *
 * The cache is exposed as the `cache` property of the memoized function (a `Map`
 * by default). The cache implementation can be swapped by assigning a constructor
 * such as `WeakMap` to `memoize.Cache`; `cache` is then typed as a `Map` but holds
 * an instance of that class.
 *
 * @param func - The function to memoize
 * @param resolver - The function to resolve the cache key
 * @returns The new memoized function
 *
 * @example
 * ```ts
 * const object = { 'a': 1, 'b': 2 };
 * const other = { 'c': 3, 'd': 4 };
 *
 * const memoizedValues = memoize(values);
 * memoizedValues(object);
 * // => [1, 2]
 *
 * memoizedValues(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * memoizedValues(object);
 * // => [1, 2]
 *
 * // Modify the result cache
 * memoizedValues.cache.set(object, ['a', 'b']);
 * memoizedValues(object);
 * // => ['a', 'b']
 *
 * // Replace `memoize.Cache`
 * memoize.Cache = WeakMap;
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => any
): T & { cache: Map<any, any> } {
  const memoized = function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver.apply(this, args) : args[0];
    const cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  } as T & { cache: Map<any, any> };

  memoized.cache = new memoize.Cache() as Map<any, any>;
  return memoized;
}

// Allow customizing the cache implementation
memoize.Cache = Map as new () => MemoizeCache;
