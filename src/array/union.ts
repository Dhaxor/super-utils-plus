import { isEqual } from '../utils/is.js';
import { ValueIteratee } from '../utils/types.js';
import { toValueIteratee } from '../internal/iteratee.js';

/**
 * Creates an array of unique values, in order, from all given arrays,
 * using SameValueZero for equality comparisons.
 *
 * @param arrays - The arrays to inspect
 * @returns The new array of combined unique values
 *
 * @example
 * ```ts
 * union([2], [1, 2]);
 * // => [2, 1]
 * ```
 */
export function union<T>(...arrays: T[][]): T[] {
  if (!arrays.length) {
    return [];
  }

  return [...new Set(arrays.flat())];
}

/**
 * Creates an array of unique values, in order, from all given arrays
 * using deep equality comparison.
 *
 * @param arrays - The arrays to inspect
 * @returns The new array of combined unique values
 *
 * @example
 * ```ts
 * unionDeep([{ 'x': 1 }], [{ 'x': 1 }, { 'x': 2 }]);
 * // => [{ 'x': 1 }, { 'x': 2 }]
 * ```
 */
export function unionDeep<T>(...arrays: T[][]): T[] {
  if (!arrays.length) {
    return [];
  }

  const result: T[] = [];

  for (const item of arrays.flat()) {
    if (!result.some(resultItem => isEqual(resultItem, item))) {
      result.push(item);
    }
  }

  return result;
}

/**
 * Creates an array of unique values, in order, from all given arrays
 * using an iteratee (a function or property name) to derive the comparison
 * key for each element. Keys are compared with SameValueZero.
 *
 * @param arrays - The arrays to inspect, with the last argument being the iteratee
 * @returns The new array of combined unique values
 *
 * @example
 * ```ts
 * unionBy([2.1], [1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 * ```
 */
export function unionBy<T, K = T>(...arrays: [...T[][], ValueIteratee<T, K>]): T[] {
  if (arrays.length <= 1) {
    return [];
  }

  const iterateeFn = toValueIteratee(arrays[arrays.length - 1] as ValueIteratee<T, K>);
  const flattened = (arrays.slice(0, -1) as T[][]).flat();
  const result: T[] = [];
  const seen = new Set<K>();

  for (const item of flattened) {
    const key = iterateeFn(item);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}
