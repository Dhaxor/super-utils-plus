import { PredicateShorthand } from '../utils/types.js';
import { toPredicate } from '../internal/iteratee.js';

/**
 * Iterates over elements of collection, returning the first element
 * predicate returns truthy for.
 *
 * @param collection - The collection to inspect
 * @param predicate - The function invoked per iteration
 * @param fromIndex - The index to search from
 * @returns The matched element, else undefined
 *
 * @example
 * ```ts
 * const users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * find(users, 'active');
 * // => object for 'barney'
 * ```
 */
export function find<T>(
  collection: T[],
  predicate: PredicateShorthand<T>,
  fromIndex = 0
): T | undefined {
  const index = findIndex(collection, predicate, fromIndex);
  return index === -1 ? undefined : collection[index];
}

/**
 * This method is like find except that it iterates over elements of
 * collection from right to left.
 *
 * @param collection - The collection to inspect
 * @param predicate - The function invoked per iteration
 * @param fromIndex - The index to search from
 * @returns The matched element, else undefined
 *
 * @example
 * ```ts
 * findLast([1, 2, 3, 4], function(n) {
 *   return n % 2 === 1;
 * });
 * // => 3
 * ```
 */
export function findLast<T>(
  collection: T[],
  predicate: PredicateShorthand<T>,
  fromIndex?: number
): T | undefined {
  const index = findLastIndex(collection, predicate, fromIndex);
  return index === -1 ? undefined : collection[index];
}

/**
 * This method is like find except that it returns the index of the first
 * element predicate returns truthy for, instead of the element itself.
 *
 * @param array - The array to inspect
 * @param predicate - The function invoked per iteration
 * @param fromIndex - The index to search from
 * @returns The index of the found element, else -1
 *
 * @example
 * ```ts
 * const users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * findIndex(users, function(o) { return o.user === 'barney'; });
 * // => 0
 * ```
 */
export function findIndex<T>(array: T[], predicate: PredicateShorthand<T>, fromIndex = 0): number {
  if (!array || !array.length) {
    return -1;
  }

  const predicateFn = toPredicate(predicate);
  const startIndex = Math.max(0, fromIndex);

  for (let i = startIndex; i < array.length; i++) {
    if (predicateFn(array[i], i, array)) {
      return i;
    }
  }

  return -1;
}

/**
 * This method is like findIndex except that it iterates over elements
 * of collection from right to left.
 *
 * @param array - The array to inspect
 * @param predicate - The function invoked per iteration
 * @param fromIndex - The index to search from
 * @returns The index of the found element, else -1
 *
 * @example
 * ```ts
 * const users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * findLastIndex(users, function(o) { return o.user === 'pebbles'; });
 * // => 2
 * ```
 */
export function findLastIndex<T>(
  array: T[],
  predicate: PredicateShorthand<T>,
  fromIndex?: number
): number {
  if (!array || !array.length) {
    return -1;
  }

  const predicateFn = toPredicate(predicate);
  const startIndex =
    fromIndex !== undefined ? Math.min(fromIndex, array.length - 1) : array.length - 1;

  for (let i = startIndex; i >= 0; i--) {
    if (predicateFn(array[i], i, array)) {
      return i;
    }
  }

  return -1;
}
