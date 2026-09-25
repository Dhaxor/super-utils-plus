import { isFunction, isNil } from '../utils/is.js';
import { PropertyPath } from '../utils/types.js';
import { toPath } from '../internal/path.js';

/**
 * Resolves the value at path of object. If the resolved value is a function
 * it's invoked with the `this` binding of its parent object. If the resolved
 * value is undefined and `defaultValue` is a function, it's invoked and its
 * result returned.
 *
 * @param object - The object to query
 * @param path - The path of the property to resolve
 * @param defaultValue - The value returned for undefined resolved values
 * @returns The resolved value
 *
 * @example
 * ```ts
 * const object = { 'a': [{ 'b': { 'c1': 3, 'c2': () => 4 } }] };
 *
 * result(object, 'a[0].b.c1');
 * // => 3
 *
 * result(object, 'a[0].b.c2');
 * // => 4
 *
 * result(object, 'a[0].b.c3', 'default');
 * // => 'default'
 *
 * result(object, 'a[0].b.c3', () => 'default');
 * // => 'default'
 * ```
 */
export function result<T = any>(object: any, path: PropertyPath, defaultValue?: T): T | undefined {
  if (isNil(object)) {
    return resolveDefaultValue(defaultValue, undefined);
  }

  const segments = toPath(path);

  if (!segments.length) {
    return object;
  }

  let current = object;
  let parent: any = object;

  for (const segment of segments) {
    if (isNil(current)) {
      return resolveDefaultValue(defaultValue, parent);
    }

    parent = current;
    current = current[segment];
  }

  if (current === undefined) {
    return resolveDefaultValue(defaultValue, parent);
  }

  return isFunction(current) ? current.call(parent) : current;
}

function resolveDefaultValue<T>(value: T, thisArg: any): T {
  return isFunction(value) ? value.call(thisArg) : value;
}
