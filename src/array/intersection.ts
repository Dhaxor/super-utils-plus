import { isEqual } from '../utils/is';

/**
 * Creates an array of unique values that are included in all given arrays.
 * 
 * @param arrays - The arrays to inspect
 * @returns The new array of intersecting values
 * 
 * @example
 * ```ts
 * intersection([2, 1], [2, 3]);
 * // => [2]
 * ```
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (!arrays.length) {
    return [];
  }
  
  if (arrays.length === 1) {
    return [...new Set(arrays[0])];
  }
  
  const result: T[] = [];
  const [first, ...rest] = arrays;
  
  // Use a Set for better performance when checking the first array
  const uniqueFirst = [...new Set(first)];
  
  for (const item of uniqueFirst) {
    // Check if item is in all other arrays
    if (rest.every(array => array.includes(item))) {
      result.push(item);
    }
  }
  
  return result;
}

/**
 * Creates an array of unique values that are included in all given arrays
 * using deep equality comparison.
 * 
 * @param arrays - The arrays to inspect
 * @returns The new array of intersecting values
 * 
 * @example
 * ```ts
 * intersectionDeep([{ 'x': 1 }, { 'x': 2 }], [{ 'x': 1 }, { 'x': 3 }]);
 * // => [{ 'x': 1 }]
 * ```
 */
export function intersectionDeep<T>(...arrays: T[][]): T[] {
  if (!arrays.length) {
    return [];
  }
  
  if (arrays.length === 1) {
    return [...new Set(arrays[0])];
  }
  
  const [first, ...rest] = arrays;
  const result: T[] = [];
  
  // Create a new array with unique values from the first array
  const uniqueFirst: T[] = [];
  for (const item of first) {
    if (!uniqueFirst.some(uniqueItem => isEqual(uniqueItem, item))) {
      uniqueFirst.push(item);
    }
  }
  
  for (const item of uniqueFirst) {
    // Check if item is in all other arrays using deep equality
    if (rest.every(array => 
      array.some(arrayItem => isEqual(arrayItem, item))
    )) {
      result.push(item);
    }
  }
  
  return result;
}

/**
 * Creates an array of unique values that are included in all given arrays
 * using a custom iteratee function.
 * 
 * @param arrays - The arrays to inspect with the last array being a function or property name
 * @returns The new array of intersecting values
 * 
 * @example
 * ```ts
 * intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [2.1]
 * 
 * intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }]
 * ```
 */
export function intersectionBy<T, K = T>(
  ...arrays: [...T[][], ((value: T) => K) | keyof T]
): T[] {
  if (arrays.length <= 1) {
    return [];
  }
  
  const iteratee = arrays.pop() as ((value: T) => K) | keyof T;
  const iterateeFn = typeof iteratee === 'function' 
    ? iteratee as (value: T) => K
    : (obj: T) => obj[iteratee as keyof T] as unknown as K;
  
  const [first, ...rest] = arrays as T[][];
  const result: T[] = [];
  
  // Create a map of transformed values to the original item for the first array
  const firstMap = new Map<K, T[]>();
  
  for (const item of first) {
    const transformed = iterateeFn(item);
    if (!firstMap.has(transformed)) {
      firstMap.set(transformed, []);
    }
    firstMap.get(transformed)!.push(item);
  }
  
  // Check each transformed value against other arrays
  for (const [key, items] of firstMap.entries()) {
    if (rest.every(array => 
      array.some(item => isEqual(iterateeFn(item), key))
    )) {
      // Add all items with this transformed value
      result.push(...items);
    }
  }
  
  return result;
}