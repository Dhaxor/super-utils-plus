import { isArray, isNil, isString } from '../utils/is';
import { PropertyPath } from '../utils/types';

/**
 * Sets the value at path of object. If a portion of path doesn't exist, it's created.
 * Arrays are created for missing index properties while objects are created for all
 * other missing properties.
 * 
 * @param object - The object to modify
 * @param path - The path of the property to set
 * @param value - The value to set
 * @returns The modified object
 * 
 * @example
 * ```ts
 * const object = { 'a': [{ 'b': { 'c': 3 } }] };
 * 
 * set(object, 'a[0].b.c', 4);
 * // => { 'a': [{ 'b': { 'c': 4 } }] }
 * 
 * set(object, ['x', '0', 'y', 'z'], 5);
 * // => { 'a': [{ 'b': { 'c': 4 } }], 'x': [{ 'y': { 'z': 5 } }] }
 * ```
 */
export function set<T extends object, V>(
  object: T,
  path: PropertyPath,
  value: V
): T {
  if (isNil(object)) {
    return object;
  }
  
  const segments: (string | number | symbol)[] = 
    isString(path) ? parsePath(path as string) : 
    isArray(path) ? path as (string | number | symbol)[] : 
    [path as string | number | symbol];
  
  if (!segments.length) {
    return object;
  }
  
  const root = object;
  const lastIndex = segments.length - 1;
  
  // Create nested properties if they don't exist
  let current: any = root;
  
  for (let i = 0; i < lastIndex; i++) {
    const segment = segments[i];
    const nextSegment = segments[i + 1];
    const isNextIndexProperty = typeof nextSegment === 'number' || /^\d+$/.test(String(nextSegment));
    
    // If the current segment doesn't exist, create it
    if ((current as Record<string | number | symbol, any>)[segment] === undefined) {
      // Create an array if the next segment is an index, otherwise an object
      (current as Record<string | number | symbol, any>)[segment] = isNextIndexProperty ? [] : {};
    }
    
    current = (current as Record<string | number | symbol, any>)[segment];
    
    // If we unexpectedly hit a primitive value, replace it with an object or array
    if (current === null || typeof current !== 'object') {
      current = (root as Record<string | number | symbol, any>)[segment] = isNextIndexProperty ? [] : {};
    }
  }
  
  // Set the final value
  current[segments[lastIndex]] = value;
  
  return root;
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
      if (/^\d+$/.test(currentSegment)) {
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