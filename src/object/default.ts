import { isObject } from '../utils/is.js';
import { assignOwnKey, isUnsafeKey } from '../internal/path.js';
import { deepClone } from './deepClone.js';

/**
 * Creates a new object from `object` and assigns own and inherited enumerable
 * string keyed properties of source objects for all properties that resolve to
 * undefined. Source objects are applied from left to right. Once a property is
 * set, additional values of the same property are ignored.
 *
 * Neither `object` nor the sources are mutated.
 *
 * @param object - The destination object
 * @param sources - The source objects
 * @returns The new object
 *
 * @example
 * ```ts
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 * ```
 */
export function defaults<T extends object>(object: T, ...sources: Array<Partial<T>>): T {
  if (!isObject(object)) {
    return object;
  }

  const result = { ...object };

  for (const source of sources) {
    if (isObject(source)) {
      for (const key in source) {
        if (!isUnsafeKey(key) && (result as any)[key] === undefined) {
          (result as any)[key] = (source as any)[key];
        }
      }
    }
  }

  return result;
}

/**
 * This method is like `defaults` except that it recursively assigns default
 * properties into nested plain objects.
 *
 * Neither `object` nor the sources are mutated: the result is a deep clone of
 * `object` with defaults filled in, and values copied from sources are cloned.
 *
 * @param object - The destination object
 * @param sources - The source objects
 * @returns The new object
 *
 * @example
 * ```ts
 * defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
 * // => { 'a': { 'b': 2, 'c': 3 } }
 * ```
 */
export function defaultsDeep<T extends object>(object: T, ...sources: Array<Partial<T>>): T {
  if (!isObject(object)) {
    return object;
  }

  const result = deepClone(object);

  for (const source of sources) {
    if (isObject(source)) {
      applyDefaults(result as Record<string, any>, source as Record<string, any>);
    }
  }

  return result;
}

function applyDefaults(target: Record<string, any>, source: Record<string, any>): void {
  // Own and inherited enumerable keys, like `defaults`
  for (const key in source) {
    if (isUnsafeKey(key)) {
      continue;
    }

    const targetValue = target[key];
    const sourceValue = source[key];

    if (targetValue === undefined) {
      assignOwnKey(target, key, deepClone(sourceValue));
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      applyDefaults(targetValue, sourceValue);
    }
    // Otherwise keep the existing value
  }
}
