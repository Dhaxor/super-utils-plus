import { isNil, isString, isArray } from '../utils/is';
import { PropertyPath } from '../utils/types';

/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned.
 * 
 * @param object - The object to query
 * @param path - The path of the property to get
 * @param defaultValue - The value returned for undefined resolved values
 * @returns The resolved value
 * 
 * @example
 * ```ts
 * const object = { 'a': [{ 'b': { 'c': 3 } }] };
 * 
 * get(object, 'a[0].b.c');
 * // => 3
 * 
 * get(object, ['a', '0', 'b', 'c']);
 * // => 3
 * 
 * get(object, 'a.b.c', 'default');
 * // => 'default'
 * ```
 */
export function get<T = any>(
  object: any, 
  path: PropertyPath, 
  defaultValue?: T
): T | undefined {
  if (isNil(object)) {
    return defaultValue;
  }
  
  const segments: (string | number | symbol)[] = 
    isString(path) ? parsePath(path as string) : 
    isArray(path) ? path as (string | number | symbol)[] : 
    [path as string | number | symbol];
  
  let result = object;
  
  for (let i = 0; i < segments.length; i++) {
    if (isNil(result)) {
      return defaultValue;
    }
    
    result = result[segments[i]];
  }
  
  return isNil(result) ? defaultValue : result as T;
}

/**
 * Parses a string path into path segments.
 * Supports dot notation and bracket notation.
 * 
 * @param path - The path to parse
 * @returns An array of path segments
 * 
 * @example
 * ```ts
 * parsePath('a[0].b.c');
 * // => ['a', 0, 'b', 'c']
 * ```
 */
function parsePath(path: string): (string | number)[] {
  // Split by dots, but not within brackets
  const segments: (string | number)[] = [];
  let currentSegment = '';
  let inBrackets = false;
  
  for (let i = 0; i < path.length; i++) {
    const char = path[i];
    
    if (char === '[') {
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = '';
      }
      inBrackets = true;
    } else if (char === ']') {
      // If it's a number in brackets, convert to number
      if (/^\\d+$/.test(currentSegment)) {
        segments.push(parseInt(currentSegment, 10));
      } else {
        segments.push(currentSegment);
      }
      currentSegment = '';
      inBrackets = false;
    } else if (char === '.' && !inBrackets) {
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = '';
      }
    } else {
      currentSegment += char;
    }
  }
  
  if (currentSegment) {
    segments.push(currentSegment);
  }
  
  return segments;
}