import { isEqual } from '../utils/is.js';
import { ValueIteratee } from '../utils/types.js';
import { toValueIteratee } from '../internal/iteratee.js';

/**
 * Creates an array of unique values that are included in all given arrays,
 * using SameValueZero for equality comparisons. The order of result values is
 * determined by the first array.
 *
 * @param arrays - The arrays to inspect
 * @returns The new array of intersecting values
 *
 * @example
 * ```ts
 * intersection([2, 1], [2, 3]);
 * // => [2]
 * ```
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (!arrays.length) {
    return [];
  }

  const [first, ...rest] = arrays;
  const uniqueFirst = [...new Set(first)];

  if (!rest.length) {
    return uniqueFirst;
  }

  const sets = rest.map(array => new Set(array));
  return uniqueFirst.filter(item => sets.every(set => set.has(item)));
}

/**
 * Creates an array of unique values that are included in all given arrays
 * using deep equality comparison.
 *
 * @param arrays - The arrays to inspect
 * @returns The new array of intersecting values
 *
 * @example
 * ```ts
 * intersectionDeep([{ 'x': 1 }, { 'x': 2 }], [{ 'x': 1 }, { 'x': 3 }]);
 * // => [{ 'x': 1 }]
 * ```
 */
export function intersectionDeep<T>(...arrays: T[][]): T[] {
  if (!arrays.length) {
    return [];
  }

  const [first, ...rest] = arrays;

  // Unique values of the first array, by deep equality
  const uniqueFirst: T[] = [];
  for (const item of first) {
    if (!uniqueFirst.some(uniqueItem => isEqual(uniqueItem, item))) {
      uniqueFirst.push(item);
    }
  }

  return uniqueFirst.filter(item =>
    rest.every(array => array.some(arrayItem => isEqual(arrayItem, item)))
  );
}

/**
 * Creates an array of unique values that are included in all given arrays
 * using an iteratee (a function or property name) to derive the comparison
 * key for each element. Keys are compared with SameValueZero.
 *
 * @param arrays - The arrays to inspect, with the last argument being the iteratee
 * @returns The new array of intersecting values
 *
 * @example
 * ```ts
 * intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [2.1]
 *
 * intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }]
 * ```
 */
export function intersectionBy<T, K = T>(...arrays: [...T[][], ValueIteratee<T, K>]): T[] {
  if (arrays.length <= 1) {
    return [];
  }

  const iterateeFn = toValueIteratee(arrays[arrays.length - 1] as ValueIteratee<T, K>);
  const [first, ...rest] = arrays.slice(0, -1) as T[][];

  const keySets = rest.map(array => new Set(array.map(item => iterateeFn(item))));
  const seen = new Set<K>();
  const result: T[] = [];

  for (const item of first) {
    const key = iterateeFn(item);

    if (!seen.has(key) && keySets.every(set => set.has(key))) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}
