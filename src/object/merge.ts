import { isArray, isObject, isPlainObject } from '../utils/is.js';
import { DeepPartial } from '../utils/types.js';
import { isUnsafeKey } from '../internal/path.js';
import { deepClone } from './deepClone.js';

/**
 * Recursively merges own enumerable string keyed properties of source objects
 * into the destination object. Source properties that resolve to undefined are
 * skipped. Array and plain object source values are merged recursively into an
 * existing array or object; other source values (including Dates, Maps, and class
 * instances) are assigned as-is. Plain object and array source values that cannot
 * be merged into an existing value are deep cloned rather than shared by reference.
 *
 * The destination object is mutated and returned. Keys named `__proto__`,
 * `constructor`, or `prototype` are ignored so that untrusted input cannot
 * modify `Object.prototype`.
 *
 * @param object - The destination object
 * @param sources - The source objects
 * @returns The destination object
 *
 * @example
 * ```ts
 * const object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * const other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 * ```
 */
export function merge<T extends object>(object: T, ...sources: Array<DeepPartial<T>>): T {
  if (!isObject(object)) {
    return object;
  }

  for (const source of sources) {
    if (isObject(source)) {
      mergeInto(object as Record<string, any>, source as Record<string, any>);
    }
  }

  return object;
}

function mergeInto(target: Record<string, any>, source: Record<string, any>): void {
  for (const key of Object.keys(source)) {
    if (isUnsafeKey(key)) {
      continue;
    }

    const srcValue = source[key];

    // Skip undefined values
    if (srcValue === undefined) {
      continue;
    }

    target[key] = mergeValue(target[key], srcValue);
  }
}

function mergeValue(objValue: any, srcValue: any): any {
  if (isArray(srcValue)) {
    return isArray(objValue) ? mergeArrays(objValue, srcValue) : deepClone(srcValue);
  }

  if (isPlainObject(srcValue)) {
    // Merge into any existing object (plain object, class instance, Map, ...)
    if (isObject(objValue)) {
      mergeInto(objValue, srcValue);
      return objValue;
    }
    return deepClone(srcValue);
  }

  // Dates, Maps, class instances, primitives, functions: assign as-is
  return srcValue;
}

/**
 * Merges two arrays by index, recursively merging values at the same position.
 * The first array is mutated and returned.
 */
function mergeArrays(target: any[], source: any[]): any[] {
  for (let i = 0; i < source.length; i++) {
    const srcValue = source[i];

    if (i >= target.length) {
      target.push(mergeValue(undefined, srcValue));
    } else if (srcValue !== undefined) {
      target[i] = mergeValue(target[i], srcValue);
    }
  }

  return target;
}
