/**
 * Reduces collection to a value which is the accumulated result of running
 * each element in collection through iteratee, where each successive
 * invocation is supplied the return value of the previous. If accumulator
 * is not given, the first element of collection is used as the initial value.
 *
 * @param collection - The collection to iterate over
 * @param iteratee - The function invoked per iteration
 * @param accumulator - The initial value
 * @returns The accumulated value
 *
 * @example
 * ```ts
 * reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 * ```
 */
export function reduce<T, R>(
  collection: T[],
  iteratee: (accumulator: R, value: T, index: number, collection: T[]) => R,
  accumulator: R
): R {
  if (!collection || !collection.length) {
    return accumulator;
  }

  let result = accumulator;

  for (let i = 0; i < collection.length; i++) {
    result = iteratee(result, collection[i], i, collection);
  }

  return result;
}

/**
 * This method is like reduce except that it iterates over elements of
 * collection from right to left.
 *
 * @param collection - The collection to iterate over
 * @param iteratee - The function invoked per iteration
 * @param accumulator - The initial value
 * @returns The accumulated value
 *
 * @example
 * ```ts
 * const array = [[0, 1], [2, 3], [4, 5]];
 *
 * reduceRight(array, function(flattened, other) {
 *   return flattened.concat(other);
 * }, []);
 * // => [4, 5, 2, 3, 0, 1]
 * ```
 */
export function reduceRight<T, R>(
  collection: T[],
  iteratee: (accumulator: R, value: T, index: number, collection: T[]) => R,
  accumulator: R
): R {
  if (!collection || !collection.length) {
    return accumulator;
  }

  let result = accumulator;

  for (let i = collection.length - 1; i >= 0; i--) {
    result = iteratee(result, collection[i], i, collection);
  }

  return result;
}
