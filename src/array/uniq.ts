import { isEqual } from '../utils/is.js';
import { ValueIteratee } from '../utils/types.js';
import { toValueIteratee } from '../internal/iteratee.js';

/**
 * Creates a duplicate-free version of an array, using SameValueZero for equality comparisons.
 *
 * @param array - The array to inspect
 * @returns The new duplicate-free array
 *
 * @example
 * ```ts
 * uniq([2, 1, 2]);
 * // => [2, 1]
 * ```
 */
export function uniq<T>(array: T[]): T[] {
  if (!array || !array.length) {
    return [];
  }

  return [...new Set(array)];
}

/**
 * Creates a duplicate-free version of an array using deep equality comparisons.
 *
 * @param array - The array to inspect
 * @returns The new duplicate-free array
 *
 * @example
 * ```ts
 * uniqDeep([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }]);
 * // => [{ 'x': 1 }, { 'x': 2 }]
 * ```
 */
export function uniqDeep<T>(array: T[]): T[] {
  if (!array || !array.length) {
    return [];
  }

  const result: T[] = [];

  for (const item of array) {
    if (!result.some(resultItem => isEqual(resultItem, item))) {
      result.push(item);
    }
  }

  return result;
}

/**
 * Creates a duplicate-free version of an array using an iteratee (a function
 * or property name) to derive the comparison key for each element. Keys are
 * compared with SameValueZero.
 *
 * @param array - The array to inspect
 * @param iteratee - The function invoked per element or property name
 * @returns The new duplicate-free array
 *
 * @example
 * ```ts
 * uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 * ```
 */
export function uniqBy<T, K = T>(array: T[], iteratee: ValueIteratee<T, K>): T[] {
  if (!array || !array.length) {
    return [];
  }

  const iterateeFn = toValueIteratee(iteratee);
  const result: T[] = [];
  const seen = new Set<K>();

  for (const item of array) {
    const key = iterateeFn(item);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}
