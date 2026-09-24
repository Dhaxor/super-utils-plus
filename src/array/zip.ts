import { set } from '../object/set.js';
import { assignOwnKey } from '../internal/path.js';

/**
 * Creates an array of grouped elements, the first of which contains the
 * first elements of the given arrays, the second of which contains the
 * second elements of the given arrays, and so on.
 *
 * @param arrays - The arrays to process
 * @returns The new array of grouped elements
 *
 * @example
 * ```ts
 * zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 * ```
 */
export function zip<T>(...arrays: T[][]): T[][] {
  if (!arrays.length) {
    return [];
  }

  // Find the length of the longest array
  const maxLength = Math.max(...arrays.map(arr => (arr ? arr.length : 0)));

  const result: T[][] = [];

  // For each position, create an array of elements at that position
  for (let i = 0; i < maxLength; i++) {
    result.push(arrays.map(arr => arr[i]));
  }

  return result;
}

/**
 * This method is like zip except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @param array - The array of grouped elements to process
 * @returns The new array of regrouped elements
 *
 * @example
 * ```ts
 * const zipped = zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 *
 * unzip(zipped);
 * // => [['a', 'b'], [1, 2], [true, false]]
 * ```
 */
export function unzip<T>(array: T[][]): T[][] {
  if (!array || !array.length) {
    return [];
  }

  // Use zip with spread array
  return zip(...array);
}

/**
 * This method is like unzip except that it accepts an iteratee to specify
 * how regrouped values should be combined. The iteratee is invoked with four
 * arguments: (accumulator, value, index, group).
 *
 * @param array - The array of grouped elements to process
 * @param iteratee - The function to combine regrouped values
 * @returns The new array of regrouped elements
 *
 * @example
 * ```ts
 * const zipped = zip([1, 2], [10, 20], [100, 200]);
 * // => [[1, 10, 100], [2, 20, 200]]
 *
 * unzipWith(zipped, _.add);
 * // => [3, 30, 300]
 * ```
 */
export function unzipWith<T, R>(array: T[][], iteratee: (...values: T[]) => R): R[] {
  if (!array || !array.length) {
    return [];
  }

  // First unzip the array
  const results = unzip(array);

  // Then apply the iteratee to each group
  return results.map(group => iteratee(...group));
}

/**
 * Creates an object composed from arrays of property names and values.
 *
 * @param props - The property identifiers
 * @param values - The property values
 * @returns The new object
 *
 * @example
 * ```ts
 * zipObject(['a', 'b'], [1, 2]);
 * // => { 'a': 1, 'b': 2 }
 * ```
 */
export function zipObject<T = any>(
  props: Array<string | number | symbol>,
  values: T[]
): Record<string | number | symbol, T> {
  if (!props || !props.length || !values) {
    return {} as Record<string | number | symbol, T>;
  }

  const result: Record<string | number | symbol, T> = {};

  for (let i = 0; i < props.length; i++) {
    if (i < values.length) {
      assignOwnKey(result, props[i], values[i]);
    }
  }

  return result;
}

/**
 * This method is like zipObject except that it supports property paths.
 * Paths containing `__proto__`, `constructor`, or `prototype` are ignored.
 *
 * @param paths - The property paths
 * @param values - The property values
 * @returns The new object
 *
 * @example
 * ```ts
 * zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
 * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
 * ```
 */
export function zipObjectDeep<T = any>(paths: string[], values: T[]): Record<string, any> {
  if (!paths || !paths.length || !values) {
    return {};
  }

  const result: Record<string, any> = {};

  for (let i = 0; i < paths.length && i < values.length; i++) {
    set(result, paths[i], values[i]);
  }

  return result;
}

/**
 * This method is like zip except that it accepts an iteratee to specify
 * how grouped values should be combined. The iteratee is invoked with the
 * elements of each group.
 *
 * @param arrays - The arrays to process
 * @param iteratee - The function to combine grouped values
 * @returns The new array of grouped elements
 *
 * @example
 * ```ts
 * zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
 *   return a + b + c;
 * });
 * // => [111, 222]
 * ```
 */
export function zipWith<T, R>(...args: [...arrays: T[][], iteratee: (...values: T[]) => R]): R[] {
  if (args.length < 2) {
    return [] as R[];
  }

  // Get the iteratee function from the last argument
  const iteratee = args.pop() as (...values: T[]) => R;

  // Zip the arrays
  const zipped = zip(...(args as T[][]));

  // Apply the iteratee to each group
  return zipped.map(group => iteratee(...group));
}
