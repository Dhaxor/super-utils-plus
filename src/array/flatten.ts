import { isArray } from '../utils/is';

/**
 * Flattens array a single level deep.
 * 
 * @param array - The array to flatten
 * @returns The new flattened array
 * 
 * @example
 * ```ts
 * flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 * ```
 */
export function flatten<T>(array: Array<T | T[]>): T[] {
  if (!array || !array.length) {
    return [];
  }
  
  return array.reduce<T[]>((result, item) => {
    if (isArray(item)) {
      return result.concat(item as T[]);
    }
    result.push(item as T);
    return result;
  }, []);
}

/**
 * Recursively flattens array.
 * 
 * @param array - The array to flatten
 * @returns The new flattened array
 * 
 * @example
 * ```ts
 * flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 * ```
 */
export function flattenDeep<T>(array: any[]): T[] {
  if (!array || !array.length) {
    return [];
  }
  
  return array.reduce<T[]>((result, item) => {
    if (isArray(item)) {
      return result.concat(flattenDeep(item));
    }
    result.push(item);
    return result;
  }, []);
}