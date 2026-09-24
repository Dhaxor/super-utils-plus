import { isObject, isNil } from '../utils/is.js';

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to undefined. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * @param object - The destination object
 * @param sources - The source objects
 * @returns The destination object
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
        if ((result as any)[key] === undefined) {
          (result as any)[key] = (source as any)[key];
        }
      }
    }
  }

  return result;
}

/**
 * This method is like defaults except that it recursively assigns
 * default properties.
 *
 * @param object - The destination object
 * @param sources - The source objects
 * @returns The destination object
 *
 * @example
 * ```ts
 * defaults({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
 * // => { 'a': { 'b': 2, 'c': 3 } }
 * ```
 */
export function defaultsDeep<T extends object>(object: T, ...sources: Array<Partial<T>>): T {
  if (!isObject(object)) {
    return object;
  }

  const result = { ...object };

  for (const source of sources) {
    if (isObject(source)) {
      recursiveDefaults(result, source);
    }
  }

  return result;
}

/**
 * Helper function for recursive defaults assignment.
 */
function recursiveDefaults(object: Record<string, any>, source: Record<string, any>): void {
  for (const key in source) {
    const objValue = object[key];
    const srcValue = source[key];

    // Skip non-own properties
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue;
    }

    // If property doesn't exist in object, assign it
    if (isNil(objValue)) {
      object[key] = srcValue;
    }
    // If both are objects, recurse
    else if (isObject(objValue) && isObject(srcValue)) {
      recursiveDefaults(objValue, srcValue);
    }
    // Otherwise keep the existing value
  }
}
