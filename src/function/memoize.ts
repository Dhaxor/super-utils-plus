/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key.
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
 * const values = memoize(values);
 * values(object);
 * // => [1, 2]
 * 
 * values(other);
 * // => [3, 4]
 * 
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 * 
 * // Modify the result cache
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 * 
 * // Replace `_.memoize.Cache`
 * memoize.Cache = WeakMap;
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(
	func: T,
	resolver?: (...args: Parameters<T>) => any
  ): T & { cache: Map<any, any>; } {
	const memoized = function(this: any, ...args: Parameters<T>): ReturnType<T> {
	  const key = resolver ? resolver.apply(this, args) : args[0];
	  const cache = memoized.cache;
	  
	  if (cache.has(key)) {
		return cache.get(key);
	  }
	  
	  const result = func.apply(this, args);
	  memoized.cache = cache.set(key, result) || cache;
	  return result;
	} as T & { cache: Map<any, any> };
	
	memoized.cache = new Map();
	return memoized;
  }
  
  // Allow customizing the cache implementation
  memoize.Cache = Map;