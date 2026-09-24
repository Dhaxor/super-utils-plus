import { isEqual } from '../utils/is.js';
import { ValueIteratee } from '../utils/types.js';
import { toValueIteratee } from '../internal/iteratee.js';

/**
 * Creates an array of array values not included in the other given arrays,
 * using SameValueZero for equality comparisons.
 *
 * @param array - The array to inspect
 * @param values - The arrays of values to exclude
 * @returns The new array of filtered values
 *
 * @example
 * ```ts
 * difference([2, 1], [2, 3]);
 * // => [1]
 * ```
 */
export function difference<T>(array: T[], ...values: T[][]): T[] {
  if (!array || !array.length) {
    return [];
  }

  const excludeSet = new Set(values.flat());
  return array.filter(item => !excludeSet.has(item));
}

/**
 * Creates an array of array values not included in the other given arrays
 * using deep equality comparison.
 *
 * @param array - The array to inspect
 * @param values - The arrays of values to exclude
 * @returns The new array of filtered values
 *
 * @example
 * ```ts
 * differenceDeep([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }]);
 * // => [{ 'x': 2 }]
 * ```
 */
export function differenceDeep<T>(array: T[], ...values: T[][]): T[] {
  if (!array || !array.length) {
    return [];
  }

  const excludeValues = values.flat();

  return array.filter(item => !excludeValues.some(excludeItem => isEqual(item, excludeItem)));
}

/**
 * Creates an array of array values not included in the other given arrays
 * using an iteratee (a function or property name) to derive the comparison
 * key for each element. Keys are compared with SameValueZero.
 *
 * @param array - The array to inspect
 * @param iteratee - The function or property name used to derive comparison keys
 * @param values - The arrays of values to exclude
 * @returns The new array of filtered values
 *
 * @example
 * ```ts
 * differenceBy([2.1, 1.2], Math.floor, [2.3, 3.4]);
 * // => [1.2]
 *
 * differenceBy([{ 'x': 2 }, { 'x': 1 }], 'x', [{ 'x': 1 }]);
 * // => [{ 'x': 2 }]
 * ```
 */
export function differenceBy<T, K = T>(
  array: T[],
  iteratee: ValueIteratee<T, K>,
  ...values: T[][]
): T[] {
  if (!array || !array.length) {
    return [];
  }

  const iterateeFn = toValueIteratee(iteratee);
  const excludeKeys = new Set(values.flat().map(item => iterateeFn(item)));

  return array.filter(item => !excludeKeys.has(iterateeFn(item)));
}
