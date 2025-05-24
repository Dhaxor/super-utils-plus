import { isEqual } from '../utils/is';

/**
 * Creates an array of array values not included in the other given arrays.
 * 
 * @param array - The array to inspect
 * @param values - The arrays of values to exclude
 * @returns The new array of filtered values
 * 
 * @example
 * ```ts
 * difference([2, 1], [2, 3]);
 * // => [1]
 * ```
 */
export function difference<T>(array: T[], ...values: T[][]): T[] {
  if (!array || !array.length) {
    return [];
  }
  
  const excludeSet = new Set(values.flat());
  return array.filter(item => !excludeSet.has(item));
}

/**
 * Creates an array of array values not included in the other given arrays
 * using deep equality comparison.
 * 
 * @param array - The array to inspect
 * @param values - The arrays of values to exclude
 * @returns The new array of filtered values
 * 
 * @example
 * ```ts
 * differenceDeep([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }]);
 * // => [{ 'x': 2 }]
 * ```
 */
export function differenceDeep<T>(array: T[], ...values: T[][]): T[] {
  if (!array || !array.length) {
    return [];
  }
  
  const excludeValues = values.flat();
  
  return array.filter(item => 
    !excludeValues.some(excludeItem => isEqual(item, excludeItem))
  );
}

/**
 * Creates an array of array values not included in the other given arrays
 * using a custom predicate function.
 * 
 * @param array - The array to inspect
 * @param predicate - The function invoked per element to determine if it should be excluded
 * @param values - The arrays of values to exclude
 * @returns The new array of filtered values
 * 
 * @example
 * ```ts
 * differenceBy([2.1, 1.2], Math.floor, [2.3, 3.4]);
 * // => [1.2]
 * 
 * differenceBy([{ 'x': 2 }, { 'x': 1 }], 'x', [{ 'x': 1 }]);
 * // => [{ 'x': 2 }]
 * ```
 */
export function differenceBy<T, K = T>(
  array: T[], 
  iteratee: ((value: T) => K) | keyof T, 
  ...values: T[][]
): T[] {
  if (!array || !array.length) {
    return [];
  }
  
  const excludeValues = values.flat();
  const iterateeFn = typeof iteratee === 'function' 
    ? iteratee 
    : (obj: T) => obj[iteratee as keyof T] as unknown as K;
  
  const excludeValuesTransformed = excludeValues.map(iterateeFn);
  
  return array.filter(item => {
    const transformed = iterateeFn(item);
    return !excludeValuesTransformed.some(excludeItem => 
      isEqual(transformed, excludeItem)
    );
  });
}