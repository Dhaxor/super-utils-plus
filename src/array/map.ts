import { isArray, isObject } from '../utils/is';
import { flatten, flattenDeep } from './flatten';

/**
 * Creates an array of values by running each element in collection through iteratee.
 * 
 * @param collection - The collection to iterate over
 * @param iteratee - The function invoked per iteration
 * @returns The new mapped array
 * 
 * @example
 * ```ts
 * function square(n) {
 *   return n * n;
 * }
 * 
 * map([4, 8], square);
 * // => [16, 64]
 * 
 * map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 * 
 * const users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 * 
 * // The `_.property` iteratee shorthand.
 * map(users, 'user');
 * // => ['barney', 'fred']
 * ```
 */
export function map<T, R>(
  collection: T[],
  iteratee: ((value: T, index: number, collection: T[]) => R) | string
): R[] {
  if (!collection || !collection.length) {
    return [];
  }
  
  // Convert iteratee to a function if it's a string
  let iterateeFn: (value: T, index: number, collection: T[]) => R;
  
  if (typeof iteratee === 'string') {
    const key = iteratee;
    iterateeFn = (value: T) => {
      return isObject(value) ? (value as any)[key] as R : undefined as any;
    };
  } else {
    iterateeFn = iteratee;
  }
  
  return collection.map(iterateeFn);
}

/**
 * Creates a flattened array of values by running each element in collection
 * through iteratee and flattening the mapped results. The iteratee is invoked
 * with three arguments: (value, index|key, collection).
 * 
 * @param collection - The collection to iterate over
 * @param iteratee - The function invoked per iteration
 * @returns The new flattened array
 * 
 * @example
 * ```ts
 * function duplicate(n) {
 *   return [n, n];
 * }
 * 
 * flatMap([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 * ```
 */
export function flatMap<T, R>(
  collection: T[],
  iteratee: ((value: T, index: number, collection: T[]) => R | R[]) | string
): R[] {
  return flatten(map(collection, iteratee as any)) as R[];
}

/**
 * This method is like flatMap except that it recursively flattens the
 * mapped results.
 * 
 * @param collection - The collection to iterate over
 * @param iteratee - The function invoked per iteration
 * @returns The new flattened array
 * 
 * @example
 * ```ts
 * function duplicate(n) {
 *   return [[[n, n]]];
 * }
 * 
 * flatMapDeep([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 * ```
 */
export function flatMapDeep<T, R>(
  collection: T[],
  iteratee: ((value: T, index: number, collection: T[]) => R | R[]) | string
): R[] {
  return flattenDeep(map(collection, iteratee as any)) as R[];
}

/**
 * This method is like flatMap except that it recursively flattens the
 * mapped results up to depth times.
 * 
 * @param collection - The collection to iterate over
 * @param iteratee - The function invoked per iteration
 * @param depth - The maximum recursion depth
 * @returns The new flattened array
 * 
 * @example
 * ```ts
 * function duplicate(n) {
 *   return [[[n, n]]];
 * }
 * 
 * flatMapDepth([1, 2], duplicate, 2);
 * // => [[1, 1], [2, 2]]
 * ```
 */
export function flatMapDepth<T, R>(
  collection: T[],
  iteratee: ((value: T, index: number, collection: T[]) => R | R[]) | string,
  depth = 1
): R[] {
  const mapped = map(collection, iteratee as any);
  
  // Custom flatten with depth
  const flattenWithDepth = (arr: any[], currentDepth: number): any[] => {
    return currentDepth > 0 
      ? arr.reduce((acc: any[], item) => {
          if (isArray(item)) {
            return acc.concat(flattenWithDepth(item, currentDepth - 1));
          }
          return acc.concat(item);
        }, [])
      : arr;
  };
  
  return flattenWithDepth(mapped, depth) as R[];
}