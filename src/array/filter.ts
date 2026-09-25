import { PredicateShorthand } from '../utils/types.js';
import { toPredicate } from '../internal/iteratee.js';

/**
 * Iterates over elements of collection, returning an array of all elements
 * the predicate returns truthy for.
 *
 * @param collection - The collection to iterate over
 * @param predicate - The function invoked per iteration
 * @returns The new filtered array
 *
 * @example
 * ```ts
 * const users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * filter(users, 'active');
 * // => objects for ['barney']
 * ```
 */
export function filter<T>(collection: T[], predicate: PredicateShorthand<T>): T[] {
  if (!collection || !collection.length) {
    return [];
  }

  return collection.filter(toPredicate(predicate));
}

/**
 * The opposite of filter; this method returns the elements of collection
 * that predicate does NOT return truthy for.
 *
 * @param collection - The collection to iterate over
 * @param predicate - The function invoked per iteration
 * @returns The new filtered array
 *
 * @example
 * ```ts
 * const users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': true }
 * ];
 *
 * reject(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 * ```
 */
export function reject<T>(collection: T[], predicate: PredicateShorthand<T>): T[] {
  if (!collection || !collection.length) {
    return [];
  }

  const predicateFn = toPredicate(predicate);
  return collection.filter((value, index, array) => !predicateFn(value, index, array));
}
