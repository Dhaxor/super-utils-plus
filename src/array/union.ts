import { isEqual } from '../utils/is';

/**
 * Creates an array of unique values, in order, from all given arrays.
 * 
 * @param arrays - The arrays to inspect
 * @returns The new array of combined unique values
 * 
 * @example
 * ```ts
 * union([2], [1, 2]);
 * // => [2, 1]
 * ```
 */
export function union<T>(...arrays: T[][]): T[] {
  if (!arrays.length) {
    return [];
  }
  
  return [...new Set(arrays.flat())];
}

/**
 * Creates an array of unique values, in order, from all given arrays
 * using deep equality comparison.
 * 
 * @param arrays - The arrays to inspect
 * @returns The new array of combined unique values
 * 
 * @example
 * ```ts
 * unionDeep([{ 'x': 1 }], [{ 'x': 1 }, { 'x': 2 }]);
 * // => [{ 'x': 1 }, { 'x': 2 }]
 * ```
 */
export function unionDeep<T>(...arrays: T[][]): T[] {
  if (!arrays.length) {
    return [];
  }
  
  const result: T[] = [];
  const flattened = arrays.flat();
  
  for (const item of flattened) {
    // Only add if not already in result using deep equality
    if (!result.some(resultItem => isEqual(resultItem, item))) {
      result.push(item);
    }
  }
  
  return result;
}

/**
 * Creates an array of unique values, in order, from all given arrays
 * using a custom iteratee function.
 * 
 * @param arrays - The arrays to inspect with the last argument being a function or property name
 * @returns The new array of combined unique values
 * 
 * @example
 * ```ts
 * unionBy([2.1], [1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 * 
 * unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 * ```
 */
export function unionBy<T, K = T>(
  ...arrays: [...T[][], ((value: T) => K) | keyof T]
): T[] {
  if (arrays.length <= 1) {
    return [];
  }
  
  const iteratee = arrays.pop() as ((value: T) => K) | keyof T;
  const iterateeFn = typeof iteratee === 'function' 
    ? iteratee as (value: T) => K
    : (obj: T) => obj[iteratee as keyof T] as unknown as K;
  
  const flattened = (arrays as T[][]).flat();
  const result: T[] = [];
  const seen = new Set<K>();
  
  for (const item of flattened) {
    const transformed = iterateeFn(item);
    
    // Check if we've seen this transformed value before
    if (!seen.has(transformed)) {
      seen.add(transformed);
      result.push(item);
    }
  }
  
  return result;
}