import { isArray, isObject } from '../utils/is';
import { DeepPartial } from '../utils/types';

/**
 * Recursively merges own and inherited enumerable string keyed properties of source
 * objects into the destination object. Source properties that resolve to undefined
 * are skipped if a destination value exists. Array and plain object properties are
 * merged recursively. Other objects and value types are overridden by assignment.
 * 
 * @param object - The destination object
 * @param sources - The source objects
 * @returns The destination object
 * 
 * @example
 * ```ts
 * const object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 * 
 * const other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 * 
 * merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 * ```
 */
export function merge<T extends object>(
  object: T,
  ...sources: Array<DeepPartial<T>>
): T {
  if (!sources.length) {
    return object;
  }
  
  const source = sources.shift();
  
  if (isObject(object) && isObject(source)) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const srcValue = source[key];
        const objValue = (object as Record<string, any>)[key];
        
        // Skip undefined values
        if (srcValue === undefined) {
          continue;
        }
        
        // Recursively merge arrays
        if (isArray(srcValue) && isArray(objValue)) {
          (object as Record<string, any>)[key] = mergeArrays(objValue, srcValue);
        }
        // Recursively merge objects
        else if (isObject(srcValue) && isObject(objValue)) {
          (object as Record<string, any>)[key] = merge(
            objValue,
            srcValue as DeepPartial<typeof objValue>
          );
        }
        // Otherwise simply assign
        else {
          (object as Record<string, any>)[key] = srcValue;
        }
      }
    }
  }
  
  // Continue merging with the next source
  return sources.length ? merge(object, ...sources) : object;
}

/**
 * Merges two arrays by index, recursively merging objects at the same position.
 */
function mergeArrays<T>(arr1: T[], arr2: T[]): T[] {
  const result = [...arr1];
  
  for (let i = 0; i < arr2.length; i++) {
    const item2 = arr2[i];
    
    // If we're beyond the bounds of arr1, simply append
    if (i >= arr1.length) {
      result.push(item2);
      continue;
    }
    
    const item1 = result[i];
    
    // If both items are objects, recursively merge them
    if (isObject(item1) && isObject(item2)) {
      result[i] = merge(
        item1 as object,
        item2 as DeepPartial<typeof item1>
      ) as T;
    }
    // If both items are arrays, recursively merge them
    else if (isArray(item1) && isArray(item2)) {
      result[i] = mergeArrays(item1, item2) as unknown as T;
    }
    // Otherwise use the value from arr2
    else if (item2 !== undefined) {
      result[i] = item2;
    }
  }
  
  return result;
}