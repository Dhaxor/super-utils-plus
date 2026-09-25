import { isNil } from '../utils/is.js';
import { PropertyPath } from '../utils/types.js';
import { toPath } from '../internal/path.js';

/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned.
 *
 * @param object - The object to query
 * @param path - The path of the property to get
 * @param defaultValue - The value returned for undefined resolved values
 * @returns The resolved value
 *
 * @example
 * ```ts
 * const object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * get(object, 'a[0].b.c');
 * // => 3
 *
 * get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * get(object, 'a.b.c', 'default');
 * // => 'default'
 * ```
 */
export function get<T = any>(object: any, path: PropertyPath, defaultValue?: T): T | undefined {
  if (isNil(object)) {
    return defaultValue;
  }

  const segments = toPath(path);
  let result = object;

  for (let i = 0; i < segments.length; i++) {
    if (isNil(result)) {
      return defaultValue;
    }

    result = result[segments[i]];
  }

  return result === undefined ? defaultValue : (result as T);
}
