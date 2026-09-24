/**
 * Iterates over elements of collection and invokes iteratee for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning false.
 *
 * @param collection - The collection to iterate over
 * @param iteratee - The function invoked per iteration
 * @returns The collection
 *
 * @example
 * ```ts
 * forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 * ```
 */
export function forEach<T>(
  collection: T[],
  iteratee: (value: T, index: number, collection: T[]) => boolean | void
): T[] {
  if (!collection || !collection.length) {
    return collection;
  }

  for (let i = 0; i < collection.length; i++) {
    const result = iteratee(collection[i], i, collection);
    if (result === false) {
      break;
    }
  }

  return collection;
}

/**
 * This method is like forEach except that it iterates over elements of
 * collection from right to left.
 *
 * @param collection - The collection to iterate over
 * @param iteratee - The function invoked per iteration
 * @returns The collection
 *
 * @example
 * ```ts
 * forEachRight([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `2` then `1`.
 * ```
 */
export function forEachRight<T>(
  collection: T[],
  iteratee: (value: T, index: number, collection: T[]) => boolean | void
): T[] {
  if (!collection || !collection.length) {
    return collection;
  }

  for (let i = collection.length - 1; i >= 0; i--) {
    const result = iteratee(collection[i], i, collection);
    if (result === false) {
      break;
    }
  }

  return collection;
}

// Aliases
export const each = forEach;
export const eachRight = forEachRight;
