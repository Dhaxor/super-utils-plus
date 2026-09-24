/**
 * Creates a slice of array with n elements taken from the beginning.
 *
 * @param array - The array to query
 * @param n - The number of elements to take
 * @returns The slice of array
 *
 * @example
 * ```ts
 * take([1, 2, 3]);
 * // => [1]
 *
 * take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * take([1, 2, 3], 0);
 * // => []
 * ```
 */
export function take<T>(array: T[], n = 1): T[] {
  if (!array || !array.length || n <= 0) {
    return [];
  }

  return array.slice(0, n);
}

/**
 * Creates a slice of array with n elements taken from the end.
 *
 * @param array - The array to query
 * @param n - The number of elements to take
 * @returns The slice of array
 *
 * @example
 * ```ts
 * takeRight([1, 2, 3]);
 * // => [3]
 *
 * takeRight([1, 2, 3], 2);
 * // => [2, 3]
 *
 * takeRight([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * takeRight([1, 2, 3], 0);
 * // => []
 * ```
 */
export function takeRight<T>(array: T[], n = 1): T[] {
  if (!array || !array.length || n <= 0) {
    return [];
  }

  const length = array.length;
  return array.slice(Math.max(0, length - n), length);
}

/**
 * Creates a slice of array with elements taken from the beginning.
 * Elements are taken until predicate returns falsey.
 *
 * @param array - The array to query
 * @param predicate - The function invoked per iteration
 * @returns The slice of array
 *
 * @example
 * ```ts
 * const users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * takeWhile(users, function(o) { return !o.active; });
 * // => objects for ['barney', 'fred']
 * ```
 */
export function takeWhile<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T[] {
  if (!array || !array.length) {
    return [];
  }

  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (!predicate(value, i, array)) {
      break;
    }
    result.push(value);
  }

  return result;
}

/**
 * Creates a slice of array with elements taken from the end.
 * Elements are taken until predicate returns falsey.
 *
 * @param array - The array to query
 * @param predicate - The function invoked per iteration
 * @returns The slice of array
 *
 * @example
 * ```ts
 * const users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * takeRightWhile(users, function(o) { return !o.active; });
 * // => objects for ['fred', 'pebbles']
 * ```
 */
export function takeRightWhile<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T[] {
  if (!array || !array.length) {
    return [];
  }

  const result: T[] = [];

  for (let i = array.length - 1; i >= 0; i--) {
    const value = array[i];
    if (!predicate(value, i, array)) {
      break;
    }
    result.unshift(value);
  }

  return result;
}
