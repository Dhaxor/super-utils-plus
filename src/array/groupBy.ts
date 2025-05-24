import { isFunction } from '../utils/is';

/**
 * Creates an object composed of keys generated from the results of running each element
 * of collection through iteratee. The corresponding value of each key is an array of
 * elements responsible for generating the key.
 * 
 * @param array - The collection to iterate over
 * @param iteratee - The function invoked per iteration or property name to group by
 * @returns The composed aggregate object
 * 
 * @example
 * ```ts
 * groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 * 
 * groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 * ```
 */
export function groupBy<T>(
  array: T[],
  iteratee: ((value: T) => string | number) | keyof T
): Record<string, T[]> {
  if (!array || !array.length) {
    return {};
  }
  
  const result: Record<string, T[]> = {};
  const iterateeFn = isFunction(iteratee)
    ? iteratee as (value: T) => string | number
    : (obj: T) => String(obj[iteratee as keyof T]);
  
  for (const element of array) {
    const key = String(iterateeFn(element));
    
    if (!result[key]) {
      result[key] = [];
    }
    
    result[key].push(element);
  }
  
  return result;
}