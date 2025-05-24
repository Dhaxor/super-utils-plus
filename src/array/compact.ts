import { isNil } from '../utils/is';

/**
 * Creates an array with all falsy values removed.
 * Falsy values are false, null, 0, "", undefined, and NaN.
 * 
 * @param array - The array to compact
 * @returns The new array of filtered values
 * 
 * @example
 * ```ts
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN]);
 * // => [1, 2, 3]
 * ```
 */
export function compact<T>(array: T[]): T[] {
  if (!array || !array.length) {
    return [];
  }
  
  return array.filter(Boolean);
}

/**
 * Creates an array with all null and undefined values removed.
 * Unlike compact, this preserves other falsy values like 0, '', and false.
 * 
 * @param array - The array to compact
 * @returns The new array of filtered values
 * 
 * @example
 * ```ts
 * compactNil([0, 1, false, 2, '', 3, null, undefined, NaN]);
 * // => [0, 1, false, 2, '', 3, NaN]
 * ```
 */
export function compactNil<T>(array: T[]): NonNullable<T>[] {
  if (!array || !array.length) {
    return [];
  }
  
  return array.filter(item => !isNil(item)) as NonNullable<T>[];
}