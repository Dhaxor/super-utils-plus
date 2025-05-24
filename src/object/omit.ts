/**
 * Creates an object composed of the own enumerable property paths of object that are not omitted.
 * 
 * @param object - The source object
 * @param paths - The property paths to omit
 * @returns The new object
 * 
 * @example
 * ```ts
 * const object = { 'a': 1, 'b': 2, 'c': 3 };
 * 
 * omit(object, ['a', 'c']);
 * // => { 'b': 2 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(
	object: T,
	paths: K[] | string[]
  ): Omit<T, K> {
	if (!object) {
	  return {} as Omit<T, K>;
	}
	
	const result = {} as Omit<T, K>;
	const pathSet = new Set(paths.map(String));
	
	for (const key in object) {
	  if (
		Object.prototype.hasOwnProperty.call(object, key) &&
		!pathSet.has(key as any)
	  ) {
		result[key as unknown as keyof Omit<T, K>] = object[key] as any;
	  }
	}
	
	return result;
  }
  
  /**
   * Creates an object composed of the object properties predicate returns falsey for.
   * 
   * @param object - The source object
   * @param predicate - The function invoked per property
   * @returns The new object
   * 
   * @example
   * ```ts
   * const object = { 'a': 1, 'b': 2, 'c': 3 };
   * 
   * omitBy(object, (value) => value >= 2);
   * // => { 'a': 1 }
   * ```
   */
  export function omitBy<T extends object>(
	object: T,
	predicate: (value: T[keyof T], key: string) => boolean
  ): Partial<T> {
	if (!object) {
	  return {};
	}
	
	const result: Partial<T> = {};
	
	for (const key in object) {
	  if (Object.prototype.hasOwnProperty.call(object, key)) {
		const value = object[key];
		if (!predicate(value, key)) {
		  result[key as keyof T] = value;
		}
	  }
	}
	
	return result;
  }