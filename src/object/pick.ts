/**
 * Creates an object composed of the picked object properties.
 * 
 * @param object - The source object
 * @param paths - The property paths to pick
 * @returns The new object
 * 
 * @example
 * ```ts
 * const object = { 'a': 1, 'b': 2, 'c': 3 };
 * 
 * pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 * ```
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  paths: K[] | string[]
): Pick<T, K> {
  if (!object || !paths.length) {
    return {} as Pick<T, K>;
  }
  
  const result = {} as Pick<T, K>;
  
  for (const path of paths) {
    if (Object.prototype.hasOwnProperty.call(object, path)) {
      result[path as K] = object[path as K];
    }
  }
  
  return result;
}

/**
 * Creates an object composed of the object properties predicate returns truthy for.
 * 
 * @param object - The source object
 * @param predicate - The function invoked per property
 * @returns The new object
 * 
 * @example
 * ```ts
 * const object = { 'a': 1, 'b': 2, 'c': 3 };
 * 
 * pickBy(object, (value) => value < 3);
 * // => { 'a': 1, 'b': 2 }
 * ```
 */
export function pickBy<T extends object>(
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
      if (predicate(value, key)) {
        result[key as keyof T] = value;
      }
    }
  }
  
  return result;
}