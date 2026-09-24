import { isNil } from '../utils/is.js';
import { PropertyPath } from '../utils/types.js';
import { hasUnsafeKey, isIndexSegment, toPath } from '../internal/path.js';

/**
 * Sets the value at path of object. If a portion of path doesn't exist, it's created.
 * Arrays are created for missing index properties while objects are created for all
 * other missing properties.
 *
 * Paths containing `__proto__`, `constructor`, or `prototype` are ignored so that
 * untrusted paths cannot modify `Object.prototype`.
 *
 * @param object - The object to modify
 * @param path - The path of the property to set
 * @param value - The value to set
 * @returns The modified object
 *
 * @example
 * ```ts
 * const object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * set(object, 'a[0].b.c', 4);
 * // => { 'a': [{ 'b': { 'c': 4 } }] }
 *
 * set(object, ['x', '0', 'y', 'z'], 5);
 * // => { 'a': [{ 'b': { 'c': 4 } }], 'x': [{ 'y': { 'z': 5 } }] }
 * ```
 */
export function set<T extends object, V>(object: T, path: PropertyPath, value: V): T {
  if (isNil(object)) {
    return object;
  }

  const segments = toPath(path);

  if (!segments.length || hasUnsafeKey(segments)) {
    return object;
  }

  const lastIndex = segments.length - 1;
  let current: any = object;

  for (let i = 0; i < lastIndex; i++) {
    const segment = segments[i];
    let child = current[segment];

    // Create (or replace a primitive with) the container the next segment needs
    if (child === null || typeof child !== 'object') {
      child = isIndexSegment(segments[i + 1]) ? [] : {};
      current[segment] = child;
    }

    current = child;
  }

  current[segments[lastIndex]] = value;

  return object;
}
