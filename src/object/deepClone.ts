import { isArray, isDate, isObject, isRegExp } from '../utils/is';

/**
 * Creates a deep clone of value.
 * Handles arrays, objects, dates, regexps, maps, sets, and primitive types.
 * Functions are referenced, not cloned.
 * 
 * @param value - The value to clone
 * @returns The deep cloned value
 * 
 * @example
 * ```ts
 * const objects = [{ 'a': 1 }, { 'b': 2 }];
 * 
 * const deep = deepClone(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 * ```
 */
export function deepClone<T>(value: T): T {
  // Handle null, undefined, and primitive types
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  // Handle Dates
  if (isDate(value)) {
    return new Date((value as Date).getTime()) as unknown as T;
  }
  
  // Handle RegExps
  if (isRegExp(value)) {
    const flags = (value as RegExp).flags;
    const result = new RegExp((value as RegExp).source, flags);
    result.lastIndex = (value as RegExp).lastIndex;
    return result as unknown as T;
  }
  
  // Handle Maps
  if (value instanceof Map) {
    const result = new Map();
    (value as Map<any, any>).forEach((val, key) => {
      result.set(deepClone(key), deepClone(val));
    });
    return result as unknown as T;
  }
  
  // Handle Sets
  if (value instanceof Set) {
    const result = new Set();
    (value as Set<any>).forEach((val) => {
      result.add(deepClone(val));
    });
    return result as unknown as T;
  }
  
  // Handle Arrays
  if (isArray(value)) {
    return (value as any[]).map(item => deepClone(item)) as unknown as T;
  }
  
  // Handle plain Objects
  if (isObject(value)) {
    const result: Record<string, any> = {};
    
    Object.entries(value as Record<string, any>).forEach(([key, val]) => {
      result[key] = deepClone(val);
    });
    
    return result as unknown as T;
  }
  
  // For other types like Functions, return as is
  return value;
}