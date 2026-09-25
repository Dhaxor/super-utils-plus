/**
 * Creates a slice of array with n elements dropped from the beginning.
 *
 * @param array - The array to query
 * @param n - The number of elements to drop
 * @returns The slice of array
 *
 * @example
 * ```ts
 * drop([1, 2, 3]);
 * // => [2, 3]
 *
 * drop([1, 2, 3], 2);
 * // => [3]
 *
 * drop([1, 2, 3], 5);
 * // => []
 *
 * drop([1, 2, 3], 0);
 * // => [1, 2, 3]
 * ```
 */
export function drop<T>(array: T[], n = 1): T[] {
  if (!array || !array.length) {
    return [];
  }

  const length = array.length;
  if (n >= length) {
    return [];
  }

  return array.slice(Math.max(0, n));
}

/**
 * Creates a slice of array with n elements dropped from the end.
 *
 * @param array - The array to query
 * @param n - The number of elements to drop
 * @returns The slice of array
 *
 * @example
 * ```ts
 * dropRight([1, 2, 3]);
 * // => [1, 2]
 *
 * dropRight([1, 2, 3], 2);
 * // => [1]
 *
 * dropRight([1, 2, 3], 5);
 * // => []
 *
 * dropRight([1, 2, 3], 0);
 * // => [1, 2, 3]
 * ```
 */
export function dropRight<T>(array: T[], n = 1): T[] {
  if (!array || !array.length) {
    return [];
  }

  const length = array.length;
  if (n >= length) {
    return [];
  }

  return array.slice(0, length - n);
}

/**
 * Creates a slice of array excluding elements dropped from the beginning.
 * Elements are dropped until predicate returns falsey.
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
 * dropWhile(users, function(o) { return !o.active; });
 * // => objects for ['pebbles']
 *
 * // The `_.matches` iteratee shorthand.
 * dropWhile(users, { 'user': 'barney', 'active': false });
 * // => objects for ['fred', 'pebbles']
 * ```
 */
export function dropWhile<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T[] {
  if (!array || !array.length) {
    return [];
  }

  let index = 0;
  while (index < array.length && predicate(array[index], index, array)) {
    index++;
  }

  return array.slice(index);
}

/**
 * Creates a slice of array excluding elements dropped from the end.
 * Elements are dropped until predicate returns falsey.
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
 * dropRightWhile(users, function(o) { return !o.active; });
 * // => objects for ['barney']
 * ```
 */
export function dropRightWhile<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T[] {
  if (!array || !array.length) {
    return [];
  }

  let index = array.length - 1;
  while (index >= 0 && predicate(array[index], index, array)) {
    index--;
  }

  return array.slice(0, index + 1);
}
