import { isObject, isArray } from '../utils/is.js';

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
export function filter<T>(
  collection: T[],
  predicate:
    | ((value: T, index: number, collection: T[]) => boolean)
    | Record<string, any>
    | string
    | [string, any]
): T[] {
  if (!collection || !collection.length) {
    return [];
  }

  // Convert predicate to a function if it's not already one
  let predicateFn: (value: T, index: number, collection: T[]) => boolean;

  if (typeof predicate === 'function') {
    // Function predicate
    predicateFn = predicate as (value: T, index: number, collection: T[]) => boolean;
  } else if (isArray(predicate) && predicate.length === 2) {
    // Property and value pair
    const [prop, value] = predicate as [string, any];
    predicateFn = (item: T) => {
      return isObject(item) && (item as any)[prop] === value;
    };
  } else if (isObject(predicate)) {
    // Object matching
    predicateFn = (item: T) => {
      if (!isObject(item)) return false;

      const objItem = item as Record<string, any>;
      const objPred = predicate as Record<string, any>;

      for (const key in objPred) {
        if (objItem[key] !== objPred[key]) {
          return false;
        }
      }

      return true;
    };
  } else if (typeof predicate === 'string') {
    // Property name
    const prop = predicate;
    predicateFn = (item: T) => {
      return isObject(item) && Boolean((item as any)[prop]);
    };
  } else {
    // Default to identity function
    predicateFn = Boolean as any;
  }

  return collection.filter(predicateFn);
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
export function reject<T>(
  collection: T[],
  predicate:
    | ((value: T, index: number, collection: T[]) => boolean)
    | Record<string, any>
    | string
    | [string, any]
): T[] {
  // Reuse filter but negate the predicate
  const filterPredicate =
    typeof predicate === 'function'
      ? (value: T, index: number, collection: T[]) => !predicate(value, index, collection)
      : (value: T) => !filter([value], predicate).length;

  return filter(collection, filterPredicate);
}
